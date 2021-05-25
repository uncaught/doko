#!/bin/bash
scriptDir=$(cd "$(dirname $0)" && echo "$(pwd -P)")

cd $scriptDir

./yarn.sh install
./yarn.sh workspace @doko/client run build
./writeVersion.sh
