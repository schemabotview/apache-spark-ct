#!/bin/bash
# Package the pipeline for spark-submit: every job imports it, so ship one zip.
set -e
rm -rf dist && mkdir dist
zip -qr dist/pipeline.zip pipeline -x '*__pycache__*'
unzip -l dist/pipeline.zip | tail -n +4 | head -n -2 | awk '{print $4}' | sort
