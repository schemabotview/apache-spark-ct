"""Measure fairly: one warm-up run thrown away, then the median of three."""
import statistics
import time

from pyspark.sql import DataFrame
from pyspark.sql import functions as F


def seconds(action, runs: int = 3) -> float:
    """Median wall-clock time of `action`, after one discarded warm-up."""
    action()  # warm-up: JVM code paths, the OS file cache, Python workers
    times = []
    for _ in range(runs):
        start = time.perf_counter()
        action()
        times.append(time.perf_counter() - start)
    return statistics.median(times)


def run(df: DataFrame) -> None:
    """Compute every row of df and throw it away: a write to nowhere."""
    df.write.format("noop").mode("overwrite").save()


def checksum(daily: DataFrame) -> str:
    """Rows and total sales: two different plans must agree on both."""
    row = daily.agg(F.count("*"), F.sum("sales")).first()
    return f"{row[0]} rows, {row[1]} sales"
