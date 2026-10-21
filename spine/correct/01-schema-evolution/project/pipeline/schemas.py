"""The declared shape of every input, in one place."""

ORDERS = (
    "order_id STRING, store_id INT, amount DECIMAL(10,2),"
    " status STRING, event_time TIMESTAMP, channel STRING"
)
STORES = "store_id INT, city STRING"
