#!/bin/bash
scriptDir=$(cd "$(dirname $0)" && echo "$(pwd -P)")

mkdir -p "$scriptDir/yarn-cache"

docker run -it --rm \
  -u $UID \
  -v "$scriptDir/yarn-cache:/yarn-cache:rw" \
  -v "$scriptDir:$scriptDir:rw" \
  -w "$PWD" \
  -e YARN_CACHE_FOLDER=/yarn-cache \
  -e TZ=Europe/Berlin \
  -e NODE_ENV=development \
  --entrypoint=yarn \
  node:14.15.4-alpine3.12 \
  $@
