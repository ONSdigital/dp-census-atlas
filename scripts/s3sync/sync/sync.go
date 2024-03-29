package sync

import (
	"context"
	"errors"
	"log"
	"sync"

	"github.com/ONSdigital/dp-census-atlas/scripts/s3sync/storage"
)

const (
	stateUnknown   int = iota // state not known yet (zero value)
	stateMissing              // src: missing from dst
	stateDifferent            // src: exists in dst, but different
	stateSame                 // src: exists in dst and same size and modtime
	stateSeen                 // dst: exists in src
)

type Syncer struct {
	src      storage.Filer
	dst      storage.Filer
	srcfiles map[string]*storage.FileInfo
	dstfiles map[string]*storage.FileInfo
	dryrun   bool
	nodelete bool
	nocsumok bool // true if missing checksum is ok
	workers  int  // number of concurrent checksum/copy/rm workers
}

// New returns a new Syncer which can sync from src to dst.
func New(src, dst storage.Filer, dryrun, nodelete, nocsumok bool, workers int) (*Syncer, error) {
	if workers < 0 {
		workers = 1
	}
	return &Syncer{
		src:      src,
		dst:      dst,
		dryrun:   dryrun,
		nodelete: nodelete,
		nocsumok: nocsumok,
		workers:  workers,
	}, nil
}

// Sync runs the sync from src to dst.
func (s *Syncer) Sync(ctx context.Context) error {
	log.Println("Scanning files in src")
	srcfiles, err := s.src.Scan(ctx)
	if err != nil {
		return err
	}
	s.srcfiles = srcfiles
	log.Printf("\tfound %d files\n", len(srcfiles))

	log.Println("Scanning files in dst")
	dstfiles, err := s.dst.Scan(ctx)
	if err != nil {
		return err
	}
	s.dstfiles = dstfiles
	log.Printf("\tfound %d files\n", len(dstfiles))

	log.Println("Comparing checksums")
	if err := s.diff(ctx); err != nil {
		return err
	}

	log.Println("Copying new files to dst")
	if err := s.copy(ctx, stateMissing); err != nil {
		return err
	}

	log.Printf("Copying changed files to dst")
	if err := s.copy(ctx, stateDifferent); err != nil {
		return err
	}

	if !s.nodelete {
		log.Printf("Removing deleted files from dst")
		if err := s.delete(ctx); err != nil {
			return err
		}
	}
	return nil
}

// diff determines which files are different or missing between src and dst.
func (s *Syncer) diff(ctx context.Context) error {
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	// this function generates a list of paths to diff
	generate := func() <-chan string {
		queue := make(chan string)
		go func() {
			defer close(queue)
			for key := range s.srcfiles {
				select {
				case <-ctx.Done():
					return
				case queue <- key:
				}
			}
		}()
		return queue
	}

	// this function processes each path in the queue and sends results to the returned channel.
	process := func(queue <-chan string) <-chan error {
		var wg sync.WaitGroup
		results := make(chan error)

		worker := func() {
			defer wg.Done()
			for key := range queue {
				err := s.diffOne(ctx, key)
				select {
				case results <- err:
				case <-ctx.Done():
					return
				}
			}
		}

		wg.Add(s.workers)
		for i := 0; i < s.workers; i++ {
			go worker()
		}

		go func() {
			wg.Wait()
			close(results)
		}()

		return results
	}

	results := process(generate())

	var err error
	for result := range results {
		if result != nil {
			err = result
			break // keep first error
		}
	}
	if err != nil {
		return err
	}
	return ctx.Err()

	/*
		// non concurrent version
		for key, _ := range s.srcfiles {
			if err := s.diffOne(ctx, key); err != nil {
				return err
			}
		}
		return nil
	*/
}

// diffOne compares a single path in src and dst.
func (s *Syncer) diffOne(ctx context.Context, key string) error {
	src, ok := s.srcfiles[key]
	if !ok {
		return errors.New("key not in source")
	}
	srcsum, err := s.src.Checksum(ctx, src.Name)
	if s.nocsumok && errors.Is(err, storage.ErrMissingChecksum) {
		srcsum = storage.MissingChecksum
	} else if err != nil {
		return err
	}
	src.Checksum = srcsum

	dst, ok := s.dstfiles[key]
	if !ok {
		src.SyncState = stateMissing
		return nil
	}

	dstsum, err := s.dst.Checksum(ctx, dst.Name)
	if s.nocsumok && errors.Is(err, storage.ErrMissingChecksum) {
		dstsum = storage.MissingChecksum
	} else if err != nil {
		return err
	}
	dst.Checksum = dstsum

	if srcsum == storage.MissingChecksum || dstsum == storage.MissingChecksum {
		src.SyncState = stateDifferent
	} else if srcsum == dstsum {
		src.SyncState = stateSame
	} else {
		src.SyncState = stateDifferent
	}
	dst.SyncState = stateSeen
	return nil
}

