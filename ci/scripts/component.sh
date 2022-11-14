#!/bin/bash -eux

pushd dp-census-atlas
  npm install --silent
  # install additional playwright deps...
  apt-get update && apt-get install -y libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0\
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libatspi2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libxkbcommon0 \
    libasound2 \
    libwayland-client0
  make component
popd