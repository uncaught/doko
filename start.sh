#!/bin/bash

yarn() {
  docker run -it --rm \
    -u 0 \
    -v "$PWD/yarn-cache:/root/.cache/yarn:rw" \
    -v "$PWD:$PWD:rw" \
    -w "$PWD/$1" \
    --entrypoint=yarn \
    node:13.5.0-alpine3.10 \
    install
}

yarn common
yarn client
yarn server

docker-compose up -d

echo "Open http://127.0.0.1:3333"
