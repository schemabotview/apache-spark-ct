"""What a function takes with it to an executor."""
import os
import json

from pyspark.sql import SparkSession

os.environ.setdefault("SPARK_CONF_DIR", "conf")
spark = SparkSession.builder.master("local[4]").getOrCreate()
sc = spark.sparkContext  # RDDs are made from the SparkContext

events = sc.textFile("data/raw/orders").map(json.loads)
completed = events.filter(lambda e: e["status"] == "COMPLETED")

counter = 0


def count(event):
    global counter
    counter += 1  # changes a copy, inside a task


completed.foreach(count)
print("plain variable on the driver:", counter)

seen = sc.accumulator(0)
completed.foreach(lambda event: seen.add(1))
print("accumulator on the driver:", seen.value)

cities = sc.broadcast({7: "Leeds", 9: "York", 12: "Hull"})
named = completed.map(lambda e: (cities.value[e["store_id"]], e["order_id"]))
print(sorted(named.collect()))
spark.stop()
