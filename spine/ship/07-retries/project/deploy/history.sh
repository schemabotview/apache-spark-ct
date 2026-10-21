#!/bin/bash
# The history server: it reads the event logs in data/events, and serves them on
# port 18080 as the same web UI and REST API a running application has.
#   deploy/history.sh start | stop
export SPARK_LOG_DIR=logs SPARK_PID_DIR=logs SPARK_CONF_DIR=conf
export SPARK_HISTORY_OPTS="-Dspark.history.fs.logDirectory=data/events"
HOME_=$(python -c "import pyspark; print(pyspark.__path__[0])")
SBIN=$HOME_/sbin
if [ "$1" = start ]; then
  "$SBIN/start-history-server.sh" > /dev/null
  until curl -s localhost:18080 > /dev/null; do sleep 1; done
  echo "history server on http://localhost:18080"
else
  "$SBIN/stop-history-server.sh" > /dev/null && echo "stopped"
fi
