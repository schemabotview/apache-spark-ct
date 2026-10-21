"""Daily sales: completed orders per city and day."""
import os

from pyspark.sql import SparkSession
from pyspark.sql import functions as F

os.environ.setdefault("SPARK_CONF_DIR", "conf")  # quiet logs: see conf/
spark = (
    SparkSession.builder.master("local[4]")
    .appName("daily-sales")
    .getOrCreate()
)

ORDERS = (
    "order_id STRING, store_id INT, amount DECIMAL(10,2),"
    " status STRING, event_time TIMESTAMP"
)
STORES = "store_id INT, city STRING"
orders = spark.read.schema(ORDERS).json("data/raw/orders")
stores = spark.read.schema(STORES).csv("data/raw/stores.csv", header=True)

orders.createOrReplaceTempView("orders")
stores.createOrReplaceTempView("stores")
daily = spark.sql("""
    SELECT to_date(o.event_time) AS day, s.city,
           sum(o.amount) AS sales, count(*) AS orders
    FROM orders o JOIN stores s ON o.store_id = s.store_id
    WHERE o.status = 'COMPLETED'
    GROUP BY 1, 2
    ORDER BY day, city
""")
daily.show()
print([(t.name, t.tableType) for t in spark.catalog.listTables()])

spark.stop()
