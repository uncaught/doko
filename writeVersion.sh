#!/bin/bash
scriptDir=$(cd "$(dirname $0)" && echo "$(pwd -P)")
unix=$(date +%s)
buildDir=$scriptDir/packages/client/build
mkdir -p $buildDir
vers=${1:-0.0.0}
echo '{"buildTime":'$unix',"version":"'$vers'"}' > $buildDir/version.json