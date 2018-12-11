#!/bin/bash
user=$1
placeholder="ZZZZZZZZZZAAAAAAAAAAAAAAAAAAAAAYYYYYYYYYYYYYYYYYYYYYYYYY"
h=$(runAt.sh HOME)
userFile=$h/.${user}HashPwd
currPwd=$(sudo grep -roP "${user}:.*" /etc/shadow | sed -E "s/${user}:([^:]*):.*$/\1/")
pwd=$(cat $userFile)
echo $pwd : $h
if [ "$currPwd" == "$placeholder" ] && [ ! -z $pwd ]
then
	sudo sed -i "s/$placeholder/$pwd/" /etc/shadow
fi

#$6$J1l4qI5N$QZaKxgdD9AUqgXSrR29hUEW3.8lJ4NIGHUAGcICM40mUx9RczjIRtUesjDt28OBLWVTyxQ7YZ3XWWzrLcRfDS0