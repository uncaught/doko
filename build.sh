#!/bin/bash
scriptDir=$(dirname $(readlink -f $0))
$scriptDir/install.sh
$scriptDir/yarn.sh client build
$scriptDir/writeVersion.sh
