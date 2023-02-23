#!/bin/bash -eux

pushd dp-census-atlas
  npm install --silent
  # install additional playwright deps...
  $(npm bin)/playwright install-deps
  make component-ci
popd