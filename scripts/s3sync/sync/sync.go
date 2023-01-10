package sync

import (
	"log"

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
func (s *Syncer) Sync() error {
	log.Println("Scanning files in src")
	srcfiles, err := s.src.Scan()
	if err != nil {
		return err
	}
	s.srcfiles = srcfiles
	log.Printf("\tfound %d files\n", len(srcfiles))

	log.Println("Scanning files in dst")
	dstfiles, err := s.dst.Scan()
	if err != nil {
		return err
	}
	s.dstfiles = dstfiles
	log.Printf("\tfound %d files\n", len(dstfiles))

	log.Println("Comparing checksums")
	if err := s.diff(); err != nil {
		return err
	}

	log.Println("Copying new files to dst")
	if err := s.copy(stateMissing); err != nil {
		return err
	}

	log.Printf("Copying changed files to dst")
	if err := s.copy(stateDifferent); err != nil {
		return err
	}

	if !s.nodelete {
		log.Printf("Removing deleted files from dst")
		if err := s.delete(); err != nil {
			return err
		}
	}
	return nil
}

// diff determines which files are different or missing between src and dst.
func (s *Syncer) diff() error {
	for key, src := range s.srcfiles {
		srcsum, err := s.src.Checksum(src.Name)
		if err != nil {
			return err
		}
		src.Checksum = srcsum

		dst, ok := s.dstfiles[key]
		if !ok {
			src.SyncState = stateMissing
			continue
		}

		dstsum, err := s.dst.Checksum(dst.Name)
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
	}
	return nil
}

// copy copies all files from src to dst where source state equals state.
func (s *Syncer) copy(state int) error {
	for _, src := range s.srcfiles {
		if src.SyncState != state {
			continue
		}
		log.Printf("\t%s\n", src.Name)
		if s.dryrun {
			continue
		}
		r, err := s.src.Open(src.Name)
		if err != nil {
			return err
		}
		if err := s.dst.Create(src.Name, r, src.Checksum); err != nil {
			r.Close()
			return err
		}
	}
	return nil
}

// delete removes all files from dst where dst state is not stateSeen.
func (s *Syncer) delete() error {
	for _, dst := range s.dstfiles {
		if dst.SyncState == stateSeen {
			continue
		}
		log.Printf("\tremove %s\n", dst.Name)
		if s.dryrun {
			continue
		}
		s.dst.Remove(dst.Name)
	}
	return nil
}
