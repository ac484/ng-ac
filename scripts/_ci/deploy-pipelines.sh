#!/usr/bin/env bash

set -e

GH=false
for ARG in "$@"; do
  case "$ARG" in
    -gh)
      GH=true
      ;;
  esac
done

echo "Starting build for ng-ac project..."

ROOT_DIR="$(pwd)"
DIST_DIR="$(pwd)/dist"

VERSION=$(node -p "require('./package.json').version")
echo "Build version: ${VERSION}"

# Set production environment
echo "Setting production environment..."
cp -f ${ROOT_DIR}/src/environments/environment.ts ${ROOT_DIR}/src/environments/environment.prod.ts
sed -i 's/production: false/production: true/g' ${ROOT_DIR}/src/environments/environment.prod.ts

# Build Angular app
if [[ ${GH} == true ]]; then
  echo "Building for GitHub Pages..."
  pnpm run build --base-href /ng-ac/
else
  echo "Building for production..."
  pnpm run build
fi

# Create 404.html for SPA routing
echo "Creating 404.html for SPA routing..."
cp -f ${DIST_DIR}/ng-ac/browser/index.html ${DIST_DIR}/ng-ac/browser/404.html

echo "Build completed successfully!"
