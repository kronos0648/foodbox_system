import sys, os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
import pigpio
from config import HwConfig
import time

def roll(value : int):
    pi=pigpio.pi()
    hw=HwConfig()
    pi.set_mode(hw.PIN_SERVOMOTOR,pigpio.OUTPUT)
    min_value=0
    max_value=180
    min_pulse=500
    max_pulse=2500
    frequency=50 #50hz
    
    #duty rate
    #0도 = 2.5%
    #90도 = 7.5%
    #180도 = 12.5%
    
    
    write_value = (value - min_value) / (max_value - min_value) * (max_pulse - min_pulse) + min_pulse
    #write_value = (value - min_value) / (max_value - min_value) * (max_pulse - min_pulse)
    print(str(value) +"도 : "+str(write_value))
    print("Duty rate : "+str(write_value*frequency/1000))
    pi.hardware_PWM(hw.PIN_SERVOMOTOR, frequency, int(write_value * frequency))
    time.sleep(1)

roll(180)
roll(100)
roll(0)