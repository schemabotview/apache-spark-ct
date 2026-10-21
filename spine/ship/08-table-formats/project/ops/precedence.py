"""One setting, three places: which value does the job actually get?"""
from pathlib import Path

from pyspark.sql import SparkSession

# this file's folder is ops/, not the project: pipeline comes from the zip
import pipeline

spark = (SparkSession.builder.appName("precedence")
         .config("spark.sql.shuffle.partitions", "200")  # in the code
         .getOrCreate())
print("pipeline imported from", Path(pipeline.__file__).parents[1].name)
for key in ["spark.sql.session.timeZone",      # conf/spark-defaults.conf only
            "spark.executor.memory",           # file, then --conf: flag wins
            "spark.sql.shuffle.partitions"]:   # all three: the code wins
    print(f"{key:30} {spark.conf.get(key)}")
spark.stop()
