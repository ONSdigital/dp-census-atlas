#!/bin/bash -eux

pushd dp-census-atlas

  GIT_BRANCH=$(git show-ref | grep $(git log --pretty=%h -1) | sed 's|.*/\(.*\)|\1|' | sort -u | grep -v HEAD)
  case $GIT_BRANCH in

    "develop")
      echo "Building for develop"
      ;;

    "master")
      echo "Building for production"
      ;;

    *)
      echo "Neither master or develop branch found"
      ;;
  esac

  npm install --silent
  make build
  cp -r build package.json Dockerfile.concourse ../build
popd
