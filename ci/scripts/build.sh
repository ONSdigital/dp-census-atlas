#!/bin/bash -eux

pushd dp-census-atlas
  npm install --silent
  make build
  cp build package.json Dockerfile.concourse ../build
popd
