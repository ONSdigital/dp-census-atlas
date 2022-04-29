#!/bin/bash -eux

pushd dp-census-atlas
  git branch --show-current
  git log
  npm install --silent
  make build
  cp -r build package.json Dockerfile.concourse ../build
popd
