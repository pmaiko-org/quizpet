#!/bin/sh
set -e

if [ -n "$STATIC_DIR" ]; then
  find "$STATIC_DIR" -mindepth 1 -delete
  cp -a .output/public/. "$STATIC_DIR"/
fi

exec node .output/server/index.mjs
