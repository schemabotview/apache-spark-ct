"""Where is this application running: its master, its driver, its executors?"""
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("where").getOrCreate()
conf = spark.sparkContext.getConf()
print("master      ", conf.get("spark.master"))
print("deploy mode ", conf.get("spark.submit.deployMode"))
print("driver host ", conf.get("spark.driver.host"))
rows = spark.range(1_000_000).selectExpr("sum(id) AS total").first()
print("sum 0..999999", rows.total)
# after a job has run: every JVM that holds blocks, executors and the driver
jvms = spark.sparkContext._jsc.sc().getExecutorMemoryStatus().size()
print("JVMs        ", jvms)
spark.stop()
