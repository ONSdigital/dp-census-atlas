#!/usr/bin/env bash

echo "Workaround Sveltekit issue 3726..."
# https://github.com/sveltejs/kit/issues/3726

pushd ./build/client
mkdir census-atlas
mv _app census-atlas/_app
popd

pushd ./build/static
# mv ignores .hidden objects (so don't move the destination dir into itself)
mkdir .census-atlas
mv * .census-atlas
mv .census-atlas census-atlas
popd
