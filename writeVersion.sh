#!/bin/bash
scriptDir=$(dirname $(readlink -f $0))
unix=$(date +%s)
echo '{"buildTime":'$unix'}' > $scriptDir/client/build/version.json