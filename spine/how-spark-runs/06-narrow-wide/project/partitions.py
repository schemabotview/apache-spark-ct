import os

from pyspark.sql import SparkSession

os.environ["SPARK_CONF_DIR"] = "conf"
spark = SparkSession.builder.master("local[4]").getOrCreate()
tracker = spark.sparkContext.statusTracker()


def tasks_per_stage():
    """Tasks in each stage of the job that ran last."""
    job = tracker.getJobInfo(max(tracker.getJobIdsForGroup()))
    return [tracker.getStageInfo(s).numTasks for s in job.stageIds]


ids = spark.range(1_000_000)
print("a million ids:", ids.rdd.getNumPartitions(), "partitions")
ids.foreach(lambda row: None)  # an action that does nothing per row
print("  tasks per stage:", tasks_per_stage())

eight = ids.repartition(8)
print("repartitioned:", eight.rdd.getNumPartitions(), "partitions")
eight.foreach(lambda row: None)
print("  tasks per stage:", tasks_per_stage())
spark.stop()
