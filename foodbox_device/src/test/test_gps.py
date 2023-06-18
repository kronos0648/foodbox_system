import serial
import time
gpgga_info = "$GPGGA,"
ser = serial.Serial ("/dev/ttyUSB1")
GPGGA_buffer = 0
NMEA_buff = 0
     
     
while(True):       
    received_data=str(ser.readline())
    GPGGA_data_available=received_data.find(gpgga_info)
    if(GPGGA_data_available>0):
        GPGGA_buffer=received_data.split("$GPGGA,",1)[1]
        with open("gps_log.txt","a") as f:
            f.write(GPGGA_buffer+"\n")
        time.sleep(10)
"""GPGGA_data_available=received_data.find(gpgga_info)
if(GPGGA_data_available>0):
    GPGGA_buffer=received_data.split("$GPGGA,",1)[1]
    NMEA_buff=GPGGA_buffer.split(',')
    NMEA_latitude=NMEA_buff[1]
    NMEA_longitude=NMEA_buff[3]
                
    self.__status.latitude="%.4f"%((int(NMEA_latitude/100.00))
                                               +((NMEA_latitude/100.00-int(NMEA_latitude/100.00))/0.6))
    self.__status.longitude="%.4f"%((int(NMEA_longitude/100.00))
                                               +((NMEA_longitude/100.00-int(NMEA_longitude/100.00))/0.6))"""