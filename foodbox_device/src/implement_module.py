#파일명 : module.py
#경로 : foodbox_device/.
#용도 : 시스템 구성 모듈 제어
#내용 : Client, HwController, HwStatus 클래스 구현


from abs.abstract_module import OperationModule
from config import ClientConfig,HwConfig
#from implement_module import HwController,Client,HwStatus
from sub import ErrorLogger,Function
from request import IotHubRequestHandler,DeviceRequestHandler

import sys
import requests
import websocket
import asyncio
import json


#IoT 허브와의 요청 송수신을 담당하는 클라이언트 모듈 클래스
class Client(OperationModule):
    def __init__(self) -> None :
        super().__init__()
        self.config : ClientConfig = None
        self.__webSocket = None

    #클라이언트가 IoT 허브 요청 이벤트 처리 루틴을 가동하는 기능
    def startLoop(self) -> None :
        try:
            self.__connectHub()
        
        except:
            ErrorLogger().writeErrorLog(Function.CONNECT)
            self.startLoop()

    #하드웨어 제어 기능을 호출할 대상 모듈을 설정하는 기능
    def setDest(self, dest) -> None :
        self.dest=dest
        

    #IoT 허브의 웹소켓 세션에 접속하는 기능
    #link : https://ititit1.tistory.com/102
    def __connectHub(self) -> bool :
        teardown=True
        #IoT 허브 웹소켓으로부터 요청을 전송받는 이벤트 처리 기능
        def on_message(ws,message):
            if(':' not in str(message)):
                print("Message : "+ message)
                stx : chr = chr(2)
                etx : chr = chr(3)
                alloc_n_lock=str(message).replace(stx,"").replace(etx,"").split('/')
                if(alloc_n_lock[0]=='1'): alloc_n_lock[0]=True
                else: alloc_n_lock[0]=False
                if(alloc_n_lock[1]=='1'): alloc_n_lock[1]=True
                else: alloc_n_lock[1]=False
                val_alloc=bool(alloc_n_lock[0])
                val_lock=bool(alloc_n_lock[1])
                if(self.dest.setAlloc(val_alloc)==False): sys.exit(2)
                if(self.dest.setLock(val_lock)==False): sys.exit(2)
                
            if(':' in str(message)):
                reqHandler=IotHubRequestHandler(str(message),self.dest)
                try:
                    response=reqHandler.request()
                except:
                    ErrorLogger().writeErrorLog(Function.RESPONSE)
            
            
        def on_error(ws,error):
            print("WebSocket Error :" ,error)
        
        def on_close(ws,close_status_code,close_msg):
            
            print("IoT Hub is DisConnected")
            print("Close Status Code : "+str(close_status_code))
            print("Close Message\n"+str(close_msg))
        
        #첫 접속 시 수행할 기능
        def on_open(ws):
            print("IoT Hub is Connected")
        
        if(self.__webSocket==None):
            print("Try to Connect IoT Hub")
            websocket.enableTrace(True)
            url='ws://'+self.config.getServerAddress()+'/device'
            self.__webSocket=websocket.WebSocketApp(url=url
                                                    ,on_open=on_open
                                                    ,on_message=on_message
                                                    ,on_error=on_error
                                                    ,on_close=on_close
                                                    ,header={ 'dev_id' : str(self.config.getDev_id())})
            teardown=self.__webSocket.run_forever(reconnect=5)
        return teardown

    #IoT 허브로 HTTP Request를 전송하는 기능
    def sendRequest(self,request, function : Function) :
        route : str
        if(function==Function.BATTERY):
            route='/battery'
            
        elif(function==Function.LOCATION):
            route='/location'
            
        else:
            return None
        
        url : str = 'http://'+self.config.getServerAddress()+'/device'+route
        try:
            headers = {'Content-Type': 'application/json; charset=utf-8'}
            response=requests.post(url,data=json.dumps(request),headers=headers,timeout=5)
            return response
        except:
            ErrorLogger().writeErrorLog(Function.REQUEST)
            return None

import smbus
import pigpio
import threading

