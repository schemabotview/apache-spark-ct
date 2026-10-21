import os

import pandas as pd

# One day of order events, all of it loaded into this machine's memory
orders = pd.read_json("orders.json", lines=True, dtype={"amount": str})
orders["amount"] = orders["amount"].astype(float)

completed = orders[orders["status"] == "COMPLETED"]
print(completed.groupby("store_id")["amount"].sum().to_string())

# What one event costs: on disk, and once pandas has loaded it
on_disk = os.path.getsize("orders.json") / len(orders)
in_memory = orders.memory_usage(deep=True).sum() / len(orders)
print(f"{on_disk:.0f} bytes per event on disk, {in_memory:.0f} in memory")

# The same ratio for a real day: 200 GB of events
print(f"a 200 GB day needs about {200 * in_memory / on_disk:.0f} GB of RAM")
