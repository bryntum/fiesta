#!/bin/bash

. ~/.bashrc

FIESTA=/home/nickolay/workspace/Bryntum/fiesta

DATE=$(date +%Y-%m-%d)
AGO=$(date +%Y-%m-%d -d "14 days ago")
AGO2=$(date +%Y-%m-%d -d "15 days ago")

mysqldump --user=$FIESTA_MYSQL_USER --password=$FIESTA_MYSQL_PASSWORD fiesta > $FIESTA/backup/$DATE.sql

rm $FIESTA/backup/$AGO.sql
rm $FIESTA/backup/$AGO2.sql
