package geo

import (
	"fmt"

	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/types"
)

// Lookup is not a good name for this.
// geoLookup.json is an array of these structs.
type Lookup struct {
	En      string `json:"en"`
	GeoType string `json:"geoType"`
	GeoCode string `json:"geoCode"`
}

// GeoLookup produces the contents of a geoLookup.json file.
// Only geographies of the types listed in geotypes will be included
// in the result.
func (a *Atlas) GeoLookup(geotypes ...types.Geotype) ([]Lookup, error) {
	var lookups []Lookup

	for _, geotype := range geotypes {
		col, ok := a.Collections[geotype]
		if !ok {
			return nil, fmt.Errorf("geotype %s not loaded", geotype)
		}
		for _, feat := range col.Features {
			en := feat.Properties["ename"].(string)
			geotype := feat.Properties["geotype"].(string)
			geocode := feat.Properties["geocode"].(string)
			lookups = append(
				lookups,
				Lookup{
					En:      en,
					GeoType: geotype,
					GeoCode: geocode,
				},
			)
		}
	}

	return lookups, nil
}
