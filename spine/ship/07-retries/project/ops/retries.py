"""A task that fails once: Spark retries it, but cannot undo what it did."""
import os
from pathlib import Path

from pyspark import TaskContext
from pyspark.sql import SparkSession

os.environ.setdefault("SPARK_CONF_DIR", "conf")
# local[4, 2]: 4 cores, and each task may be tried twice, as on a cluster
spark = SparkSession.builder.master("local[4, 2]").getOrCreate()
SENT = Path("data/out/emails_sent.txt")
SENT.parent.mkdir(parents=True, exist_ok=True)
SENT.write_text("")


def email_shops(rows):  # a side effect inside a task
    task = TaskContext.get()
    part, attempt = task.partitionId(), task.attemptNumber()
    with SENT.open("a") as sent:
        sent.write(f"partition {part}, attempt {attempt}\n")
    if part == 1 and attempt == 0:
        raise ConnectionError("lost the executor")  # as a machine might
    return rows


numbers = spark.sparkContext.parallelize(range(100), 4)
print("sum:", numbers.mapPartitions(email_shops).sum(), "— the job succeeded")
print("emails sent:", *sorted(SENT.read_text().splitlines()), sep="\n  ")
spark.stop()
