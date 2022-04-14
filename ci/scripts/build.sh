#!/bin/bash -eux

pushd dp-census-atlas
  npm install --silent
  export ORIGIN="https://develop.onsdigital.co.uk/census-atlas"
  make build
  cp -r build package.json Dockerfile.concourse ../build
popd
