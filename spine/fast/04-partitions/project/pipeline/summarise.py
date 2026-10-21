"""Completed sales per city and day, where a day is the shops' day."""
from pyspark.sql import Column, DataFrame
from pyspark.sql import functions as F

SHOP_TZ = "Europe/London"  # the shops close their day in UK time


def shop_day(column: str = "event_time") -> Column:
    """The calendar day an instant falls on, in the shops' time zone."""
    return F.to_date(F.from_utc_timestamp(column, SHOP_TZ))


def daily_sales(orders: DataFrame) -> DataFrame:
    completed = orders.where(F.col("status") == "COMPLETED")
    return completed.groupBy(shop_day().alias("day"), "city").agg(
        F.sum("amount").alias("sales"), F.count("*").alias("orders")
    )
