#!/bin/bash

# IMPORTANT NOTES:
# - should be run with the root of distribution as the current working dir

# updates the sources in-place

echo "Building Fiesta"

sencha build -p fiesta.jsb3 -d .

java -jar build/bin/yuicompressor-2.4.6.jar media/js/fiesta/fiesta-all-debug.js -o media/js/fiesta/fiesta-all.js
java -jar build/bin/yuicompressor-2.4.6.jar media/css/fiesta-all.css -o media/css/fiesta-all.css

