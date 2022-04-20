#!/usr/bin/env bash

echo "Workaround Sveltekit issue 3726..."

pushd ./build/client
mkdir census-atlas
mv _app census-atlas/_app
popd

pushd ./build/static
mkdir census-atlas
mv * census-atlas
popd
