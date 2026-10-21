"""Before and after: one change at a time, and the checksum every time."""
from explore.planview import generated
from pipeline import summarise
from pipeline.session import build_session
from tools.bench import checksum, run, seconds

CHANGES = [
    ("baseline (defaults)", {}),
    ("AQE off", {"spark.sql.adaptive.enabled": "false"}),
    ("16 shuffle partitions", {"spark.sql.shuffle.partitions": "16"}),
    ("2000, AQE off", {"spark.sql.shuffle.partitions": "2000",
                       "spark.sql.adaptive.enabled": "false"}),
]
spark = build_session("compare")
orders, stores = generated(spark)
for name, settings in CHANGES:
    spark.conf.unset("spark.sql.adaptive.enabled")  # back to the defaults
    spark.conf.unset("spark.sql.shuffle.partitions")
    for key, value in settings.items():
        spark.conf.set(key, value)
    daily = summarise.daily_sales(orders.join(stores, "store_id"))
    print(f"{name:22} {seconds(lambda: run(daily)):4.1f} s   {checksum(daily)}")
spark.stop()
