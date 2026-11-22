#!/bin/bash

set -e

git pull
npm install --no-audit --no-fund
# Remove the image symlink before the build clears build/
rm -f build/resources
# Downloads data, caches new images, makes webp thumbnails, builds the site.
npm run build
ln -s ../resources build/resources
