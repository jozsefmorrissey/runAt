#!/bin/bash
cp ./bin/runAt.sh /bin/
cp ./bin/activateUser.sh /bin/
cp ./bin/deactivateUser.sh /bin/

cp ./bin/startup.sh /etc/init.d/
update-rc.d startup.sh defaults


mkdir -p /programs/runAt
cp -r ./* /programs/runAt
chmod -R 0777 /programs/runAt/data/
