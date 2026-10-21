"""The pipeline's daily summary on a million orders, and its four plans."""
from explore.planview import generated, phases
from pipeline import summarise
from pipeline.session import build_session

spark = build_session("plans")
orders, stores = generated(spark)
daily = summarise.daily_sales(orders.join(stores, "store_id"))

for phase, operators in phases(daily).items():
    print(f"{phase:9}", " > ".join(operators))
spark.stop()
