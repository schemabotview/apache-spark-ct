"""Live sales: completed orders per city in 10-minute windows, as they come."""
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

from pipeline import clean
from pipeline.schemas import ORDERS, STORES
from pipeline.session import build_stream_session

CHECKPOINT = "data/stream/checkpoints/live_sales"
OUTPUT = "data/out/live_sales"


def run_once(spark: SparkSession) -> None:
    """Process every new event file, write the windows that are final, stop."""
    raw = spark.readStream.schema(ORDERS).json("data/stream/in")
    stores = spark.read.schema(STORES).csv("data/raw/stores.csv", header=True)
    events = clean.parse(raw).where("problem IS NULL AND status = 'COMPLETED'")
    once = (events.withWatermark("event_time", "10 minutes")
            .dropDuplicatesWithinWatermark(["order_id"]))  # resend counts once
    windows = (once.join(stores, "store_id")
               .groupBy(F.window("event_time", "10 minutes"), "city")
               .agg(F.sum("amount").alias("sales"),
                     F.count("*").alias("orders"))
               .select(F.col("window.start").alias("start"), "city",
                        "sales", "orders"))
    query = (windows.writeStream.outputMode("append").format("parquet")
             .option("path", OUTPUT).option("checkpointLocation", CHECKPOINT)
             .trigger(availableNow=True).start())
    query.awaitTermination()


if __name__ == "__main__":
    spark = build_stream_session("live-sales")
    run_once(spark)
    spark.stop()
