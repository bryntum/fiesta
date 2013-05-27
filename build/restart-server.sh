#!/bin/bash

# get the directory in which the script reside
DIR="$( cd "$( dirname "$0" )" && pwd )"

cd $DIR/..

git fetch --all
git reset --hard origin/master

unset CONTENT_LENGTH

build/update.sh

build/after-push-listener.pl &
