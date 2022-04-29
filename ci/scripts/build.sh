#!/bin/bash -eux

pushd dp-census-atlas
  git branch --show-current
  git rev-parse --abbrev-ref HEAD
  npm install --silent
  make build
  cp -r build package.json Dockerfile.concourse ../build
popd
