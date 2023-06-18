#!/bin/bash



echo "LET'S CHECK THE BATTERY STATUS"

######
#Battery Check Logic
######



FILE_BATTERY_BUS=$1
FILE_BATTERY_ADDR=$2
FILE_BATTERY_FUNC=$3


BATTERY_BUS=$(cat $FILE_BATTERY_BUS)
BATTERY_ADDR=$(cat $FILE_BATTERY_ADDR)
BATTERY_FUNC=$(cat $FILE_BATTERY_FUNC)


PIGPIO_RES=251

while [ ${PIGPIO_RES} -ne 0 ]
do
    sudo systemctl start pigpiod
    PIGPIO_RES=$?
    sleep 1
done

remain=$(i2cget -y 1 ${BATTERY_ADDR} ${BATTERY_FUNC} )
echo "Remaining(hex) : $remain"
echo "Remaining(Dec) : $(($remain))"
if [ $(($remain)) -lt 25  ] ; then
    echo "There's No Enough Battery"
    exit 1
fi