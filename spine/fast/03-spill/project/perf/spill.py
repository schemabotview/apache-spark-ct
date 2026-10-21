"""A sort that does not fit in memory: the spill, in the stage metrics."""
import json
from urllib.request import urlopen

from explore.planview import generated
from pipeline.session import build_session
from tools.bench import run

spark = build_session("spill")
orders, _ = generated(spark)
sc = spark.sparkContext
api = f"{sc.uiWebUrl}/api/v1/applications/{sc.applicationId}/stages"

for partitions in [1, 200]:  # every row into one task, then spread out
    spark.conf.set("spark.sql.adaptive.enabled", "false")
    spark.conf.set("spark.sql.shuffle.partitions", partitions)
    run(orders.orderBy("amount", "order_id"))
    last = max(json.load(urlopen(api)), key=lambda s: s["stageId"])
    spilled = last["diskBytesSpilled"] / 2**20
    print(f"{partitions:3} partitions: {last['numTasks']:3} tasks,"
          f" spilled {spilled:6.1f} MB to disk, {last['executorRunTime']} ms")
spark.stop()
