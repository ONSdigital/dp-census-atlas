package storage

import (
	"strings"

	"golang.org/x/text/unicode/norm"
)

// Normalise converts a path to its canonical unicode form.
// https://en.wikipedia.org/wiki/Unicode_equivalence
func Normalise(path string) string {
	return norm.NFC.String(path)
}

// PathToKey converts a path to a form usable as a map lookup key for comparison.
// Some filesystems are case-preserving, but case insensitive, and some canonicalise
// unicode, and some don't.
// So to match files whose names differ in case or unicode form, we normalise and
// convert to lower case.
func PathToKey(path string) string {
	return strings.ToLower(Normalise(path))
}
