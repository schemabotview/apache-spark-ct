"""Play the live feed: deliver event files one at a time, as shops send them."""
import shutil
from pathlib import Path

ARRIVING = sorted(Path("data/stream/arriving").glob("*.json"))
INBOX = Path("data/stream/in")


def fresh(*folders: str) -> None:
    """Start from nothing: an empty inbox, and no checkpoints or output."""
    for folder in (INBOX, *map(Path, folders)):
        shutil.rmtree(folder, ignore_errors=True)
    INBOX.mkdir(parents=True)


def deliver(n: int) -> str:
    """Copy arriving file n into the inbox, and return its name."""
    shutil.copy(ARRIVING[n], INBOX / ARRIVING[n].name)
    return ARRIVING[n].name


def run_once(writer, checkpoint: str):
    """Process all the inbox files the checkpoint has not seen, then stop."""
    query = writer.option("checkpointLocation", checkpoint)
    query = query.trigger(availableNow=True).start()
    query.awaitTermination()
    return query

