"""Whole-stage code generation, and the memory executors share."""
import json
from urllib.request import urlopen

from explore.planview import generated, text, tree
from pipeline import summarise
from pipeline.session import build_session

spark = build_session("codegen")
spark.conf.set("spark.sql.adaptive.enabled", "false")  # the plan's own stages
orders, stores = generated(spark)
daily = summarise.daily_sales(orders.join(stores, "store_id"))

print(text(daily, "codegen").splitlines()[0])
print("\n".join(tree(daily)))

sc = spark.sparkContext
api = f"{sc.uiWebUrl}/api/v1/applications/{sc.applicationId}/executors"
memory = json.load(urlopen(api))[0]["maxMemory"]
print(f"unified memory: {memory / 2**20:.0f} MiB of the driver's 1 GiB heap")
spark.stop()
