package storage

import (
	"io"
)

type Filer interface {
	Scan() (files map[string]*FileInfo, err error)
	Checksum(name string) (string, error)
	Remove(name string) error
	Create(name string, r io.Reader, checksum string) error
	Open(name string) (r io.ReadCloser, err error)
}

type FileInfo struct {
	Name      string // name of file relative to Filer's base directory, as returned from stat
	Checksum  string // CRC32
	SyncState int    // to be used by syncer
}
