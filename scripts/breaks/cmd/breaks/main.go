package main

import (
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	indir := flag.String("I", "", "input directory")
	outdir := flag.String("O", "", "output directory")
	flag.Parse()

	var err error
	if *indir == "" && *outdir == "" {
		err = filter()
	} else if *indir == "" || *outdir == "" {
		log.Fatal("must specify both -I and -O, or neither")
	} else {
		err = filterDir(*indir, *outdir)
	}
	if err != nil {
		log.Fatal(err)
	}
}

func filter() error {
	tab, err := Load(os.Stdin)
	if err != nil {
		return err
	}

	vals, err := Extract(tab)
	if err != nil {
		return err
	}

	breaks, err := Calc(vals, 5)
	if err != nil {
		return err
	}

	buf, err := json.MarshalIndent(breaks, "", "    ")
	if err != nil {
		return err
	}

	if _, err = fmt.Printf("%s\n", string(buf)); err != nil {
		return err
	}

	return nil
}

func filterDir(indir, outdir string) error {
	fileSystem := os.DirFS(indir)

	walkFcn := func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		if !d.Type().IsRegular() {
			return nil
		}

		if !strings.EqualFold(filepath.Ext(d.Name()), ".csv") {
			return nil
		}

		in, err := os.Open(filepath.Join(indir, path))
		if err != nil {
			return err
		}
		defer in.Close()

		tab, err := Load(in)
		if err != nil {
			return err
		}

		vals, err := Extract(tab)
		if errors.Is(err, ErrInvalidTable) {
			log.Printf("%s: %s, skipping", path, err)
			return nil
		} else if err != nil {
			return err
		}

		breaks, err := Calc(vals, 5)
		if errors.Is(err, ErrNotEnoughData) {
			log.Printf("%s: %s, skipping", path, err)
			return nil
		} else if err != nil {
			return err
		}

		fname := changeExt(filepath.Join(outdir, path))
		return saveJson(fname, breaks)
	}

	return fs.WalkDir(fileSystem, ".", walkFcn)
}

func changeExt(path string) string {
	ext := filepath.Ext(path)
	path = strings.TrimSuffix(path, ext)
	return path + ".json"
}

func saveJson(path string, breaks []float64) error {
	buf, err := json.MarshalIndent(breaks, "", "    ")
	if err != nil {
		return err
	}

	dir := filepath.Dir(path)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	if err := os.WriteFile(path+".new", buf, 0644); err != nil {
		return err
	}

	return os.Rename(path+".new", path)
}
