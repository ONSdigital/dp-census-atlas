package diffr

import (
	"bytes"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func CompareDirs(left, right string) error {
	leftFiles, err := loadFiles(left)
	if err != nil {
		return err
	}
	rightFiles, err := loadFiles(right)
	if err != nil {
		return err
	}

	if len(leftFiles) != len(rightFiles) {
		return fmt.Errorf("different number of files in %s and %s", left, right)
	}

	for name, leftbuf := range leftFiles {
		leftbuf = bytes.ReplaceAll(leftbuf, []byte("\r"), nil)
		rightbuf, ok := rightFiles[name]
		if !ok {
			return fmt.Errorf("file %s not in dir %s", name, right)
		}
		rightbuf = bytes.ReplaceAll(rightbuf, []byte("\r"), nil)
		if !bytes.Equal(rightbuf, leftbuf) {
			return fmt.Errorf("file %s does not match", name)
		}
	}
	return nil
}

func loadFiles(dir string) (map[string][]byte, error) {
	files, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}

	res := make(map[string][]byte, len(files))

	for _, file := range files {
		if strings.HasPrefix(file.Name(), ".") {
			continue
		}
		if !file.Type().IsRegular() {
			continue
		}
		buf, err := os.ReadFile(filepath.Join(dir, file.Name()))
		if err != nil {
			return nil, err
		}
		res[file.Name()] = buf
	}
	return res, nil
}
