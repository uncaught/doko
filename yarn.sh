#!/bin/bash
scriptDir=$PWD/$(dirname $0)

mkdir -p "$scriptDir/yarn-cache"

workspace=$1
shift

if [ "$workspace" = "" ] || [ ! -d "$scriptDir/$workspace" ]; then
  echo "Unknonwn workspace $workspace"
  echo "Use like './yarn.sh (common|client|server) (install|add|remove) [packageName]'"
  exit 1
fi

docker run -it --rm \
  -u $UID \
  -v "$scriptDir/yarn-cache:/yarn-cache:rw" \
  -v "$scriptDir:$scriptDir:rw" \
  -w "$scriptDir/$workspace" \
  -e YARN_CACHE_FOLDER=/yarn-cache \
  --entrypoint=yarn \
  node:14.15.4-alpine3.12 \
  $@
