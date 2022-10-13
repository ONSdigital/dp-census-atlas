package metric

import (
	"testing"

	"github.com/ONSdigital/dp-census-atlas/mktiles/types"
)

func Test_GuessTotalsCat_Errors(t *testing.T) {
	var tests = map[string]string{
		"empty string":           "",
		"not a match":            "this is not a category code",
		"already 4 digit totals": "QS402EW0001",
		"already 1 digit totals": "QS402EW1",
	}

	for name, s := range tests {
		_, err := GuessTotalsCat(types.Category(s))
		if err == nil {
			t.Errorf("%s: expected an error", name)
		}
	}
}

func Test_GuessTotalsCat(t *testing.T) {
	var tests = map[string]struct {
		cat  string
		want string
	}{
		"4 digit": {
			cat:  "QS402EW0012",
			want: "QS402EW0001",
		},
		"3 digit": {
			cat:  "AB000CD123",
			want: "AB000CD001",
		},
	}

	for name, test := range tests {
		got, err := GuessTotalsCat(types.Category(test.cat))
		if err != nil {
			t.Errorf("%s: %s", name, err)
			continue
		}
		if string(got) != test.want {
			t.Errorf("%s: %s, want %s", name, got, test.want)
		}
	}
}
