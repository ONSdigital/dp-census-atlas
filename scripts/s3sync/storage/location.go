package storage

import (
	"errors"
	"strings"
)

// Location is the result of parsing a command line S3 or file location string.
// When Schem is "s3", Bucket and Prefix will be set.
// When Scheme is "file", Path will be set.
type Location struct {
	Scheme string
	Bucket string
	Prefix string
	Path   string
}

const (
	FileScheme = "file"
	S3Scheme   = "s3"
	delim      = "://"
)

// ParseLocation takes a string holding an S3 or file location and returns its components.
// S3 locations are parsed as s3://bucket/prefix.
// Anything that doesn't start with "s3://" is a file location.
// Scheme will be "s3" or "file".
func ParseLocation(s string) (*Location, error) {
	// We don't use url.Parse because standard URIs do not handle drive letters or relative paths.

	if strings.HasPrefix(s, S3Scheme+delim) {
		s = strings.TrimPrefix(s, S3Scheme+delim)
		bucket, prefix, _ := strings.Cut(s, "/")
		if bucket == "" {
			return nil, errors.New("missing bucket in S3 location")
		}
		return &Location{
			Scheme: S3Scheme,
			Bucket: bucket,
			Prefix: prefix,
		}, nil
	}

	if strings.Contains(s, delim) {
		return nil, errors.New("only S3 URIs supported")
	}

	if s == "" {
		return nil, errors.New("file location cannot be empty")
	}

	return &Location{
		Scheme: FileScheme,
		Path:   s,
	}, nil
}
