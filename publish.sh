#!/bin/bash
scriptDir=$(cd "$(dirname $0)" && echo "$(pwd -P)")

cd $scriptDir

vers=${1:-0.0.0}

success() {
  echo -e "\033[0;32m$1\033[0m"
}

warn() {
  echo -e "\033[0;33m$1\033[0m"
}

error() {
  echo -e "\033[0;31m$1\033[0m"
}

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

# Build client:
echo ""
echo "Building client ..."
./yarn.sh workspace @doko/client run build
./writeVersion.sh $vers
clientDir=$scriptDir/packages/client
clientImage=uncaught42/doko-stats-client
docker build --pull -f $clientDir/Dockerfile -t $clientImage:$vers -t $clientImage:latest $clientDir

echo ""

if [ "$vers" = "0.0.0" ]; then
  warn "Not pushing images to docker hub due to local version"
else
  docker push $clientImage:$vers $clientImage:latest
fi