#!/bin/bash
unix=$(date +%s)
mkdir -p build
vers=${1:-0.0.0}
echo '{"buildTime":'$unix',"version":"'$vers'"}' > build/version.json