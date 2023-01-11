package sync

import (
	"context"
	"errors"
	"log"
	"os"
	"runtime"
	"strconv"
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
}

// New returns a new Syncer which can sync from src to dst.
func New(src, dst storage.Filer, dryrun, nodelete bool) (*Syncer, error) {
	return &Syncer{
		src:      src,
		dst:      dst,
		dryrun:   dryrun,
		nodelete: nodelete,
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
	process := func(queue <-chan string, nworkers int) <-chan error {
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

		wg.Add(nworkers)
		for i := 0; i < nworkers; i++ {
			go worker()
		}

		go func() {
			wg.Wait()
			close(results)
		}()

		return results
	}

	results := process(generate(), envConc("S3SYNC_DIFF_CONCURRENCY", runtime.NumCPU()))

	var err error
	for result := range results {
		if result != nil {
			err = result
			cancel()
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
	if err != nil {
		return err
	}
	src.Checksum = srcsum

	dst, ok := s.dstfiles[key]
	if !ok {
		src.SyncState = stateMissing
		return nil
	}

	dstsum, err := s.dst.Checksum(ctx, dst.Name)
	if err != nil {
		return err
	}
	dst.Checksum = dstsum

	if srcsum == dstsum {
		src.SyncState = stateSame
	} else {
		src.SyncState = stateDifferent
	}
	dst.SyncState = stateSeen
	return nil
}

// copy copies all files from src to dst where source state equals state.
func (s *Syncer) copy(ctx context.Context, state int) error {
	for _, src := range s.srcfiles {
		if src.SyncState != state {
			continue
		}
		log.Printf("\t%s\n", src.Name)
		if s.dryrun {
			continue
		}
		r, err := s.src.Open(ctx, src.Name)
		if err != nil {
			return err
		}
		if err := s.dst.Create(ctx, src.Name, r, src.Checksum); err != nil {
			r.Close()
			return err
		}
	}
	return nil
}

// delete removes all files from dst where dst state is not stateSeen.
func (s *Syncer) delete(ctx context.Context) error {
	for _, dst := range s.dstfiles {
		if dst.SyncState == stateSeen {
			continue
		}
		log.Printf("\tremove %s\n", dst.Name)
		if s.dryrun {
			continue
		}
		s.dst.Remove(ctx, dst.Name)
	}
	return nil
}

// envConc returns a concurrency value from an environment variable
func envConc(name string, def int) int {
	n, err := strconv.ParseInt(os.Getenv(name), 10, 0)
	if err != nil {
		return def
	} else if n < 1 {
		return 1
	} else if n > 32 {
		return 32 // arbitrary
	}
	return int(n)
}
