"""One way to build the SparkSession, for every job."""
import os

from pyspark.sql import SparkSession


def build_session(app: str) -> SparkSession:
    """A local Spark session, with Spark's own logs kept to warnings."""
    os.environ.setdefault("SPARK_CONF_DIR", "conf")  # quiet logs: see conf/
    return SparkSession.builder.master("local[4]").appName(app).getOrCreate()
