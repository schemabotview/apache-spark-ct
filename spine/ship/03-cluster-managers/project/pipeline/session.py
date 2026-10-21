"""One way to build the SparkSession, for every job."""
import os

from pyspark.sql import SparkSession


def build_session(app: str) -> SparkSession:
    """A local Spark session, with Spark's own logs kept to warnings."""
    os.environ.setdefault("SPARK_CONF_DIR", "conf")  # quiet logs: see conf/
    return SparkSession.builder.master("local[4]").appName(app).getOrCreate()


def build_stream_session(app: str) -> SparkSession:
    """A session for streaming queries: their state is partitioned once, at the
    first run, so pick a small number for a small stream; AQE does not apply."""
    spark = build_session(app)
    spark.conf.set("spark.sql.shuffle.partitions", "4")
    spark.conf.set("spark.sql.adaptive.enabled", "false")
    return spark
