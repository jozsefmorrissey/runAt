#!/bin/bash
HOME=/programs/runAt/
if [ "$1" == "HOME" ] 
then
	echo $HOME
else
	node ${HOME}commands.js $@
fi