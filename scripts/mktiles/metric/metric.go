package metric

import (
	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/types"
)

// A Table holds a table of metric (category) values.
// Notionally this is a 2x2 table, but it is implemented as
// a map of maps.
// This uses a lot of memory, so a better structure would help.
type Table map[types.Category]map[types.Geocode]types.Value

// Can't think of a decent name for this struct.
type M struct {
	cats    []types.Category // categories we want
	totcats []types.Category // totals categories
	tab     Table
}

func New() *M {
	return &M{
		tab: make(Table),
	}
}