// copy copies all files from src to dst where source state equals state.
func (s *Syncer) copy(ctx context.Context, state int) error {
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	type job struct {
		name     string
		checksum string
	}

	// this function generates a list of files to copy
	generate := func() <-chan job {
		queue := make(chan job)
		go func() {
			defer close(queue)
			for _, src := range s.srcfiles {
				if src.SyncState != state {
					continue
				}
				j := job{
					name:     src.Name,
					checksum: src.Checksum,
				}
				select {
				case queue <- j:
				case <-ctx.Done():
					return
				}
			}
		}()
		return queue
	}

	// this function copies each file and sends results to the returned channel.
	process := func(queue <-chan job) <-chan error {
		var wg sync.WaitGroup
		results := make(chan error)

		worker := func() {
			defer wg.Done()
			for j := range queue {
				log.Printf("\t%s\n", j.name)
				var err error
				if !s.dryrun {
					err = s.copyOne(ctx, j.name, j.checksum)
				}
				select {
				case results <- err:
				case <-ctx.Done():
					return
				}
			}
		}

		wg.Add(s.workers)
		for i := 0; i < s.workers; i++ {
			go worker()
		}

		go func() {
			wg.Wait()
			close(results)
		}()

		return results
	}

	results := process(generate())

	var err error
	for result := range results {
		if result != nil {
			err = result
			break // keep first error
		}
	}
	if err != nil {
		return err
	}
	return ctx.Err()

	/*
		// non parallel version
		for _, src := range s.srcfiles {
			if src.SyncState != state {
				continue
			}
			log.Printf("\t%s\n", src.Name)
			if s.dryrun {
				continue
			}
			if err := s.copyOne(ctx, src.Name, src.Checksum); err != nil {
				return err
			}
		}
		return nil
	*/
}

// copyOne copies a single file from src to dest
func (s *Syncer) copyOne(ctx context.Context, name, checksum string) error {
	r, err := s.src.Open(ctx, name)
	if err != nil {
		return err
	}
	if err := s.dst.Create(ctx, name, r, checksum); err != nil {
		r.Close()
		return err
	}
	return r.Close()
}

// delete removes all files from dst where dst state is not stateSeen.
func (s *Syncer) delete(ctx context.Context) error {
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	// this function generates a list of paths to remove
	generate := func() <-chan string {
		queue := make(chan string)
		go func() {
			defer close(queue)
			for _, dst := range s.dstfiles {
				if dst.SyncState == stateSeen {
					continue
				}
				select {
				case queue <- dst.Name:
				case <-ctx.Done():
					return
				}
			}
		}()
		return queue
	}

	// this function deletes each path in the queue and sends results on the returned channel.
	process := func(queue <-chan string) <-chan error {
		var wg sync.WaitGroup
		results := make(chan error)

		worker := func() {
			defer wg.Done()
			for key := range queue {
				log.Printf("\t%s\n", key)
				var err error
				if !s.dryrun {
					err = s.dst.Remove(ctx, key)
				}
				select {
				case results <- err:
				case <-ctx.Done():
					return
				}
			}
		}

		wg.Add(s.workers)
		for i := 0; i < s.workers; i++ {
			go worker()
		}

		go func() {
			wg.Wait()
			close(results)
		}()

		return results
	}

	results := process(generate())

	var err error
	for result := range results {
		if result != nil {
			err = result
			break // keep first error
		}
	}
	if err != nil {
		return err
	}
	return ctx.Err()

	/*
		// non concurrent version
		for _, dst := range s.dstfiles {
			if dst.SyncState == stateSeen {
				continue
			}
			log.Printf("\tremove %s\n", dst.Name)
			if s.dryrun {
				continue
			}
			if err := s.dst.Remove(ctx, dst.Name); err != nil {
				return err
			}
		}
		return nil
	*/
}
