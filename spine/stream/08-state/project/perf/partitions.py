"""How many shuffle partitions: a sweep, one setting at a time."""
from explore.planview import generated
from pipeline.session import build_session
from tools.bench import run, seconds

spark = build_session("partitions")
spark.conf.set("spark.sql.adaptive.enabled", "false")  # measure the setting
orders, _ = generated(spark)
per_order = orders.groupBy("order_id").count()  # 10 million groups

for partitions in [4, 16, 200, 2000]:
    spark.conf.set("spark.sql.shuffle.partitions", partitions)
    took = seconds(lambda: run(per_order))
    print(f"{partitions:5} partitions: {took:5.1f} s")
spark.stop()
