"""reduceByKey against groupByKey, counted in shuffled records."""
import os
import json
from urllib.request import urlopen

from pyspark.sql import SparkSession

os.environ.setdefault("SPARK_CONF_DIR", "conf")
spark = SparkSession.builder.master("local[4]").getOrCreate()
sc = spark.sparkContext  # RDDs are made from the SparkContext

pairs = sc.parallelize(range(100_000), 4).map(lambda i: (i % 3, i))

reduced = pairs.reduceByKey(lambda a, b: a + b).collect()  # job 0
grouped = pairs.groupByKey().mapValues(sum).collect()  # job 1
print(sorted(reduced), sorted(reduced) == sorted(grouped))

api = f"{sc.uiWebUrl}/api/v1/applications/{sc.applicationId}/stages"
for stage in sorted(json.load(urlopen(api)), key=lambda s: s["stageId"]):
    if stage["shuffleWriteRecords"]:
        records, size = stage["shuffleWriteRecords"], stage["shuffleWriteBytes"]
        print(f"stage {stage['stageId']}: {records} records, {size:,} bytes")
spark.stop()
