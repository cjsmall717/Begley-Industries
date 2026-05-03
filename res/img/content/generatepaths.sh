#!/usr/bin/env bash

set -euo pipefail

PROJECTS_DIR="./projects"
THUMBS_DIR="./thumbnails"

OUT_IMG="./img_paths.txt"
OUT_THUMB="./thumbnail_paths.txt"

# web prefixes
PROJECTS_PREFIX="/res/img/content/projects"
THUMBS_PREFIX="/res/img/content/thumbnails"

> "$OUT_IMG"
> "$OUT_THUMB"

# projects → img_paths.txt
find "$PROJECTS_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) | while read -r file; do
    rel="${file#$PROJECTS_DIR/}"
    echo "$PROJECTS_PREFIX/$rel" >> "$OUT_IMG"
done

# thumbnails → thumbnail_paths.txt
find "$THUMBS_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) | while read -r file; do
    rel="${file#$THUMBS_DIR/}"
    echo "$THUMBS_PREFIX/$rel" >> "$OUT_THUMB"
done

echo "generated:"
echo "  $OUT_IMG"
echo "  $OUT_THUMB"
