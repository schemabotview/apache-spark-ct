"""Invariants every run must satisfy before its output is trusted."""
from pyspark.sql import DataFrame
from pyspark.sql import functions as F


def check(orders: DataFrame, daily: DataFrame) -> list[str]:
    """Raise on a broken invariant; otherwise say what was checked."""
    usable = orders.where("problem IS NULL AND status = 'COMPLETED'")
    rows, ids = usable.count(), usable.select("order_id").distinct().count()
    if rows != ids:
        raise AssertionError(f"{rows - ids} order ids are counted twice")
    if usable.where("amount <= 0").count():
        raise AssertionError("an amount is zero or negative")
    money_in = usable.agg(F.sum("amount")).first()[0]
    money_out = daily.agg(F.sum("sales")).first()[0]
    if money_in != money_out:
        raise AssertionError(f"summary has {money_out}, orders have {money_in}")
    problems = orders.where("problem IS NOT NULL").count()
    return [
        f"{ids} completed orders, each counted once",
        f"every amount positive; {money_in} in = {money_out} out",
        f"{problems} rows set aside with a reason",
    ]
