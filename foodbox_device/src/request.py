#파일명 : request.py
#경로 : foodbox_device/.
#용도 : IoT 허브와의 요청 송수신 포맷 수립
#내용 : IotHubRequestHandler, DeviceRequestHandler 클래스 구현


from abs.abstract_request import RequestHandler
#from implement_module import HwController, Client
from sub import Function

#IoT 허브로부터 발생한 요청을 다루며 처리하는 요청 매개체 클래스
class IotHubRequestHandler(RequestHandler):
    def __init__(self, reqString, dest) -> None :
        super().__init__(dest)
        stx=chr(2)
        etx=chr(3)
        self.value=reqString.replace(stx,'').replace(etx,'')
        self.value : bool = True if(self.handleRequestMessage() == '1') else False
        
    #IoT 허브로부터 전송받은 주문 할당 여부 변경 요청을 처리하는 기능
    def __updateAlloc(self) -> bool :
        return self.dest.setAlloc(self.value)


    #IoT 허브로부터 전송받은 잠금장치 활성화 여부 변경 요청을 처리하는 기능
    def __updateLock(self) -> bool :
        return self.dest.setLock(self.value)

    #IoT 허브로부터 발생한 요청을 기기가 처리하도록 하는 기능
    def request(self) -> str :
        result : bool = False
        if(self.function==Function.ALLOCATION):
            result=self.__updateAlloc()

        elif(self.function==Function.LOCK):
            result=self.__updateLock()

        else: result=False
        self.value=result
        return self.handleResponseMessage()

    #IoT 허브로부터 전송받은 요청 프로토콜에서 필요한 데이터를 가져오는 기능
    def handleRequestMessage(self) -> str :
        func_n_value=self.value.split(':')
        from sub import Function
        if(func_n_value[0] == 'ALO'):
            self.function=Function.ALLOCATION
        elif(func_n_value[0] == 'LCK'):
            self.function=Function.LOCK
        return func_n_value[1]


    #IoT 허브로 전송할 응답 데이터를 프로토콜에 맞게 변형해 가져오는 기능
    def handleResponseMessage(self) -> str :
        stx : chr = chr(2)
        etx : chr = chr(3)
        ack : chr = chr(6)
        nak : chr = chr(21)
        response : str = ''+stx
        if(self.value): response = response + ack
        else: response = response + nak
        response=response+etx
        return response


#기기로부터 발생한 요청을 다루며 처리하는 요청 매개체 클래스
class DeviceRequestHandler(RequestHandler):
    def __init__(self, value : str, dest) -> None :
        super().__init__(dest)
        self.value=value
        

    #기기의 배터리 잔량 정보를 IoT 허브에 갱신 처리하는 기능
    def __sendBattery(self) -> bool :
        self.value = self.dest.sendRequest(self.value,Function.BATTERY)
        return self.handleResponseMessage()

        

    #기기의 GPS 위치 정보를 IoT 허브에 갱신 처리하는 기능
    def __sendLocation(self) -> bool :
        self.value = self.dest.sendRequest(self.value,Function.LOCATION)
        return self.handleResponseMessage()
    

    #기기로부터 발생한 요청을 IoT 허브가 처리하도록 하는 기능
    def request(self, function : Function) -> bool :
        self.function=function
        result : bool
        self.value=self.handleRequestMessage()
        if(self.function==Function.BATTERY):
            result=self.__sendBattery()

        elif(self.function==Function.LOCATION):
            result=self.__sendLocation()
        return result

    #IoT 허브로 전송할 요청 데이터를 프로토콜에 맞게 변형해 가져오는 기능
    def handleRequestMessage(self) -> dict :
        ls_value=self.value.split('/')
        if(self.function==Function.BATTERY):
            dict_value={
                'dev_id' : int(ls_value[1]),
                'battery' : int(ls_value[2])
            }

        if(self.function==Function.LOCATION):
            dict_value={
                'dev_id' : int(ls_value[1]),
                'latitude' : float(ls_value[2]),
                'longitude' : float(ls_value[3])
            }

        
        return dict_value

    #IoT 허브로부터 전송받은 응답 프로토콜에서 필요한 데이터를 가져오는 기능
    def handleResponseMessage(self) -> bool :
        if(self.value==None):
            return False
        if(self.value.status_code==201):
            return True
        else: return False