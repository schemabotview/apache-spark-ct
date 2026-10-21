import os

from pyspark import TaskContext
from pyspark.sql import SparkSession

os.environ["SPARK_CONF_DIR"] = "conf"
# local[4, 2]: four task slots, and up to two attempts per task
sc = SparkSession.builder.master("local[4, 2]").getOrCreate().sparkContext


def total(rows):
    task = TaskContext.get()
    if task.partitionId() == 2 and task.attemptNumber() == 0:
        # the first attempt of partition 2 fails, as if its executor died
        raise RuntimeError("executor lost")
    yield task.partitionId(), task.attemptNumber(), sum(rows)


numbers = sc.parallelize(range(1, 101), 4)  # four partitions of 25 numbers
results = numbers.mapPartitions(total).collect()
for partition, attempt, subtotal in sorted(results):
    print(f"partition {partition}: attempt {attempt}, subtotal {subtotal}")
stage = sc.statusTracker().getStageInfo(0)
print("stage 0 failed tasks:", stage.numFailedTasks)
sc.stop()
