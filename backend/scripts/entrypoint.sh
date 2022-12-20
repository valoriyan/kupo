#!/bin/bash

nohup redis-server &
node build/src/server.js -p $PORT