"""Where the plan is cut: exchanges, matched to the stages that ran."""
import json
from urllib.request import urlopen

from explore.planview import generated, tree
from pipeline import summarise
from pipeline.session import build_session

spark = build_session("stages")
spark.conf.set("spark.sql.adaptive.enabled", "false")  # the plan as written
orders, stores = generated(spark)
daily = summarise.daily_sales(orders.join(stores, "store_id"))
print("\n".join(tree(daily)))
daily.collect()

sc = spark.sparkContext
api = f"{sc.uiWebUrl}/api/v1/applications/{sc.applicationId}/stages"
for s in sorted(json.load(urlopen(api)), key=lambda s: s["stageId"]):
    wrote, read = s["shuffleWriteBytes"], s["shuffleReadBytes"]
    moved = f"wrote {wrote:>6,} B  read {read:>6,} B"
    print(f"stage {s['stageId']}: {s['numTasks']:3} tasks", moved)
spark.stop()
