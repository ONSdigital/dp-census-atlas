package cli

import (
	"errors"
	"flag"
	"fmt"
	"os"

	"github.com/ONSdigital/dp-census-atlas/scripts/s3sync/sync"
)

type Syncer interface {
	Sync() error
}

type NewSyncer func(src, bucket, prefix string) (Syncer, error)

func New(src, bucket, prefix string) (Syncer, error) {
	return sync.New(src, bucket, prefix)
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
	src := fs.String("i", "", "source directory")
	bucket := fs.String("b", "", "bucket name")
	prefix := fs.String("p", "", "prefix")
	if err := fs.Parse(args); err != nil {
		return err
	}
	if *src == "" || *bucket == "" || *prefix == "" {
		return errors.New("source directory, bucket and prefix are all required")
	}

	syncer, err := new(*src, *bucket, *prefix)
	if err != nil {
		return err
	}

	return syncer.Sync()
}
