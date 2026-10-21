"""One local SparkSession for the whole run: starting a JVM takes seconds."""
import os

import pytest
from pyspark.sql import SparkSession


@pytest.fixture(scope="session")
def spark():
    os.environ.setdefault("SPARK_CONF_DIR", "conf")
    session = (SparkSession.builder.master("local[2]").appName("tests")
               .config("spark.sql.shuffle.partitions", "2")  # tiny data
               .getOrCreate())
    yield session
    session.stop()
