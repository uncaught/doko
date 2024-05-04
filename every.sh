#!/bin/bash
scriptDir=$(cd "$(dirname $0)" && echo "$(pwd -P)")

cmd=$@

packages='common client server'

for package in $packages; do
  cd $scriptDir/packages/$package
  echo "In $package ..."
  $cmd
  echo ""
done

cd $scriptDir
