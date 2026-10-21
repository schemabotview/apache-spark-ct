"""What the analyzer does to a query before anything is optimised."""
from explore.planview import generated, text
from pipeline.session import build_session

spark = build_session("analysis")
orders, stores = generated(spark)
orders.createOrReplaceTempView("orders")
query = spark.sql(
    "SELECT order_id, amount * 2 AS doubled FROM orders WHERE amount > '90'"
)
parsed, analyzed = text(query).split("\n\n")[:2]
print(parsed)  # names are only text, the table only a name
print(analyzed)  # names bound to columns; types checked, and casts added
spark.stop()
