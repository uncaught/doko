#!/bin/bash
scriptDir=$(dirname $(readlink -f $0))
rootDir=$scriptDir/..

imageApi=doko-api:latest
imageHttpd=doko-httpd:latest

$rootDir/yarn.sh common install

$rootDir/yarn.sh client install
$rootDir/yarn.sh client build

$rootDir/yarn.sh server install
$rootDir/yarn.sh server run tsc

docker build -f $scriptDir/api/Dockerfile -t $imageApi $rootDir
docker build -f $scriptDir/httpd/Dockerfile -t $imageHttpd $rootDir
