package main

import (
	"errors"
	"fmt"

	"github.com/jtrim-ons/ckmeans/pkg/ckmeans"
)

var ErrNotEnoughData = errors.New("not enough data")

func Calc(vals []float64, k int) ([]float64, error) {
	if len(vals) < k {
		return nil, fmt.Errorf("%w: not enough values (%d) for k=%d", ErrNotEnoughData, len(vals), k)
	}

	clusters, err := ckmeans.Ckmeans(vals, k)
	if err != nil {
		return nil, err
	}

	min := vals[0]
	for _, val := range vals {
		if val < min {
			min = val
		}
	}

	breaks := []float64{min} // we make min the first "break"
	for _, cluster := range clusters {
		bp := cluster[len(cluster)-1] // upper break point
		breaks = append(breaks, bp)
	}
	return breaks, nil
}
