package local

import (
	"context"
	"encoding/base64"
	"encoding/binary"
	"errors"
	"hash/crc32"
	"io"
	"io/fs"
	"os"
	"path/filepath"

	"github.com/ONSdigital/dp-census-atlas/scripts/s3sync/storage"
)

// Local implements storage.Filer
type Local struct {
	dir string
}

// New create a new local Filer based at dir.
func New(dir string) (*Local, error) {
	return &Local{
		dir: dir,
	}, nil
}

// Scan recursively reads filenames from the local dir.
func (l *Local) Scan(ctx context.Context) (map[string]*storage.FileInfo, error) {
	FS := os.DirFS(l.dir)

	infos := make(map[string]*storage.FileInfo)

	fcn := func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.Type()&fs.ModeType != 0 {
			return nil // skip non-regular files
		}
		info := &storage.FileInfo{
			Name: path,
		}
		key := storage.PathToKey(path)
		select {
		case <-ctx.Done():
			return errors.New("local walk canceled")
		default:
			infos[key] = info
			return nil
		}
	}

	if err := fs.WalkDir(FS, ".", fcn); err != nil {
		return nil, err
	}
	return infos, nil
}

// Checksum calculates the CRC32 checksum of file name.
func (l *Local) Checksum(_ context.Context, name string) (string, error) {
	buf, err := os.ReadFile(l.fullpath(name))
	if err != nil {
		return "", err
	}

	sum := make([]byte, 4)
	binary.BigEndian.PutUint32(sum, crc32.ChecksumIEEE(buf))
	return base64.StdEncoding.EncodeToString(sum), nil
}

// Remove deletes the file or directory name.
func (l *Local) Remove(_ context.Context, name string) error {
	return os.Remove(l.fullpath(name))
}

// Create creates a file and copies from r to the new file.
// Checksum is not used.
// Caller is responsible for closing r when Create returns.
func (l *Local) Create(_ context.Context, name string, r io.Reader, checksum string) error {
	path := l.fullpath(name)
	dir := filepath.Dir(path)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	tmp := path + ".sync.tmp"
	w, err := os.Create(tmp)
	if err != nil {
		return err
	}

	if _, err := io.Copy(w, r); err != nil {
		w.Close()
		return err
	}
	if err := w.Close(); err != nil {
		return err
	}

	return os.Rename(tmp, path)
}

// Open opens name and returns a ReadCloser.
// Caller is responsible for closing.
func (l *Local) Open(_ context.Context, name string) (io.ReadCloser, error) {
	return os.Open(l.fullpath(name))
}

// fullpath returns name's full path relative to the base directory.
func (l *Local) fullpath(name string) string {
	return filepath.Clean(filepath.Join(l.dir, name))
}
