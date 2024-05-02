#!/bin/bash
scriptDir=$(cd "$(dirname $0)" && echo "$(pwd -P)")

cd $scriptDir/packages/common
npm install

cd $scriptDir/packages/client
npm install

cd $scriptDir/packages/server
npm install

cd $scriptDir