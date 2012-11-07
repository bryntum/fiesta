#!/bin/bash

# get the directory in which the script reside
DIR="$( cd "$( dirname "$0" )" && pwd )"

cd $DIR/..

git fetch --all
git reset --hard origin/master

screen -S fiesta-server -X kill
screen -d -m -S fiesta-server node app.js
