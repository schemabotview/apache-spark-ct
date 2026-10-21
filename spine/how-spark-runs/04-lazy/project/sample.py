from decimal import Decimal

# The six-order sample, as Python tuples: order, store, amount, status
ORDERS = [
    ("o1", 7, Decimal("40.00"), "COMPLETED"),
    ("o2", 7, Decimal("25.00"), "COMPLETED"),
    ("o3", 9, Decimal("60.00"), "CANCELLED"),
    ("o4", 9, Decimal("15.00"), "COMPLETED"),
    ("o5", 12, Decimal("80.00"), "COMPLETED"),
    ("o6", 7, Decimal("10.00"), "PENDING"),
]
SCHEMA = "order_id STRING, store_id INT, amount DECIMAL(10,2), status STRING"
