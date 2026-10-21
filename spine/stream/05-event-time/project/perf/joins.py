"""Three join strategies on the same data, and the size Spark estimated."""
import re

from explore.planview import generated, text, tree
from pipeline.session import build_session
from tools.bench import run, seconds

spark = build_session("join-strategies")
orders, stores = generated(spark)
for name, df in [("orders", orders), ("stores", stores)]:
    size = re.search(r"sizeInBytes=([\d.]+ \w+)", text(df, "cost")).group(1)
    print(f"estimated size of {name}: {size}")

for hint in ["broadcast", "shuffle_hash", "merge"]:
    joined = orders.join(stores.hint(hint), "store_id")
    steps = [s.strip(" :|+-*()0123456789") for s in tree(joined)]
    strategy = [step for step in steps if "Join" in step][0]
    print(f"{hint:13} {strategy:22} {seconds(lambda: run(joined)):4.1f} s")
spark.stop()
