#!/bin/bash

set -e

git pull
# Downloads data, caches new images, makes webp thumbnails, builds the site.
npm run build
cd build
ln -s ../resources resources
