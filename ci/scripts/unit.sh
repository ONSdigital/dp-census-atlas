#!/bin/bash -eux

pushd dp-census-atlas
  npm install --silent
  npm run build:ons
  make test
popd
