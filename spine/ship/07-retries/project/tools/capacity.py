"""Executor sizing and the year's backfill, as arithmetic you can check."""
# a cluster node, and the course's fixed workload
NODE_CORES, NODE_GB = 16, 64
CORES = 5                                  # per executor: a common choice
DAY_GB, YEAR_TB, GB_PER_S = 200, 70, 2     # data, and scan speed per machine

per_node = (NODE_CORES - 1) // CORES       # leave a core for the OS and daemons
container_gb = (NODE_GB - 4) / per_node    # and 4 GB of memory too
# the container holds the heap plus overhead: max(384 MB, 10% of the heap)
heap_gb = int(container_gb / 1.10)
overhead_gb = container_gb - heap_gb
print(f"executor: {CORES} cores, {heap_gb}g heap + {overhead_gb:.0f}g overhead")
print(f"  {per_node} per node, using {per_node * CORES} of {NODE_CORES} cores")

for machines in [1, 10, 50]:
    minutes = YEAR_TB * 1000 / GB_PER_S / machines / 60
    print(f"year backfill, {machines:2} machines: {minutes:5.0f} min,"
          f" {minutes * machines / 60:.1f} machine-hours")
print(f"one day, 1 machine:        {DAY_GB / GB_PER_S / 60:5.1f} min")
