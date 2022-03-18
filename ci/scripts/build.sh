#!/bin/bash -eux

pushd dp-census-atlas
  make build
  cp build package.json Dockerfile.concourse ../build
popd
