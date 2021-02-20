#!/bin/bash
scriptDir=$(dirname $(readlink -f $0))
unix=$(date +%s)
mkdir -p $scriptDir/client/build
echo '{"buildTime":'$unix'}' > $scriptDir/client/build/version.json