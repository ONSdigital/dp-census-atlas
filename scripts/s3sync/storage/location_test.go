package storage

import (
	"testing"
)

func Test_ParseLocation_Errors(t *testing.T) {
	var tests = map[string]string{
		"missing s3 bucket and prefix": "s3://",
		"missing s3 bucket":            "s3:///prefix",
		"file uris not supported":      "file:///path",
		"other uris not supported":     "http://example.com",
		"empty file location":          "",
	}

	for desc, s := range tests {
		if _, err := ParseLocation(s); err == nil {
			t.Errorf("%s (%s): expected error", desc, s)
		}
	}
}

func Test_ParseLocaton(t *testing.T) {
	var tests = map[string]struct {
		s      string
		scheme string
		bucket string
		prefix string
		path   string
	}{
		"just bucket": {
			s:      "s3://bucket/",
			scheme: S3Scheme,
			bucket: "bucket",
			prefix: "",
		},
		"bucket and prefix": {
			s:      "s3://bucket/prefix",
			scheme: S3Scheme,
			bucket: "bucket",
			prefix: "prefix",
		},

		"relative": {
			s:      "./",
			scheme: FileScheme,
			path:   "./",
		},
		"absolute": {
			s:      "/foo",
			scheme: FileScheme,
			path:   "/foo",
		},

		"drive": {
			s:      "C:",
			scheme: FileScheme,
			path:   "C:",
		},
		"drive and relative": {
			s:      `C:dir`,
			scheme: FileScheme,
			path:   `C:dir`,
		},
		"drive and absolute": {
			s:      `C:\Users\foo`,
			scheme: FileScheme,
			path:   `C:\Users\foo`,
		},
	}

	for desc, test := range tests {
		loc, err := ParseLocation(test.s)
		if err != nil {
			t.Errorf("%s (%s): %s", desc, test.s, err)
			continue
		}
		if test.scheme != loc.Scheme {
			t.Errorf("%s: scheme %q, want %q", desc, loc.Scheme, test.scheme)
		}
		if test.bucket != loc.Bucket {
			t.Errorf("%s: bucket %q, want %q", desc, loc.Bucket, test.bucket)
		}
		if test.prefix != loc.Prefix {
			t.Errorf("%s: prefix %q, want %q", desc, loc.Prefix, test.prefix)
		}
		if test.path != loc.Path {
			t.Errorf("%s: path %q, want %q", desc, loc.Path, test.path)
		}
	}
}
