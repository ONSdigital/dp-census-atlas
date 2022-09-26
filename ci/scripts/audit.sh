#!/bin/bash -eux

pushd dp-census-atlas
  npm install --silent
  make audit
popd
