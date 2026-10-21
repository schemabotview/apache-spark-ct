"""The plan that finally ran, with AQE on, and the trace."""
import json
from urllib.request import urlopen

from explore.planview import generated, tree
from pipeline import summarise
from pipeline.session import build_session

spark = build_session("trace")
orders, stores = generated(spark)
daily = summarise.daily_sales(orders.join(stores, "store_id"))
print(len(daily.collect()), "rows")
print("\n".join(tree(daily)[:6]))  # after the action: the final plan

sc = spark.sparkContext
api = f"{sc.uiWebUrl}/api/v1/applications/{sc.applicationId}/stages"
for s in sorted(json.load(urlopen(api)), key=lambda s: s["stageId"]):
    wrote, read = s["shuffleWriteBytes"], s["shuffleReadBytes"]
    moved = f"wrote {wrote:>6,} B  read {read:>6,} B"
    status = f"{s['status']:8} {s['numTasks']:3} tasks"
    print(f"stage {s['stageId']}: {status}", moved)
spark.stop()
