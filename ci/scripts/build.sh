#!/bin/bash -eux

pushd dp-census-atlas
  git branch --show-current
  npm install --silent
  make build
  cp -r build package.json Dockerfile.concourse ../build
popd
