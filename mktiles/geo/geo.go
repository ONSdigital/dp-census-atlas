package geo

import (
	"fmt"
	"log"
	"sort"
	"strings"

	"github.com/ONSdigital/dp-census-atlas/mktiles/types"

	"github.com/twpayne/go-geom"
	"github.com/twpayne/go-geom/encoding/geojson"
)

// These are the standard geotypes we currently work with.
const (
	LAD  = types.Geotype("LAD")
	LSOA = types.Geotype("LSOA")
	MSOA = types.Geotype("MSOA")
	OA   = types.Geotype("OA")
)

// Atlas is the collection of loaded geojson files.
type Atlas struct {
	Collections map[types.Geotype]*geojson.FeatureCollection
	codeTypes   map[types.Geocode]types.Geotype
}

// New returns an empty Atlas.
func New() *Atlas {
	return &Atlas{
		Collections: map[types.Geotype]*geojson.FeatureCollection{},
		codeTypes:   map[types.Geocode]types.Geotype{},
	}
}

// SetStandardProps sets geotype, geocode, ename and wname properties in each Feature,
// and computes a bounding box for each Feature if it doesn't already have one.
func (a *Atlas) SetStandardProps(geotype types.Geotype) error {

	// The 2011 oa.geojson confusingly has a property named LAD11CD
	// in addition to OA11CD.
	standard := map[types.Geotype]map[string]string{
		LAD: map[string]string{
			"lad21cd":  "geocode",
			"lad21nm":  "ename",
			"lad21nmw": "wname",
			"lad11cd":  "geocode",
			"lad11nm":  "ename",
			"lad11nmw": "wname",
			"lad17cd":  "geocode",
			"lad17nm":  "ename",
			"lad17nmw": "wname",
		},
		LSOA: map[string]string{
			"lsoa21cd":  "geocode",
			"lsoa21nm":  "ename",
			"lsoa21nmw": "wname",
			"lsoa11cd":  "geocode",
			"lsoa11nm":  "ename",
			"lsoa11nmw": "wname",
		},
		MSOA: map[string]string{
			"msoa21cd":  "geocode",
			"msoa21nm":  "ename",
			"msoa21nmw": "wname",
			"msoa11cd":  "geocode",
			"msoa11nm":  "ename",
			"msoa11nmw": "wname",
		},
		OA: map[string]string{
			"oa21cd":  "geocode",
			"oa21nm":  "ename",
			"oa21nmw": "wname",
			"oa11cd":  "geocode",
			"oa11nm":  "ename",
			"oa11nmw": "wname",
		},
	}

	for n, feat := range a.Collections[geotype].Features {
		newp := map[string]interface{}{}
		for k, v := range feat.Properties {
			if name, ok := standard[geotype][strings.ToLower(k)]; ok {
				newp[name] = v
			}
		}
		for k, v := range newp {
			feat.Properties[k] = v
		}
		feat.Properties["geotype"] = string(geotype)

		if feat.BBox == nil {
			feat.BBox = feat.Geometry.Bounds()
		}

		feat.Geometry = nil // don't need any more; free up space

		geocode, ok := feat.Properties["geocode"].(string)
		if !ok {
			return fmt.Errorf("%s feature %d: no geocode", geotype, n)
		}
		a.codeTypes[types.Geocode(geocode)] = geotype
	}
	return nil
}

// Geocodes returns a list of all geocodes in Atlas a.
func (a *Atlas) Geocodes() []types.Geocode {
	res := []types.Geocode{}
	for _, col := range a.Collections {
		for _, feat := range col.Features {
			geocode, ok := feat.Properties["geocode"]
			if !ok {
				continue
			}
			s, ok := geocode.(string)
			if !ok {
				log.Panic("can't happen: property geocode is not a string")
			}
			res = append(res, types.Geocode(s))
		}
	}
	return res
}

// Intersects returns a list of geocodes of the given geotype which intersect the given
// bbox.
func (a *Atlas) Intersects(geotype types.Geotype, bbox *geom.Bounds) ([]types.Geocode, error) {
	col, ok := a.Collections[geotype]
	if !ok {
		return nil, fmt.Errorf("geotype %s not loaded", geotype)
	}

	var res []types.Geocode
	for i, feat := range col.Features {
		if bbox.Overlaps(geom.XY, feat.BBox) {
			geocode, ok := feat.Properties["geocode"].(string)
			if !ok {
				return nil, fmt.Errorf("geotype %s: feature %d: no geocode property", geotype, i)
			}
			res = append(res, types.Geocode(geocode))
		}
	}

	// sort results for consistency
	less := func(i, j int) bool {
		return string(res[i]) < string(res[j])
	}
	sort.Slice(res, less)

	return res, nil
}

// GeotypeOf returns the geotype of the given geocode.
// Returns false if the geocode isn't known to Atlas a.
func (a *Atlas) GeotypeOf(geocode types.Geocode) (types.Geotype, bool) {
	t, ok := a.codeTypes[geocode]
	return t, ok
}
