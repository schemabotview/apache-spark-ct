"""The optimizer prunes and pushes down; the planner picks a join."""
import re

from explore.planview import generated, text, tree
from pipeline import summarise
from pipeline.session import build_session

spark = build_session("joins")
orders, stores = generated(spark)


def daily():  # a DataFrame keeps the plan it made: build a fresh one each time
    return summarise.daily_sales(orders.join(stores, "store_id"))


plan = text(daily())
print("pushed:", re.search(r"PushedFilters: (\[[^]]*\])", plan).group(1))
print("read:  ", re.search(r"ReadSchema: (\S+)", plan).group(1))
for threshold in ["10MB", "-1"]:  # the default, then broadcasting off
    spark.conf.set("spark.sql.autoBroadcastJoinThreshold", threshold)
    steps = [step.strip(" :|+-") for step in tree(daily())]
    joins = [step for step in steps if "Join" in step or "Exchange" in step]
    print(f"threshold {threshold:4}:", joins)
spark.stop()
