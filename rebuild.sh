#!/bin/bash

set -e

git pull
npm run build
cd build
ln -s ../resources resources
mkdir -p resources/images-300px
mkdir -p resources/images-750px
cd resources/images-large
diff <(ls -1 ../images-300px/) <(ls -1) | grep http | cut -c 3- | xargs -I {} mogrify -resize 300x -path ../images-300px/ {}
diff <(ls -1 ../images-750px/) <(ls -1) | grep http | cut -c 3- | xargs -I {} mogrify -resize 750x -path ../images-750px/ {}