#기기의 작동을 담당하는 하드웨어 제어 모듈 클래스
class HwController(OperationModule):
    def __init__(self):
        super().__init__()
        self.__battery_bus=None
        self.config : HwConfig = None
        self.__ctrl = pigpio.pi()
        self.__status : HwStatus = None
        
        def run_loop():
            asyncio.run(self.startLoop())
        self.__timer_routine=threading.Timer(30,run_loop)

    #하드웨어 반복 제어 루틴을 가동하는 기능
    async def startLoop(self) -> None:     
        response=await asyncio.gather(self.__measureBattery(),self.__measureLocation())
        if(response[0]==False):
            #ErrorLogger().writeErrorLog(Function.BATTERY)
            pass
        
        if(response[1]==False):
            ErrorLogger().writeErrorLog(Function.LOCATION)
        def run_loop():
            asyncio.run(self.startLoop())
        self.__timer_routine=threading.Timer(30,run_loop)
        self.__timer_routine.start()
        

    #IoT 허브와의 요청 송수신 기능을 호출할 대상 모듈을 설정하는 기능
    def setDest(self, dest) -> None:
        self.dest=dest
        

    #배터리 잔량 정보를 측정하는 기능
    async def __measureBattery(self) -> bool :
        try:
            battery_bytes=self.__battery_bus.read_i2c_block_data(self.config.BATTERY_ADDR,self.config.BATTERY_FUNC,2)
            battery=int.from_bytes(battery_bytes,byteorder='little')
            if(battery>=50):
                self.__ctrl.write(self.config.PIN_RED,False)
                self.__ctrl.write(self.config.PIN_GREEN,True)
                self.__ctrl.write(self.config.PIN_BLUE,False)
                self.__status.battery=True
            elif(battery<25):
                self.__ctrl.write(self.config.PIN_RED,True)
                self.__ctrl.write(self.config.PIN_GREEN,False)
                self.__ctrl.write(self.config.PIN_BLUE,False)
                self.__status.battery=False
            else:
                self.__ctrl.write(self.config.PIN_RED,True)
                self.__ctrl.write(self.config.PIN_GREEN,True)
                self.__ctrl.write(self.config.PIN_BLUE,False)
                self.__status.battery=True
 
        except:
            ErrorLogger().writeErrorLog(Function.BATTERY)
            self.__status.battery=True
            return False
        
        reqHandler=DeviceRequestHandler('DVB/'+str(self.config.getDev_id())
                                        +'/'+str(int(self.__status.battery)),self.dest)
        return reqHandler.request(Function.BATTERY)

    #GPS 위치 정보를 측정하는 기능
    #link : https://fishpoint.tistory.com/5309
    async def __measureLocation(self) -> bool :
        ''' : GPS 통신 불량으로 인한 더미데이터 이용
        import serial
        
        try:
            gpgga_info = "$GPGGA,"
            ser = serial.Serial (self.config.GPS_PORT)
            GPGGA_buffer = 0
            NMEA_buff = 0
            
            received_data=str(ser.readLine())
            GPGGA_data_available=received_data.find(gpgga_info)
            if(GPGGA_data_available>0):
                GPGGA_buffer=received_data.split("$GPGGA,",1)[1]
                NMEA_buff=GPGGA_buffer.split(',')
                NMEA_latitude=NMEA_buff[1]
                NMEA_longitude=NMEA_buff[3]
                
                self.__status.latitude="%.4f"%((int(NMEA_latitude/100.00))
                                               +((NMEA_latitude/100.00-int(NMEA_latitude/100.00))/0.6))
                self.__status.longitude="%.4f"%((int(NMEA_longitude/100.00))
                                               +((NMEA_longitude/100.00-int(NMEA_longitude/100.00))/0.6))
        except:
            ErrorLogger().writeErrorLog(Function.LOCATION)
            return False
        '''
        
        self.__status.latitude=14.1551
        self.__status.longitude=16.1534
        
        reqHandler=DeviceRequestHandler('DVL/'+str(self.config.getDev_id())
                                        +'/'+str(self.__status.latitude)+'/'+str(self.__status.longitude)
                                        ,self.dest)
        return reqHandler.request(Function.LOCATION)
        

    #기기의 주문 할당 여부 변경 후 이에 따라 LED를 제어하는 기능
    def setAlloc(self,alloc : bool,force : bool = False) -> bool :
        if(not force):
            if(self.__status.alloc==alloc):
                return True
        try:
            self.__ctrl.write(self.config.PIN_LED,alloc)
            with open('dat/status/alloc.dat','w') as f:
                if(alloc): f.write('1')
                else: f.write('0')
            if(self.__status!=None):
                self.__status.alloc=alloc
            if(self.soundNotice(Function.ALLOCATION,alloc)==False):
                return True
        except:
            ErrorLogger().writeErrorLog(Function.ALLOCATION)
            return False
        return True
        

    #기기의 잠금장치 활성화 여부 변경 후 이에 따라 서보모터를 제어하는 기능
    def setLock(self,lock : bool,force : bool = False) -> bool :
        if(not force):
            if(self.__status.lock==lock):
                return True
        
        def rotate(value : int):
            min_value=0
            max_value=180
            min_pulse=500
            max_pulse=2500
            frequency=50 #50hz
            
            # duty_rate
            # 0도 = 2.5% -> 25000
            # 90도 = 7.5% -> 75000
            # 180도 = 12.5% -> 125000
            
            # duty_rate * 10000 = duty_value * frequency
            duty_value = (value - min_value) / (max_value - min_value) * (max_pulse - min_pulse) + min_pulse
            self.__ctrl.hardware_PWM(self.config.PIN_SERVOMOTOR, frequency, int(duty_value * frequency))
            
            #서보모터 회전 대기
            import time
            time.sleep(1)

        try:
            val_lock : int
            if(lock): val_lock=1
            else: val_lock=0
            rotate(val_lock * 100)
            if(self.__status!=None):
                self.__status.lock=lock
            with open('dat/status/lock.dat','w') as f:
                if(lock): f.write('1')
                else: f.write('0')
            if(self.soundNotice(Function.LOCK,lock)==False):
                return True
        except:
            ErrorLogger().writeErrorLog(Function.LOCK)
            return False
        return True
        

    #IoT 허브로부터 발생한 요청에 의한 하드웨어 제어를 음성으로 안내하는 기능
    def soundNotice(self,function : Function, value : bool) -> bool :
        #link : https://www.programcreek.com/python/example/93337/pigpio.pulse
        try: 
            from dataclasses import dataclass
            @dataclass
            class AudioBlock:
                delay : int
                length : float
                
            def play(audio : list[AudioBlock]):
                for block in audio:
                    self.__ctrl.wave_clear()
                    tone=[pigpio.pulse(1<<self.config.PIN_SPEAKER,0,block.delay)
                                    ,pigpio.pulse(0,1<<self.config.PIN_SPEAKER,block.delay)]
                    self.__ctrl.wave_add_generic(tone)
                    wid=self.__ctrl.wave_create()
                    
                    def sound(wid):
                        import time
                        if(wid>=0):
                                self.__ctrl.wave_send_repeat(wid)
                                time.sleep(block.length)
                                self.__ctrl.wave_tx_stop()
                                self.__ctrl.wave_delete(wid)
                    sound(wid=wid)

            audio : list[AudioBlock] = []    

            def makeAudio(function : Function,value : bool):
                
                if(function==Function.ALLOCATION):
                    if(value):
                        block=AudioBlock(delay=1000,length=0.3)
                        audio.append(block)
                        block=AudioBlock(delay=2000,length=0.35)
                        audio.append(block)
                        block=AudioBlock(delay=3000,length=0.4)
                        audio.append(block)
                    
                    else:
                        block=AudioBlock(delay=3000,length=0.3)
                        audio.append(block)
                        block=AudioBlock(delay=2000,length=0.35)
                        audio.append(block)
                        block=AudioBlock(delay=1000,length=0.4)
                        audio.append(block)
                        
                    
                elif(function==Function.LOCK):
                    if(value):
                        block=AudioBlock(delay=3000,length=0.5)
                        audio.append(block)
                        block=AudioBlock(delay=500,length=0.5)
                        audio.append(block)
                    
                    else:
                        block=AudioBlock(delay=500,length=0.5)
                        audio.append(block)
                        block=AudioBlock(delay=3000,length=0.5)
                        audio.append(block)
                        
            
            makeAudio(function=function,value=value)
            play(audio)
            
            
        except Exception as e:
            ErrorLogger().writeErrorLog(Function.SOUND)
            return False
        return True
    
    #IoT 허브로부터 가져온 기기 상태 데이터를 적용하고 그에 따라 하드웨어를 제어하는 기능
    async def initStatus(self) -> bool :
        self.__battery_bus=smbus.SMBus(self.config.BATTERY_BUS)
        self.__ctrl.set_mode(self.config.PIN_LED,pigpio.OUTPUT)
        self.__ctrl.set_mode(self.config.PIN_SERVOMOTOR,pigpio.OUTPUT)
        self.__ctrl.set_mode(self.config.PIN_SPEAKER,pigpio.OUTPUT)
        self.__ctrl.set_mode(self.config.PIN_RED,pigpio.OUTPUT)
        self.__ctrl.set_mode(self.config.PIN_GREEN,pigpio.OUTPUT)
        self.__ctrl.set_mode(self.config.PIN_BLUE,pigpio.OUTPUT)
        self.__status : HwStatus =HwStatus()
        self.setAlloc(self.__status.alloc,force=True)
        self.setLock(self.__status.lock,force=True)
        return True
        
            
        
        


#하드웨어로 측정하거나 IoT 허브의 요청에 의해 변화가 발생하는 기기 상태에 대한 클래스
class HwStatus:
    def __init__(self):
        self.battery : bool =True
        self.latitude : float = 0
        self.longitude : float = 0
        with open('dat/status/alloc.dat','r') as f:
            self.alloc : bool = bool(int(f.readline()))
        with open('dat/status/lock.dat','r') as f:
            self.lock : bool = bool(int(f.readline()))