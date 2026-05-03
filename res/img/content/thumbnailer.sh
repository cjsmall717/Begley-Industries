#!/usr/bin/env bash

set -euo pipefail

SRC="./projects"
DST="./thumbnails"

# --- generate thumbnails ---
find "$SRC" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) | while read -r input; do
    rel="${input#$SRC/}"
    output="$DST/$rel"

    mkdir -p "$(dirname "$output")"

    read width height < <(
        ffprobe -v error -select_streams v:0 \
        -show_entries stream=width,height \
        -of default=noprint_wrappers=1:nokey=1 "$input"
    )

    if (( width <= 80 && height <= 80 )); then
        scale="scale='if(gt(iw,ih),80,-1)':'if(gt(ih,iw),80,-1)'"
    else
        scale="scale='if(gt(iw,ih),160,-1)':'if(gt(ih,iw),160,-1)'"
    fi

    echo "processing: $rel"

    ffmpeg -y -loglevel error -i "$input" \
        -vf "$scale" \
        "$output"
done

# --- cleanup orphan thumbnails ---
find "$DST" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) | while read -r thumb; do
    rel="${thumb#$DST/}"
    original="$SRC/$rel"

    if [[ ! -f "$original" ]]; then
        echo "deleting orphan thumbnail: $thumb"
        rm -f "$thumb"
    fi
done

# --- remove empty directories ---
find "$DST" -type d -empty -delete

echo "done"
