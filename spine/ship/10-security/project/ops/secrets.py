"""What a running application shows about its settings, and to whom."""
import json
import os
from urllib.request import urlopen

from pyspark.sql import SparkSession

os.environ.setdefault("SPARK_CONF_DIR", "conf")
spark = (SparkSession.builder.appName("secrets")
         .config("spark.retail.jdbc.password", "hunter2")  # never do this
         .config("spark.retail.jdbc.user", "etl")
         .getOrCreate())
ui = spark.sparkContext.uiWebUrl
app = spark.sparkContext.applicationId
with urlopen(f"{ui}/api/v1/applications/{app}/environment") as response:
    env = dict(json.load(response)["sparkProperties"])
print("web UI and REST API:", ui, "— no login needed")
for key in ["spark.retail.jdbc.user", "spark.retail.jdbc.password",
            "spark.authenticate", "spark.ui.acls.enable",
            "spark.io.encryption.enabled"]:
    print(f"  {key:30} {env.get(key, '(not set: off)')}")
spark.stop()
