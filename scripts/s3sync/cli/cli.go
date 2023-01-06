package cli

import (
	"errors"
	"flag"
	"fmt"
	"os"
	"strings"

	"github.com/ONSdigital/dp-census-atlas/scripts/s3sync/storage"
	"github.com/ONSdigital/dp-census-atlas/scripts/s3sync/storage/local"
	"github.com/ONSdigital/dp-census-atlas/scripts/s3sync/storage/s3"
	"github.com/ONSdigital/dp-census-atlas/scripts/s3sync/sync"
)

type Syncer interface {
	Sync() error
}

type NewSyncer func(src, dst string, dryrun bool) (Syncer, error)

func New(srcdir, dstdir string, dryrun bool) (Syncer, error) {
	src, err := newFiler(srcdir)
	if err != nil {
		return nil, err
	}

	dst, err := newFiler(dstdir)
	if err != nil {
		return nil, err
	}

	return sync.New(src, dst, dryrun)
}

// newFiler returns either a local or s3 Filer depending on whether s contains a colon.
func newFiler(s string) (storage.Filer, error) {
	before, after, found := strings.Cut(s, ":")
	if !found {
		return local.New(before)
	} else {
		return s3.New(before, after)
	}
}

// CLI prints any error returned from Run and converts the error into an exit value.
func CLI(args []string, new NewSyncer) int {
	err := Run(args, new)
	if err == nil {
		return 0
	}
	fmt.Fprintln(os.Stderr, err)
	return 1
}

// Run parses command arguments and invokes a Syncer.
func Run(args []string, new NewSyncer) error {
	fs := flag.NewFlagSet("s3sync", flag.ContinueOnError)
	dryrun := fs.Bool("n", false, "dryrun")
	src := fs.String("i", "", "source directory or bucket:[prefix]")
	dst := fs.String("o", "", "dest directory or bucket:[prefix]")
	if err := fs.Parse(args); err != nil {
		return err
	}
	if *src == "" {
		return errors.New("source required")
	}
	if *dst == "" {
		return errors.New("dest required")
	}

	syncer, err := new(*src, *dst, *dryrun)
	if err != nil {
		return err
	}

	return syncer.Sync()
}
