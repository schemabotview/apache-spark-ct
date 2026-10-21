import json
import os
from urllib.request import urlopen

from pyspark.sql import SparkSession

os.environ["SPARK_CONF_DIR"] = "conf"
spark = SparkSession.builder.master("local[4]").appName("who").getOrCreate()
sc = spark.sparkContext  # the driver's handle on the cluster
print("master:", sc.master)
print("task slots:", sc.defaultParallelism)
print("web UI:", sc.uiWebUrl)

# Spark's monitoring API lists every executor of this application
api = f"{sc.uiWebUrl}/api/v1/applications/{sc.applicationId}"
for e in json.load(urlopen(f"{api}/executors")):
    host = e["hostPort"].split(":")[0]
    print(f"executor '{e['id']}' on {host}: {e['totalCores']} cores")
spark.stop()
