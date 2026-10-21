#!/bin/bash
# A standalone cluster on this machine: one master, one worker with 4 cores.
#   deploy/standalone.sh start | stop       (logs go to logs/)
mkdir -p logs
if [ "$1" = start ]; then
  spark-class org.apache.spark.deploy.master.Master --host 127.0.0.1 \
    --port 7077 --webui-port 8081 > logs/master.log 2>&1 &
  echo $! > logs/master.pid
  spark-class org.apache.spark.deploy.worker.Worker spark://127.0.0.1:7077 \
    --cores 4 --memory 4g --webui-port 8082 > logs/worker.log 2>&1 &
  echo $! > logs/worker.pid
  until grep -q "Successfully registered with master" logs/worker.log; do
    sleep 1
  done
  echo "master spark://127.0.0.1:7077, one worker: 4 cores, 4 GB"
else
  kill $(cat logs/worker.pid logs/master.pid) && rm logs/*.pid
  echo "stopped"
fi
