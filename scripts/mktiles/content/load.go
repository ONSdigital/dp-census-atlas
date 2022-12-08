package content

import (
	"bytes"
	"fmt"
	"io"
	"os"

	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/content/contentv1"
	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/content/contentv2"
	"github.com/ONSdigital/dp-census-atlas/scripts/mktiles/content/contentv3"
)

func LoadName(fname string) (Content, error) {
	buf, err := os.ReadFile(fname)
	if err != nil {
		return nil, err
	}

	type loader func(io.Reader) (Content, error)

	loadv1 := func(r io.Reader) (Content, error) {
		return contentv1.Load(r)
	}
	loadv2 := func(r io.Reader) (Content, error) {
		return contentv2.Load(r)
	}
	loadv3 := func(r io.Reader) (Content, error) {
		return contentv3.Load(r)
	}

	for _, load := range []loader{loadv3, loadv2, loadv1} {
		r := bytes.NewReader(buf)
		c, err := load(r)
		if err != nil {
			return nil, err
		}
		cats, err := c.Categories("")
		if err != nil {
			return nil, err
		}
		if len(cats) > 0 {
			return c, nil
		}
	}
	return nil, fmt.Errorf("%s: could not match any known content.json format", fname)
}
