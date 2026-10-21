"""Send a receipt for every completed order: a side effect, run inside tasks."""
import os

from pyspark import TaskContext
from pyspark.sql import SparkSession

os.environ.setdefault("SPARK_CONF_DIR", "conf")
# local[4, 2]: up to two attempts per task, as on a cluster
spark = SparkSession.builder.master("local[4, 2]").getOrCreate()


def send(rows):
    task = TaskContext.get()
    with open("data/out/sent.log", "a") as log:  # stands in for an email API
        for row in rows:
            log.write(f"receipt {row.order_id} {row.amount}\n")
    if task.partitionId() == 0 and task.attemptNumber() == 0:
        raise RuntimeError("executor lost after sending")


SCHEMA = "order_id STRING, amount DECIMAL(10,2), status STRING"
orders = spark.read.schema(SCHEMA).json("data/raw/orders")
completed = orders.where("status = 'COMPLETED'")
completed.repartition(3, "order_id").foreachPartition(send)
spark.stop()
