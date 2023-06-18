#!/bin/bash

#refenence link : https://blog.dalso.org/article/bash-%EC%89%98-%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%A1%9C-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-%EC%9E%A5%EC%B9%98%EB%AA%85-ip-mac-%EC%A3%BC%EC%86%8C

HUB_ADDR_FILE=$1
DEV_ID_FILE=$2


#Network Check Logic
######
num_tried=1


DEV=""
IP=""
MAC=""

while [ -z ${IP} ] && [ ${num_tried} -lt 21 ]
do
    DEV_LIST=$(ip route show default | awk '/default/{print $5}')
    DEV_ISEXIST=0
    for ((i=1;i<100;i++)) do
        DEV_ITEM=$(echo $DEV_LIST | awk '{print $'$i'}')

        #DEV ITEM's String Length Check, if 0, end of detected Network Interface
        if [ ${#DEV_ITEM} -eq 0 ]; then
            DEV=${DEV_ITEM}
            DEV_ISEXIST=0
            break
        fi

        #DEV ITEM's name Check, if usb0, Cellular Module's Network Interface
        if [ ${DEV_ITEM} == "usb0" ]; then
            DEV=${DEV_ITEM}
            DEV_ISEXIST=1
            break
        fi

    done

    echo -e "\n\n"

    #CHECK IF Cellular Module's NETWORK INTERFACE or Not
    if [ 0 -eq ${DEV_ISEXIST} ]; then
        echo "Network Detection Trial ${num_tried} / 20"
        echo "Network Interface Not Found"
        #CHECK per 3 sec
        num_tried=`expr $num_tried + 1`
        sleep 3
        continue
    else
        echo "Network Detection Trial ${num_tried} / 20"
        echo "Network Interface Found!"
    fi


    #CHECK IF NETWORK INTERFACE's IP Allocated or Not
    IP=$(ip -4 -o addr show ${DEV} | awk '{print $4}')
    IP=$(echo $IP | cut -d '/' -f1)
    if [ ${IP} == "127.0.0.1" ]; then
        echo "IP Address Not Found"
        #CHECK per 3 sec
        num_tried=`expr $num_tried + 1`
        sleep 2
        continue
    fi


    #CHECK IF NETWORK INTERFACE"s MAC Address Allocated or Not
    MAC=$(cat /sys/class/net/${DEV}/address)
    if [ -z ${MAC} ]; then
        echo "mac address not found"
    fi
    
done

#IoT Hub Status Check Logic
######
HUB_ADDR=$(cat $HUB_ADDR_FILE)
HUB_IP=$(echo $HUB_ADDR | cut -d ':' -f1)
DEV_ID=$(cat $DEV_ID_FILE)


#CHECK IF IoT Hub's Port is Open or Closed
URL="http://${HUB_ADDR}/device/battery"
CURL_RES=1111
CURL_TRY=1


while [ ${CURL_RES} -ne 0 ]
do
    curl -v -d '{"dev_id" : '$DEV_ID', "battery" : "1"}' -H 'Content-Type: application/json' -X POST ${URL}
    CURL_RES=$?
    echo "CURL TRY : ${CURL_TRY} / 5"
    echo "CURL RESULT : ${CURL_RES}"
    if [ ${CURL_RES} -eq 0 ]; then
        break
    fi
    
    if [ ${CURL_TRY} -eq 100 ]; then
        break
    fi
    CURL_TRY=`expr $CURL_TRY + 1`
    sleep 3
done

echo "FINAL CURL RES = ${CURL_RES}"

if [ $CURL_RES -eq 0 ] ; then
    echo -e "IoT Hub STATUS IS OKAY...LET'S EXECUTE THE PROCESS\n\n\n"
    exit 0
else
    echo -e "\n\n"
    echo "IoT HUB STATUS IS NOT OKAY...LET'S EXIT"
    exit 3
fi