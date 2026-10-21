"""The daily summary one level down: RDDs, no schema, no optimizer."""
import os
import json
from decimal import Decimal

from pyspark.sql import SparkSession

os.environ.setdefault("SPARK_CONF_DIR", "conf")
spark = SparkSession.builder.master("local[4]").getOrCreate()
sc = spark.sparkContext  # RDDs are made from the SparkContext

lines = sc.textFile("data/raw/orders")  # one string per line
events = lines.map(lambda line: json.loads(line, parse_float=Decimal))
completed = events.filter(lambda e: e["status"] == "COMPLETED")
pairs = completed.map(lambda e: (e["store_id"], e["amount"]))
sales = pairs.reduceByKey(lambda a, b: a + b)

print(sorted(sales.collect()))
print(sales.toDebugString().decode())
spark.stop()
