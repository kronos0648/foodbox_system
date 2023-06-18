#!/bin/bash

sudo cp /home/pi/foodbox_device/foodbox_service /etc/init.d/foodbox_service
sudo chmod 755 /etc/init.d/foodbox_service
sudo update-rc.d foodbox_service defaults