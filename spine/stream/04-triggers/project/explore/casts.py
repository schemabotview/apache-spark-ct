"""How Spark 4 casts text to numbers, with ANSI mode on and off."""
import logging

from pyspark.errors import PySparkException

from pipeline.session import build_session

logging.getLogger("SQLQueryContextLogger").disabled = True  # we print our own
spark = build_session("casts")
CASES = [
    "CAST('12,50' AS DECIMAL(10,2))",
    "TRY_CAST('12,50' AS DECIMAL(10,2))",
    "CAST(123456789.5 AS DECIMAL(10,2))",
    "2147483647 + 1",
]
print(f"{'expression':36} {'ANSI on':27} ANSI off")
for expr in CASES:
    results = []
    for ansi in ("true", "false"):
        spark.conf.set("spark.sql.ansi.enabled", ansi)
        try:
            results.append(str(spark.sql(f"SELECT {expr}").first()[0]))
        except PySparkException as error:
            results.append(error.getCondition().split(".")[0])
    print(f"{expr:36} {results[0]:27} {results[1]}")
spark.stop()
