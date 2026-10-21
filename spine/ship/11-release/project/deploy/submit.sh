#!/bin/bash
# Run a job the way a cluster runs it: code shipped as a zip, settings as flags.
#   deploy/submit.sh jobs/daily_sales.py         (MASTER defaults to local[4])
export SPARK_CONF_DIR=conf
exec spark-submit --master "${MASTER:-local[4]}" \
  --py-files dist/pipeline.zip \
  --conf spark.sql.shuffle.partitions=100 \
  --conf spark.executor.memory=2g \
  "$@"
