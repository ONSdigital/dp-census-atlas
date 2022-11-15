#!/bin/bash -eux

pushd dp-census-atlas
  npm install --silent
  # install additional playwright deps...
  $(npm bin)/playwrite --install-deps
  make component
popd