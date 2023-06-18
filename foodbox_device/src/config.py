#파일명 : config.py
#경로 : foodbox_device/.
#용도 : 시스템 구성에 필요한 데이터 수집
#내용 : Config, ClientConfig, HwConfig 클래스 구현 


import sys


#각 모듈의 설정을 위한 공통의 데이터를 불러오거나 포함하는 클래스
class Config:
    def __init__(self) -> None :
        self.__dev_id : int = 0
        self.__path_dev_id : str ="dat/dev_id.dat"
        if(self.__loadDev_id()==False):
            sys.exit()
        

    #로컬 파일을 읽어 기기 식별번호를 불러오는 기능
    def __loadDev_id(self) -> bool :
        isSuccess=False
        try:
            with open(self.__path_dev_id,'r') as f:
                self.__dev_id=int(f.read())
                isSuccess=True
        except:
            from sub import ErrorLogger, Function
            isLogged=ErrorLogger().writeErrorLog(Function.READ)
            if(isLogged):
                isSuccess=False

        return isSuccess

    #기기 식별번호를 가져오는 기능
    def getDev_id(self) -> int :
        return self.__dev_id


#클라이언트 모듈의 설정을 위한 데이터를 불러오는 클래스
class ClientConfig(Config):
    def __init__(self) -> None :
        super().__init__()
        self.__server_ip : str = None
        self.__server_port : int = 0
        
        self.__path_server : str = 'dat/hub_addr.dat'
        strServer=self.__loadServerAddress()
        if(strServer==None):
            sys.exit()


    #로컬 파일을 읽어 서버의 주소를 불러오는 기능
    def __loadServerAddress(self) -> bool :
        strServer=None
        try:
            with open(self.__path_server,'r') as f:
                strServer=f.readline()

        except:
            from sub import ErrorLogger, Function
            isLogged=ErrorLogger().writeErrorLog(Function.READ)
            if(isLogged):
                return False

        lsServer=strServer.split(':')
        self.__server_ip : str = lsServer[0]
        self.__server_port : int = int(lsServer[1])
        return True

    #서버의 주소를 가져오는 기능
    def getServerAddress(self)-> str :
        return self.__server_ip+':'+str(self.__server_port)


#하드웨어 제어 모듈의 설정을 위한 데이터를 포함하는 클래스
class HwConfig(Config):
    def __init__(self) -> None :
        super().__init__()
        path='dat/hwconfig/'
        
        #배터리 I2C 버스
        with open(path+"battery_bus.dat",'r') as f:
            self.BATTERY_BUS=int(f.readline())
            
        #배터리 I2C 주소
        with open(path+"battery_addr.dat",'r') as f:
            self.BATTERY_ADDR=int(f.readline(),16)
        
        #배터리 I2C 기능 주소
        with open(path+"battery_func.dat",'r') as f:
            self.BATTERY_FUNC=int(f.readline(),16)
            
        #GPS 시리얼 포트
        with open(path+"gps_port.dat",'r') as f:
            self.GPS_PORT=f.readline()
            
        #주문 할당 여부 표기 LED
        with open(path+"pin_led.dat",'r') as f:
            self.PIN_LED=int(f.readline())

        #도어락 제어 서보모터
        with open(path+"pin_servomotor.dat",'r') as f:
            self.PIN_SERVOMOTOR=int(f.readline())
            
        #안내음 출력 스피커
        with open(path+"pin_speaker.dat",'r') as f:
            self.PIN_SPEAKER=int(f.readline())

        #배터리 잔량 표기 RGB LED 중 RED
        with open(path+"pin_red.dat",'r') as f:
            self.PIN_RED=int(f.readline())

        #배터리 잔량 표기 RGB LED 중 GREEN
        with open(path+"pin_green.dat",'r') as f:
            self.PIN_GREEN=int(f.readline())
            
        #배터리 잔량 표기 RGB LED 중 BLUE
        with open(path+"pin_blue.dat",'r') as f:
            self.PIN_BLUE=int(f.readline())