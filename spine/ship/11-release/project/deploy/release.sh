#!/bin/bash
# Release: package the code, prove it with the tests, then run the job with it.
set -e
deploy/package.sh > /dev/null
echo "packaged dist/pipeline.zip"
python -m pytest -q
deploy/submit.sh jobs/daily_sales.py
