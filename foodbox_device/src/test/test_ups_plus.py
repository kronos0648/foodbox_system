import smbus

DEVICE_BUS=1
DEVICE_ADDR=0x17
C_ADDR=0x07
MICRO_ADDR=0x09


bus=smbus.SMBus(DEVICE_BUS)

#bus.write_word_data(DEVICE_ADDR,0x0f,500)
#bus.write_word_data(DEVICE_ADDR,0x11,500)

battery_bytes=bus.read_i2c_block_data(DEVICE_ADDR,0x0d,2)
battery=int.from_bytes(battery_bytes,byteorder='little')
print("Full mV : ",battery)
battery_bytes=bus.read_i2c_block_data(DEVICE_ADDR,0x0f,2)
battery=int.from_bytes(battery_bytes,byteorder='little')
print("Empty mv : ",battery)
battery_bytes=bus.read_i2c_block_data(DEVICE_ADDR,0x11,2)
battery=int.from_bytes(battery_bytes,byteorder='little')
print("Protection mv : ",battery)


#import time
#time.sleep(60)

battery_bytes=bus.read_i2c_block_data(DEVICE_ADDR,0x0d,2)
battery=int.from_bytes(battery_bytes,byteorder='little')
print("Full mV : ",battery)
battery_bytes=bus.read_i2c_block_data(DEVICE_ADDR,0x0f,2)
battery=int.from_bytes(battery_bytes,byteorder='little')
print("Empty mv : ",battery)
battery_bytes=bus.read_i2c_block_data(DEVICE_ADDR,0x11,2)
battery=int.from_bytes(battery_bytes,byteorder='little')
print("Protection mv : ",battery)