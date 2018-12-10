#!/bin/bash
cp ./bin/runAt.sh /bin/

mkdir -p /programs/runAt
cp -r ./* /programs/runAt
chmod -R 0777 /programs/runAt/data/
