#!/bin/bash -eux

pushd dp-census-atlas
  git show-ref | grep $(git log --pretty=%h -1) | sed 's|.*/\(.*\)|\1|' | sort -u | grep -v HEAD
  npm install --silent
  make build
  cp -r build package.json Dockerfile.concourse ../build
popd
