#파일명 : request.py
#경로 : foodbox_device/abs/.
#용도 : 요청 송수신 포맷의 공통 요소 정의
#내용 : RequestHandler 클래스 구현

from abc import *
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from implement_module import OperationModule


#기기와 IoT 허브끼리의 송수신 요청 매개체의 추상 클래스
class RequestHandler(metaclass=ABCMeta):

    def __init__(self,dest : OperationModule):
        from sub import Function
        self.function : Function = None
        self.value=None
        self.dest : OperationModule = dest

    #IoT 허브와의 요청 송수신 메시지를 목적에 맞게 변형해 가져오는 기능
    @abstractmethod
    def handleRequestMessage(self) -> str :
        pass

    #IoT 허브와의 응답 송수신 메시지를 목적에 맞게 변형해 가져오는 기능
    @abstractmethod
    def handleResponseMessage(self) -> str :
        pass

    #하나의 시스템의 요청을 상대 시스템 측이 처리하도록 하는 기능
    @abstractmethod
    def request(self) :
        pass

    