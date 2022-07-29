#!/bin/bash -eux

pushd dp-census-atlas
  # install deps
  npm install --silent
  
  # do env specific build, switching on git branch develop for develop/sandbox, master for production
  # concourse runs in detached head mode, so have to scrape the branch out of the log...
  GIT_BRANCH=$(git show-ref | grep $(git log --pretty=%h -1) | sed 's|.*/\(.*\)|\1|' | sort -u | grep -v HEAD)
  # only should be building from develop or master here, but should handle other branches just in case
  case $GIT_BRANCH in
    "develop")
      echo "Building for sandbox"
      make build-sandbox
      ;;
    "master")
      echo "Building for production"
      make build-prod
      ;;
    *)
      echo "Neither master or develop branch found, doing default build"
      make build
      ;;
  esac
  
  # copy build to the location expected by the CI
  cp -r build package.json Dockerfile.concourse ../build
popd
