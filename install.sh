#!/bin/bash
scriptDir=$(dirname $(readlink -f $0))
$scriptDir/yarn.sh common install
$scriptDir/yarn.sh server install
$scriptDir/yarn.sh client install