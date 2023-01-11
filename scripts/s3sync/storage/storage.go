package storage

import (
	"context"
	"io"
)

type Filer interface {
	Scan(ctx context.Context) (files map[string]*FileInfo, err error)
	Checksum(ctx context.Context, name string) (string, error)
	Remove(ctx context.Context, name string) error
	Create(ctx context.Context, name string, r io.Reader, checksum string) error
	Open(ctx context.Context, name string) (r io.ReadCloser, err error)
}

type FileInfo struct {
	Name      string // name of file relative to Filer's base directory, as returned from stat
	Checksum  string // CRC32
	SyncState int    // to be used by syncer
}
