#!/bin/bash
scriptDir=$(cd "$(dirname $0)" && echo "$(pwd -P)")
$scriptDir/every.sh npm install
