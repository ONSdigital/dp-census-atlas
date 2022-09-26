#!/usr/bin/env bash

# remove leading slash from APP_BASE_PATH if present
APP_BASE_PATH=${VITE_APP_BASE_PATH:-"census-atlas"}
APP_BASE_PATH_NO_LEADING_SLASH=${APP_BASE_PATH#/}

echo "Workaround Sveltekit issue 3726..."
# https://github.com/sveltejs/kit/issues/3726
echo "Re-rooting app to base path ${APP_BASE_PATH_NO_LEADING_SLASH}"

pushd ./build/client
    mkdir -p "$APP_BASE_PATH_NO_LEADING_SLASH"
    mv _app "$APP_BASE_PATH_NO_LEADING_SLASH"/_app
popd

pushd ./build/static
    # mv ignores .hidden objects (so don't move the destination dir into itself)
    mkdir -p ."$APP_BASE_PATH_NO_LEADING_SLASH"
    mv * ."$APP_BASE_PATH_NO_LEADING_SLASH"
    mv ."$APP_BASE_PATH_NO_LEADING_SLASH" "$APP_BASE_PATH_NO_LEADING_SLASH"
popd
