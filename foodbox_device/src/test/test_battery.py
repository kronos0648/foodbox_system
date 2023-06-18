import smbus

DEVICE_BUS=1
DEVICE_ADDR=0x17
C_ADDR=0x07
MICRO_ADDR=0x09
REMAIN_ADDR=0x13

try:
    while(True):
        bus=smbus.SMBus(DEVICE_BUS)
        battery_bytes=bus.read_i2c_block_data(DEVICE_ADDR,REMAIN_ADDR,2)
        battery=int.from_bytes(battery_bytes,byteorder='little')
        with open("src/test/test_battery_remain.txt",'a') as f:
            from datetime import datetime
            now=datetime.now()
            strDate=now.strftime('%Y-%m-%d %H:%M:%S')
            f.write("["+strDate+"] Battery Remaining : " + str(battery)+"\n")
            print("["+strDate+"] Battery Remaining : " + str(battery))
            
        import time
        time.sleep(30)
        
except KeyboardInterrupt:
    print("Close")
    import sys
    sys.exit(0)