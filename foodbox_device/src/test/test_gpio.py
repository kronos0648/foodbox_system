import sys, os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
import pigpio
from config import HwConfig
import asyncio
import sys

pi=pigpio.pi()
hw=HwConfig()
pi.set_mode(hw.PIN_LED,pigpio.OUTPUT)
pi.set_mode(hw.PIN_SPEAKER,pigpio.OUTPUT)

pi.write(hw.PIN_LED,True)
#pi.write(hw.PIN_RED,True)
pi.write(hw.PIN_RED,False)
pi.write(hw.PIN_GREEN,True)


from dataclasses import dataclass

@dataclass
class AudioBlock:
    delay : int
    length : float
    
def play(audio : list[AudioBlock]):
    for block in audio:
        pi.wave_clear()

        tone=[pigpio.pulse(1<<hw.PIN_SPEAKER,0,block.delay)
                        ,pigpio.pulse(0,1<<hw.PIN_SPEAKER,block.delay)]
        pi.wave_add_generic(tone)
        wid=pi.wave_create()

        async def sound(wid):
            import time
            if(wid>=0):
                    pi.wave_send_repeat(wid)
                    time.sleep(block.length)
                    pi.wave_tx_stop()
                    pi.wave_delete(wid)
        asyncio.run(sound(wid=wid))
        
        
audio : list[AudioBlock]=[]
block=AudioBlock(delay=3000,length=0.5)
audio.append(block)
block=AudioBlock(delay=500,length=0.5)
audio.append(block)

play(audio)

