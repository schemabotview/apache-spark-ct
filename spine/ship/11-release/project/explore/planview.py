"""The generated data, and explain() read as data rather than as text."""
import contextlib
import io
import re

LINE = re.compile(r"^([\s:|+\-]*(?:\*\(\d+\) )?)('?[A-Za-z]+)")


def generated(spark):
    """The orders and stores tools/make_orders.py wrote."""
    orders = spark.read.parquet("data/gen/orders")
    stores = spark.read.csv("data/gen/stores", header=True,
                            schema="store_id INT, city STRING")
    return orders, stores


def text(df, mode: str = "extended") -> str:
    """What df.explain(mode) prints, as a string."""
    with contextlib.redirect_stdout(io.StringIO()) as out:
        df.explain(mode=mode)
    return out.getvalue()


def name(line: str) -> str:
    """'   :  +- FileScan parquet [...]' -> 'FileScan parquet'"""
    op = LINE.match(line).group(2)
    if op in ("Relation", "FileScan"):  # say which source
        op += " " + re.findall(r"\b(parquet|csv|json)\b", line)[0]
    return op


def phases(df) -> dict[str, list[str]]:
    """Phase name -> operators: parsed, analyzed, optimized, physical."""
    plans, phase = {}, ""
    for line in text(df).splitlines():
        if line.startswith("== "):
            phase = line.strip("= ").split()[0].lower()
            plans[phase] = []
        elif LINE.match(line) and not re.match(r"^\w+: ", line):  # no schemas
            plans[phase].append(name(line))
    return plans


def tree(df, mode: str = "simple") -> list[str]:
    """The physical plan's shape: each operator, without its arguments."""
    lines = [line for line in text(df, mode).splitlines() if LINE.match(line)]
    return [LINE.match(line).group(1) + name(line) for line in lines]
