#!/bin/bash

ENV_NODE=development; export ENV_NODE
echo ENVIRONEMENT: $ENV_NODE
case $1 in
start)
  echo "starting" 
  npm start
  ;;
stop)
  echo "stop requested"
  npm stop
  ;;
restart)
  echo "restart requested"
  npm restart
  ;;
*)
  echo "Ignore request" 
  ;;
esac
