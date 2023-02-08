#!/usr/bin/env bash

# remove leading slash from APP_BASE_PATH if present
APP_BASE_PATH=${VITE_APP_BASE_PATH:-"census-atlas"}
APP_BASE_PATH_NO_LEADING_SLASH=${APP_BASE_PATH#/}

# get top-level dir of APP_BASE_PATH by applying dirname until there's no slash in the result
APP_BASE_PATH_TOP_LEVEL_DIR=$APP_BASE_PATH_NO_LEADING_SLASH
while [[ $APP_BASE_PATH_TOP_LEVEL_DIR == *"/"* ]]
do
    APP_BASE_PATH_TOP_LEVEL_DIR=$(dirname $APP_BASE_PATH_TOP_LEVEL_DIR)
done

echo "Workaround Sveltekit issue 3726..."
# https://github.com/sveltejs/kit/issues/3726
echo "Re-rooting app to base path ${APP_BASE_PATH_NO_LEADING_SLASH}"

pushd ./build/client
    # make new app dir
    mkdir -p "$APP_BASE_PATH_NO_LEADING_SLASH"
    # move everything except the new add dir itself into the new app dir
    find . -maxdepth 1 -mindepth 1 -not -name "$APP_BASE_PATH_TOP_LEVEL_DIR" \
        -exec mv '{}' "$APP_BASE_PATH_NO_LEADING_SLASH" \;
   # mv _app "$APP_BASE_PATH_NO_LEADING_SLASH"/_app
popd
