#!/bin/bash

set -e

git pull
npm run build
cd build
ln -s ../resources resources
mkdir -p resources/images-300px
mkdir -p resources/images-750px
cd resources/images-large
# Optimized mogrify commands:
# -resize: Scale to max width/height
# -quality: JPEG quality (82-85 is optimal - minimal visible loss, 40-60% size reduction)
# -strip: Remove EXIF/metadata (saves 10-20KB per image)
# -interlace Plane: Progressive JPEG for perceived faster loading
diff <(ls -1 ../images-300px/) <(ls -1) | grep http | cut -c 3- | xargs -I {} mogrify -resize 300x -quality 82 -strip -interlace Plane -path ../images-300px/ {}
diff <(ls -1 ../images-750px/) <(ls -1) | grep http | cut -c 3- | xargs -I {} mogrify -resize 750x -quality 85 -strip -interlace Plane -path ../images-750px/ {}
