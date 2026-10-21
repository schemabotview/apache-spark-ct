"""A join planned as sort-merge, switched to broadcast while it ran."""
from explore.planview import generated, tree
from pipeline.session import build_session

spark = build_session("aqe")
orders, _ = generated(spark)
big = orders.select("order_id", "store_id")
rare = orders.where("amount > 99.9").select("order_id", "amount")  # few rows
per_store = big.join(rare, "order_id").groupBy("store_id").count()


def join():
    steps = [s.strip(" :|+-*()0123456789") for s in tree(per_store)]
    return [step for step in steps if "Join" in step]


print("planned:", join())
per_store.collect()  # runs per_store's own plan, so explain shows what ran
print("ran:    ", join(), "(final, then initial)")
print(f"{rare.count():,} rows on the small side; Spark had to guess")
spark.stop()
