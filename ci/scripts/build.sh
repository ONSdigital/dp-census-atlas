#!/bin/bash -eux

pushd dp-census-atlas

  case $(git branch --show-current) in

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
