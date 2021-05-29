#!/bin/bash
set -e
scriptDir=$(cd "$(dirname $0)" && echo "$(pwd -P)")

cd $scriptDir

source $scriptDir/.env

vers=${1:-0.0.0}

color() { echo -e "\033[0;$1m$2\033[0m"; }
success() { color 32 "$1"; }
warn() { color 33 "$1"; }
error() { color 31 "$1"; }

if [ "$vers" = "0.0.0" ]; then
  warn "Version $vers used - not creating git tag"
elif [[ $vers =~ ^[0-9]\.[0-9]\.[0-9]$ ]]; then
  success "Version $vers accepted! Creating git tag ..."
  git tag -a v$vers -m "Create tag for version $vers"
else
  error "Version $vers is not of a valid format!"
  exit 1
fi

echo ""
./yarn.sh install

echo ""
echo "Building client ..."
./yarn.sh workspace @doko/client run build
./writeVersion.sh $vers
clientDir=$scriptDir/packages/client
clientImage=uncaught42/doko-stats-client
docker build --pull -f $clientDir/Dockerfile -t $clientImage:$vers -t $clientImage:latest $clientDir

echo ""
echo "Building server ..."
serverDir=$scriptDir/packages/server
serverImage=uncaught42/doko-stats-server
docker build --build-arg "NODE_IMAGE=$NODE_IMAGE" --pull -f $serverDir/Dockerfile -t $serverImage:$vers -t $serverImage:latest $serverDir

echo ""
if [ "$vers" = "0.0.0" ]; then
  warn "Not pushing images to docker hub due to local version"
else
  docker push $clientImage:$vers
  docker push $clientImage:latest
  docker push $serverImage:$vers
  docker push $serverImage:latest
fi