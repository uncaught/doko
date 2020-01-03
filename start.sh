#!/bin/bash

yarn() {
  docker run -it --rm \
    -u 0 \
    -v "$PWD/yarn-cache:/yarn-cache:rw" \
    -v "$PWD:$PWD:rw" \
    -w "$PWD/$1" \
    -e YARN_CACHE_FOLDER=/yarn-cache \
    --entrypoint=yarn \
    node:13.5.0-alpine3.10 \
    install
}

yarn common
yarn client
yarn server

docker-compose up -d

echo "Open http://127.0.0.1:3333"
