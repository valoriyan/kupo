#!/bin/bash

nohup redis-server &
node build/server.js -p $PORT