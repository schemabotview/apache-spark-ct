"""A correct baseline: the summary on 10 million orders, timed and checked."""
from explore.planview import generated
from pipeline import summarise
from pipeline.session import build_session
from tools.bench import checksum, run, seconds

spark = build_session("baseline")
orders, stores = generated(spark)
daily = summarise.daily_sales(orders.join(stores, "store_id"))

print(f"{orders.count():,} orders in {len(orders.inputFiles())} files")
print("checksum:", checksum(daily))
print(f"median of 3: {seconds(lambda: run(daily)):.1f} s")
spark.stop()
