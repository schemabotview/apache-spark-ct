"""Ask the history server about a run that has already ended."""
import json
from urllib.request import urlopen

API = "http://127.0.0.1:18080/api/v1/applications"


def get(path: str = ""):
    with urlopen(API + path) as response:
        return json.load(response)


for app in get():
    run = app["attempts"][0]
    print(f"{app['name']} {app['id']}: completed {run['completed']},"
          f" {run['duration'] / 1000:.1f} s")
    jobs = get(f"/{app['id']}/jobs")
    stages = get(f"/{app['id']}/stages")
    done = [s for s in stages if s["status"] == "COMPLETE"]
    total = lambda key: sum(s[key] for s in done)
    print(f"  jobs   {len(jobs)}, failed"
          f" {sum(j['status'] == 'FAILED' for j in jobs)}")
    print(f"  stages {len(done)} run, {len(stages) - len(done)} skipped")
    print(f"  tasks  {total('numCompleteTasks')}, failed"
          f" {total('numFailedTasks')}")
    print(f"  input  {total('inputRecords')} rows,"
          f" shuffle {total('shuffleWriteBytes') / 1024:.1f} KiB written")
