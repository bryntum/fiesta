#!/bin/bash

# get the directory in which the script reside
DIR="$( cd "$( dirname "$0" )" && pwd )"

cd $DIR/..

git fetch --all
git reset --hard origin/master

build/after-push-listener.pl

#echo "Stopping Fiesta server"
#screen -S fiesta-server -X kill
#echo "Starting Fiesta server"
#screen -d -m -S fiesta-server node app.js

