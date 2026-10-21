"""Recompute or cache: two actions on the same cleaned orders."""
import json
from urllib.request import urlopen

from explore.planview import generated
from pipeline.session import build_session
from tools.bench import run, seconds

spark = build_session("cache")
orders, _ = generated(spark)
completed = orders.where("status = 'COMPLETED'").select("store_id", "amount")
by_store = completed.groupBy("store_id").sum("amount")

print(f"second action, recomputed: {seconds(lambda: run(by_store)):.2f} s")
completed.cache().count()  # an action fills the cache
print(f"second action, cached:     {seconds(lambda: run(by_store)):.2f} s")

sc = spark.sparkContext
api = f"{sc.uiWebUrl}/api/v1/applications/{sc.applicationId}/storage/rdd"
for rdd in json.load(urlopen(api)):
    print(f"cached: {rdd['numCachedPartitions']} partitions,"
          f" {rdd['memoryUsed'] / 2**20:.0f} MB of memory")
spark.stop()
