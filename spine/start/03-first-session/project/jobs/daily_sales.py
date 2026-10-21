"""Daily sales: completed orders per city and day."""
import os

from pyspark.sql import SparkSession

os.environ.setdefault("SPARK_CONF_DIR", "conf")  # quiet logs: see conf/
spark = (
    SparkSession.builder.master("local[4]")
    .appName("daily-sales")
    .getOrCreate()
)
sc = spark.sparkContext
print(f"Spark {spark.version}, master {sc.master}, app {sc.appName!r}")
print(f"web UI {sc.uiWebUrl}")

spark.stop()
