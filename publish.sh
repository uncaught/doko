#!/bin/bash
set -e
scriptDir=$(cd "$(dirname $0)" && echo "$(pwd -P)")

clientImage=uncaught42/doko-stats-client
databaseImage=uncaught42/doko-stats-db
serverImage=uncaught42/doko-stats-server

cd $scriptDir

source $scriptDir/.env

if [ -f .env.local ]; then
  source $scriptDir/.env.local
fi

vers=${1:-0.0.0}

color() { echo -e "\033[0;$1m$2\033[0m"; }
step() { color 95 "$1"; }
success() { color 32 "$1"; }
warn() { color 33 "$1"; }
error() { color 31 "$1"; }

if [ "$vers" = "0.0.0" ]; then
  warn "Version $vers used - not creating git tag"
elif [[ $vers =~ ^[0-9]\.[0-9]\.[0-9]$ ]]; then
  success "Version $vers accepted! Creating git tag ..."
  git tag -a v$vers -m "Create tag for version $vers"
  git push --follow-tags
else
  error "Version $vers is not of a valid format!"
  exit 1
fi


echo ""
step "Building client ..."
cd $scriptDir/packages/client
docker build --pull -f Dockerfile --build-arg vers=$vers -t $clientImage:$vers -t $clientImage:latest ..


echo ""
step "Building database ..."
cd $scriptDir/packages/database
docker build --pull -f Dockerfile -t $databaseImage:$vers -t $databaseImage:latest .


echo ""
step "Building server ..."
cd $scriptDir/packages/server
docker build --pull -f Dockerfile -t $serverImage:$vers -t $serverImage:latest ..


cd $scriptDir


echo ""
if [ "$vers" = "0.0.0" ]; then
  warn "Not pushing images to docker hub due to local version"
else
  step "Pushing images ..."
  if [ "$DOCKER_LOGIN_USER" != "" ] && [ "$DOCKER_LOGIN_TOKEN" != "" ]; then
    echo "$DOCKER_LOGIN_TOKEN" | docker login -u $DOCKER_LOGIN_USER --password-stdin
  fi
  docker push -q $clientImage:$vers
  docker push -q $clientImage:latest
  docker push -q $databaseImage:$vers
  docker push -q $databaseImage:latest
  docker push -q $serverImage:$vers
  docker push -q $serverImage:latest
  if [ "$DOCKER_LOGIN_USER" != "" ] && [ "$DOCKER_LOGIN_TOKEN" != "" ]; then
    docker logout
  fi
fi


echo ""
success "Build complete!"