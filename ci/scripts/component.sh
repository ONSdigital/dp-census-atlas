#!/bin/bash -eux

pushd dp-census-atlas
  # npm install --silent (ToDo add dep installation once this actually does something)
  make component
popd