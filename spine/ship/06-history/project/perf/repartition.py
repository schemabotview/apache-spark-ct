"""repartition against coalesce: the plan, the files, the time."""
import glob

from explore.planview import generated, tree
from pipeline.session import build_session
from tools.bench import seconds

spark = build_session("repartition")
orders, _ = generated(spark)
completed = orders.where("status = 'COMPLETED'")

WAYS = [("as read", completed),
        ("repartition(16)", completed.repartition(16)),
        ("coalesce(2)", completed.coalesce(2)),
        ("coalesce(1)", completed.coalesce(1))]
for name, df in WAYS:
    path = f"data/tmp/{name.split('(')[0]}"
    took = seconds(lambda: df.write.mode("overwrite").parquet(path), runs=1)
    files = len(glob.glob(f"{path}/*.parquet"))
    exchange = any("Exchange" in step for step in tree(df))
    print(f"{name:16} {files:3} files  {took:4.1f} s  shuffle: {exchange}")
spark.stop()
