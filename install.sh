#!/bin/bash
scriptDir=$(cd "$(dirname $0)" && echo "$(pwd -P)")
$scriptDir/yarn.sh common install
$scriptDir/yarn.sh server install
$scriptDir/yarn.sh client install