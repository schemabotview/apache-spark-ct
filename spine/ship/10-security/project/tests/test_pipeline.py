"""Each test is one failure from Course 8, kept from coming back."""
from decimal import Decimal

import pytest

from pipeline import clean, enrich
from pipeline.schemas import ORDERS, STORES

ROW = {"order_id": "o1", "store_id": 7, "amount": "40.00",
       "status": "COMPLETED", "event_time": None, "channel": None,
       "_corrupt_record": None}


def orders(spark, *changes):
    return spark.createDataFrame([{**ROW, **c} for c in changes], ORDERS)


def test_a_comma_amount_is_a_problem_not_1250(spark):
    row = clean.parse(orders(spark, {"amount": "12,50"})).first()
    assert (row.amount, row.problem) == (None, "amount is not a number")


def test_a_good_amount_is_exact(spark):
    assert clean.parse(orders(spark, {})).first().amount == Decimal("40.00")


def test_a_resend_counts_once(spark):
    assert clean.latest(orders(spark, {}, {})).count() == 1


def test_an_unknown_store_is_set_aside(spark):
    stores = spark.createDataFrame([(9, "York")], STORES)
    row = enrich.with_city(clean.parse(orders(spark, {})), stores).first()
    assert row.problem == "unknown store"


def test_a_repeated_store_is_refused(spark):
    stores = spark.createDataFrame([(7, "Leeds"), (7, "Leeds")], STORES)
    with pytest.raises(ValueError, match=r"store_id \[7\]"):
        enrich.with_city(orders(spark, {}), stores)
