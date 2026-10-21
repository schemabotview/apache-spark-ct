"""More cores, same data: how the summary scales on this 4-core machine."""
import os

from pyspark.sql import SparkSession

from explore.planview import generated
from pipeline import summarise
from tools.bench import run, seconds

os.environ.setdefault("SPARK_CONF_DIR", "conf")
for cores in [1, 2, 4]:  # a new local session each time
    spark = SparkSession.builder.master(f"local[{cores}]").getOrCreate()
    orders, stores = generated(spark)
    daily = summarise.daily_sales(orders.join(stores, "store_id"))
    print(f"local[{cores}]: {seconds(lambda: run(daily)):4.1f} s")
    spark.stop()
