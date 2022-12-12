#!/bin/bash -eux

pushd dp-census-atlas
  # install deps
  npm install --silent
  
  # do ons specific build
  make build-ons
  
  # copy build to the location expected by the CI
  cp -r build package.json package-lock.json Dockerfile.concourse ../build
popd
