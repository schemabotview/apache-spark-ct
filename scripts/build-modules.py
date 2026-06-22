#!/usr/bin/env python3
"""Generate the 9-module manifest from the notebooks under notebooks/.

Each module is notebook-backed: the notebook is the source of truth for prose +
code; this script emits the per-section overlay (scene + highlights + tts) the UI
applies. The existing spark-rdd module is preserved as-is. Re-run after editing
the CONFIG or syncing notebooks.
"""
import json, re, os

def norm(h): return re.sub(r'\s+', ' ', h.lower().replace('`', '')).strip()
def slug(h):
    s = re.sub(r'[^a-z0-9]+', '-', norm(h)).strip('-')
    return s or 'section'

def headings(nb_path):
    nb = json.load(open(nb_path))
    out = []
    for c in nb['cells']:
        if c['cell_type'] == 'markdown':
            s = c['source'] if isinstance(c['source'], str) else ''.join(c['source'])
            for line in s.split('\n'):
                m = re.match(r'^##\s+(.+?)\s*$', line)
                if m: out.append(m.group(1).strip())
    return out

# Each rule: (keyword_in_heading, scene_override_or_None, [highlightNodeIds])
CONFIG = [
 {"id":"spark-foundations","title":"Spark Foundations & Execution Model",
  "notebook":"notebooks/01-spark-foundations-execution-model.ipynb","defaultScene":"spark-execution",
  "rules":[
    ("what spark actually is",None,["driver","executors","cluster"]),
    ("the cluster",None,["cluster","cm-local","cm-standalone","cm-yarn","cm-k8s","cm-databricks","driver","executors"]),
    ("memory-first",None,["executors","ex1","ex2"]),
    ("from your code",None,["driver","catalyst","dag","executors"]),
    ("deployment modes",None,["cm-local","cm-standalone","cm-yarn","cm-k8s","cm-databricks"]),
    ("your first sparksession",None,["driver"]),
    ("lazy evaluation, in depth",None,["catalyst","dag"]),
    ("lazy evaluation",None,["catalyst","dag"]),
    ("hello spark",None,["driver","catalyst","dag","executors"]),
    ("four catalyst plans",None,["catalyst","ulp","logical","optimized","physical"]),
    ("tungsten",None,["tungsten"]),
    ("explain",None,["catalyst","physical"]),
    ("adaptive query",None,["catalyst"]),
    ("split-driver",None,["driver"]),
    ("why spark connect",None,["driver"]),
    ("starting a server",None,["driver","executors"]),
    ("detecting which mode",None,["driver"]),
  ]},
 {"id":"spark-dataframes","title":"DataFrames",
  "notebook":"notebooks/03-dataframes.ipynb","defaultScene":"spark-dataframe-api",
  "rules":[
    ("api hierarchy","apache-spark-api-stack",["rdd","dataframe","sql","pandas"]),
    ("what a dataframe",None,["df-create","df-transforms"]),
    ("schemas",None,["df-structtype","df-ddl"]),
    ("creating dataframes",None,["df-create","df-createdf","df-read","df-sql"]),
    ("exploring",None,["df-show","df-printschema","df-describe"]),
    ("column references",None,["df-colref","df-colname","df-col","df-expr","df-dfcol"]),
    ("common dataframe operations",None,["df-transforms","df-select","df-withcolumn","df-filter","df-orderby"]),
    ("three dataframe types","spark-pandas-api",["ps-create","ps-frompandas","ps-pandasapi"]),
    ("operations look like pandas","spark-pandas-api",["ps-transforms","ps-select","ps-filter","ps-groupby"]),
    ("converting between the three","spark-pandas-api",["ps-topandas","ps-pandasapi"]),
    ("default indexes","spark-pandas-api",["ps-index","ps-sequence","ps-distributed","ps-distseq"]),
    ("limitations and gotchas","spark-pandas-api",["ps-opsdiff"]),
  ]},
 {"id":"spark-reading-writing","title":"Reading & Writing Data",
  "notebook":"notebooks/04-reading-writing.ipynb","defaultScene":"spark-reading-sources",
  "rules":[
    ("unified read/write",None,["rd-sources"]),
    ("reading the four formats",None,["rd-csv","rd-parquet","rd-json","rd-orc"]),
    ("schema inference",None,["rd-mergeschema","rd-format"]),
    ("predicate and projection",None,["rd-parquet"]),
    ("bad-record",None,["rd-badrecord","rd-permissive","rd-failfast","rd-dropmalformed","rd-corruptcol"]),
    ("reading multiple files",None,["rd-multifile","rd-glob","rd-regex","rd-multipaths","rd-recursive"]),
    ("write modes","spark-writing-sinks",["wr-mode","wr-overwrite","wr-append","wr-error","wr-ignore"]),
    ("writing the four formats","spark-writing-sinks",["wr-parquet","wr-csv","wr-json","wr-delta"]),
    ("partitionby","spark-writing-sinks",["wr-partitionby"]),
    ("bucketby","spark-writing-sinks",["wr-bucketby","wr-sortby"]),
    ("saveastable vs save","spark-writing-sinks",["wr-save","wr-saveastable"]),
    ("coalesce vs repartition","spark-writing-sinks",["wr-layout","wr-write"]),
    ("jdbc","spark-writing-sinks",["wr-jdbc","wr-jdbctarget"]),
  ]},
 {"id":"spark-transformations","title":"Transformations & Aggregations",
  "notebook":"notebooks/05-data-transformations.ipynb","defaultScene":"spark-transformations",
  "rules":[
    ("the function library",None,["tf-functions","tf-str","tf-date","tf-array","tf-when"]),
    ("string functions",None,["tf-str"]),
    ("date and timestamp",None,["tf-date"]),
    ("array functions",None,["tf-array"]),
    ("conditional columns",None,["tf-when"]),
    ("union vs unionbyname",None,["tf-union","tf-unionbyname"]),
    ("set operations",None,["tf-intersect","tf-except"]),
    ("joins",None,["tf-joins","tf-inner","tf-left","tf-right","tf-outer","tf-semi","tf-anti","tf-cross"]),
    ("groupby",None,["tf-groupby","tf-aggcall"]),
    ("aggregate function reference",None,["tf-agg","tf-aggcall"]),
    ("filtering groups",None,["tf-having"]),
    ("pivot tables",None,["tf-pivot"]),
    ("unpivot",None,["tf-unpivot"]),
    ("sampling",None,["tf-sample"]),
    ("window functions",None,["tf-window","tf-rownumber","tf-rank","tf-lag","tf-lead"]),
    ("ranking",None,["tf-rownumber","tf-rank","tf-denserank","tf-ntile"]),
    ("lag and lead",None,["tf-lag","tf-lead"]),
    ("running aggregates",None,["tf-rowsbetween","tf-rangebetween"]),
  ]},
 {"id":"spark-sql-udfs","title":"Spark SQL & UDFs",
  "notebook":"notebooks/06-sql-udfs.ipynb","defaultScene":"spark-sql-api",
  "rules":[
    ("sql is a first-class",None,["sql-queries","sql-select"]),
    ("register the seven bank tables",None,["sql-views","sql-tempview","sql-listtables"]),
    ("temporary views",None,["sql-tempview","sql-globalview","sql-saveastable"]),
    ("basic sql queries",None,["sql-select","sql-from","sql-where","sql-orderby","sql-limit"]),
    ("null semantics",None,["sql-null","sql-eq","sql-nulleq","sql-isnull","sql-coalesce"]),
    ("ctes",None,["sql-cte"]),
    ("sql joins",None,["sql-joins","sql-innerjoin","sql-leftjoin","sql-fulljoin","sql-semianti"]),
    ("subqueries",None,["sql-subquery"]),
    ("window functions in sql",None,["sql-rownumber","sql-rank","sql-laglead","sql-cumedist"]),
    ("the catalog api",None,["sql-listtables","sql-listcolumns"]),
    ("dataframe api vs sql",None,["sql-queries"]),
    ("numeric functions",None,["sql-mathfns","sql-roundfns"]),
    ("advanced date functions",None,["sql-datefns","sql-dateadd"]),
    ("higher-order array functions",None,["sql-arraycontains","sql-arraysort"]),
  ]},
 {"id":"spark-streaming","title":"Structured Streaming",
  "notebook":"notebooks/07-structured-streaming.ipynb","defaultScene":"spark-structured-streaming",
  "rules":[
    ("batch vs structured streaming",None,["ss-process"]),
    ("micro",None,["ss-trigger"]),
    ("api parity",None,["ss-process"]),
    ("your first streaming query",None,["ss-offset","ss-process","ss-sink"]),
    ("sources",None,["ss-offset"]),
    ("sinks",None,["ss-sink"]),
    ("output modes",None,["ss-sink","ss-process"]),
    ("triggers",None,["ss-trigger"]),
    ("checkpointing and fault",None,["ss-checkpoint"]),
    ("monitoring streaming",None,["ss-process"]),
    ("time and windows","spark-windowing",["win-tumbling","win-sliding","win-session"]),
    ("watermarking","spark-watermarking",["wm-line","wm-closed","wm-open","wm-drop","wm-keep"]),
    ("joins",None,["ss-state"]),
    ("stateful operations",None,["ss-state"]),
    ("state store",None,["ss-state","ss-checkpoint"]),
  ]},
 {"id":"spark-performance","title":"Performance Tuning",
  "notebook":"notebooks/08-performance-tuning.ipynb","defaultScene":"spark-performance-tuning",
  "rules":[
    ("partition sizing",None,["pt-partitioning","pt-shufparts"]),
    ("repartition vs coalesce",None,["pt-repartition","pt-coalesce","pt-partitionby"]),
    ("tuning",None,["pt-shuffleconf","pt-shufparts"]),
    ("what triggers a shuffle",None,["pt-shuffle"]),
    ("reading shuffles",None,["pt-shuffle"]),
    ("caching dataframes","spark-cache-persist",["cp-cache","cp-persist","cp-api"]),
    ("storage levels","spark-cache-persist",["cp-levels","cp-memonly","cp-memonlyser","cp-memdisk","cp-memdisk2"]),
    ("cachetable",None,None),
    ("unpersist","spark-cache-persist",["cp-unpersist","cp-cache"]),
    ("driver-side bottlenecks",None,["pt-levers"]),
    ("join strategies",None,["pt-smj","pt-broadcast","pt-broadcastdf","pt-autobroadcast"]),
    ("detecting and fixing data skew",None,["pt-shuffle","pt-shufparts"]),
  ]},
 {"id":"spark-pandas","title":"Pandas API on Spark",
  "notebook":"notebooks/09-pandas-api.ipynb","defaultScene":"spark-pandas-api",
  "rules":[
    ("why this api exists",None,["ps-pandasapi"]),
    ("setup",None,["ps-create"]),
    ("three dataframe types",None,["ps-create","ps-frompandas","ps-pandasapi"]),
    ("creating a ps.dataframe",None,["ps-create","ps-fromdict","ps-read","ps-frompandas"]),
    ("transformations",None,["ps-transforms","ps-select","ps-filter","ps-groupby","ps-rename","ps-apply","ps-accessors"]),
    ("actions",None,["ps-actions","ps-tocsv","ps-toparquet","ps-tojson","ps-topandas"]),
    ("the spark bridge",None,["ps-topandas","ps-pandasapi"]),
    ("default index types",None,["ps-index","ps-sequence","ps-distributed","ps-distseq"]),
    ("gotchas",None,["ps-opsdiff"]),
  ]},
]

