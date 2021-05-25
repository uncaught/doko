#!/bin/bash
scriptDir=$(cd "$(dirname $0)" && echo "$(pwd -P)")
unix=$(date +%s)
mkdir -p $scriptDir/client/build
echo '{"buildTime":'$unix'}' > $scriptDir/client/build/version.json