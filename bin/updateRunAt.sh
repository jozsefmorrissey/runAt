#!/bin/bash
tempDir=/home/$USER/runAt
git clone https://github.com/jozsefmorrissey/runAt.git $tempDir
cd $tempDir
./install.sh
rm -r -f $tempDir
