#!/bin/bash
HOME=$(./bin/runAt.sh HOME)
cp ./storage/desktopIcons/* /home/$USER/Desktop/
sudo cp ./bin/* /bin/

sudo mkdir -p $HOME
sudo cp -r ./* $HOME
sudo chmod -R 0777 $HOME/data/
sudo chmod +rw $HOME/out.log