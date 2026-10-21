"""The declared shape of every input, in one place."""

# _corrupt_record: where the reader puts a line it cannot parse (PERMISSIVE)
ORDERS = (
    "order_id STRING, store_id INT, amount DECIMAL(10,2),"
    " status STRING, event_time TIMESTAMP, channel STRING,"
    " _corrupt_record STRING"
)
STORES = "store_id INT, city STRING"