def build_module(cfg):
    hs = headings(cfg["notebook"])
    sections = []
    for i, h in enumerate(hs):
        nh = norm(h)
        scene_ov, nodes = None, None
        for kw, sc, ns in cfg["rules"]:
            if kw in nh:
                scene_ov, nodes = sc, ns
                break
        sec = {"id": "overview" if i == 0 else slug(h), "heading": h}
        if i == 0: sec["title"] = cfg["title"]
        if scene_ov: sec["scene"] = scene_ov
        if nodes: sec["highlightNodeIds"] = nodes
        tts = f"tts/{cfg['id']}/{sec['id']}.tts"
        if os.path.exists(tts): sec["tts"] = tts
        sections.append(sec)
    return {"id": cfg["id"], "title": cfg["title"], "topic": "apache-spark",
            "notebook": cfg["notebook"], "defaultScene": cfg["defaultScene"], "sections": sections}

m = json.load(open("manifest.json"))
rdd = next(p for p in m["presentations"] if p["id"] == "spark-rdd")  # preserve as-is
built = {c["id"]: build_module(c) for c in CONFIG}

order = ["spark-foundations","spark-rdd","spark-dataframes","spark-reading-writing",
         "spark-transformations","spark-sql-udfs","spark-streaming","spark-performance","spark-pandas"]
m["presentations"] = [rdd if oid == "spark-rdd" else built[oid] for oid in order]

# ensure the new scene is registered
if "spark-transformations" not in m["scenes"]:
    m["scenes"].append("spark-transformations")

json.dump(m, open("manifest.json", "w"), indent=2, ensure_ascii=False)

print("modules:", len(m["presentations"]))
for p in m["presentations"]:
    nsec = len(p["sections"]) if "sections" in p else len(p.get("pages", []))
    hi = sum(1 for s in p.get("sections", []) if s.get("highlightNodeIds"))
    ov = sum(1 for s in p.get("sections", []) if s.get("scene"))
    print(f"  {p['id']:22} scene={p.get('defaultScene','-'):24} sections={nsec:2} highlighted={hi:2} sceneOverrides={ov}")
