"""The declared shape of every input, in one place."""

# amount is read as TEXT and parsed in clean.py: given DECIMAL, the JSON
# reader turns "12,50" into 1250.00 without a word.
# _corrupt_record: where the reader puts a line it cannot parse (PERMISSIVE)
ORDERS = (
    "order_id STRING, store_id INT, amount STRING,"
    " status STRING, event_time TIMESTAMP, channel STRING,"
    " _corrupt_record STRING"
)
STORES = "store_id INT, city STRING"
