package cli

import (
	"context"
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
	Sync(ctx context.Context) error
}

type NewSyncer func(src, dst string, dryrun, nodelete, nocsumok bool) (Syncer, error)

func New(srcdir, dstdir string, dryrun, nodelete, nocsumok bool) (Syncer, error) {
	src, err := newFiler(srcdir)
	if err != nil {
		return nil, err
	}

	dst, err := newFiler(dstdir)
	if err != nil {
		return nil, err
	}

	return sync.New(src, dst, dryrun, nodelete, nocsumok)
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
	nocsumok := fs.Bool("C", false, "missing checksum on S3 objects is ok")
	nodelete := fs.Bool("D", false, "do not delete files on destination")
	fs.Usage = func() {
		fmt.Fprintf(fs.Output(), "Usage: %s [flags] <src> <dst>\n", os.Args[0])
		fmt.Fprintf(fs.Output(), "where: src and dst are either local directories or <bucket>:[prefix]\n")
		fs.PrintDefaults()
	}
	if err := fs.Parse(args); err != nil {
		return err
	}

	src := fs.Arg(0)
	if src == "" {
		fs.Usage()
		return errors.New("source required")
	}

	dst := fs.Arg(1)
	if dst == "" {
		fs.Usage()
		return errors.New("dest required")
	}

	syncer, err := new(src, dst, *dryrun, *nodelete, *nocsumok)
	if err != nil {
		return err
	}

	return syncer.Sync(context.Background())
}
