package main

import "strings"

// ZapSpecial replaces characters that are special to URLs or pathnames with underscores
// and makes the resulting string lower case.
func ZapSpecial(desc string) string {
	mapping := func(c rune) rune {
		if strings.ContainsRune(` '"~/# ?[]()*;&<>|$\=!{}`+"`", c) {
			return '_'
		}
		return c
	}
	return strings.ToLower(strings.Map(mapping, desc))
}
