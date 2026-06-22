#!/usr/bin/env bash
# Sync the source Apache Spark notebooks into this content repo.
#
# Design (option B): the content repo is self-contained and publishable on its
# own, so the notebooks it serves live here under notebooks/. They are authored
# in the source repo and copied in by this script — edit them there, then run
# this to refresh the published copies.
#
# Usage:  scripts/sync-notebooks.sh [SRC_DIR]
#   SRC_DIR defaults to ../../Projects/apache-spark relative to this repo.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="${1:-$REPO_ROOT/../../Projects/apache-spark}"
DEST_DIR="$REPO_ROOT/notebooks"

if [ ! -d "$SRC_DIR" ]; then
  echo "Source dir not found: $SRC_DIR" >&2
  exit 1
fi

mkdir -p "$DEST_DIR"
shopt -s nullglob
count=0
for nb in "$SRC_DIR"/[0-9]*.ipynb; do
  cp "$nb" "$DEST_DIR/"
  echo "  synced $(basename "$nb")"
  count=$((count + 1))
done

echo "Synced $count notebook(s) from $SRC_DIR -> notebooks/"
