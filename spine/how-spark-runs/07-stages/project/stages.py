import os

from pyspark.sql import SparkSession
from pyspark.sql import functions as F

from sample import ORDERS, SCHEMA

os.environ["SPARK_CONF_DIR"] = "conf"
# Adaptive Query Execution off: one job, planned once (Course 10 turns it on)
spark = (SparkSession.builder.master("local[4]")
         .config("spark.sql.adaptive.enabled", "false")
         .getOrCreate())
tracker = spark.sparkContext.statusTracker()

orders = spark.createDataFrame(ORDERS, SCHEMA)
sales = (orders.filter(F.col("status") == "COMPLETED")
         .groupBy("store_id").agg(F.sum("amount").alias("sales")))
rows = sales.collect()

for job in tracker.getJobIdsForGroup():
    print(f"job {job}: {len(rows)} rows back to the driver")
    for stage in tracker.getJobInfo(job).stageIds:
        info = tracker.getStageInfo(stage)
        print(f"  stage {stage}: {info.numTasks} tasks, {info.name}")
spark.stop()
