package types

import "strings"

type Category string
type Geotype string
type Geocode string
type Value float64

// String returns the Geotype in all upper case for consistent formatting and display.
func (g Geotype) String() string {
	return strings.ToUpper(string(g))
}

// Pathname returns the Geotype in all lower case for consistent pathnames.
func (g Geotype) Pathname() string {
	return strings.ToLower(string(g))
}
