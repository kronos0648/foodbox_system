#파일명 : module.py
#경로 : foodbox_device/abs/.
#용도 : 시스템 구성 모듈의 공통 요소 정의
#내용 : OperationModule 클래스 구현

from abc import *
import sys
import os
#sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
#from abs.module import OperationModule

#각 모듈의 공통 기능 및 속성을 포함하는 추상 클래스
class OperationModule(metaclass=ABCMeta):

    def __init__(self) -> None :
        from config import Config
        self.config : Config = None
        self.dest=None


    #기능을 호출할 대상 모듈을 설정하는 기능
    @abstractmethod
    def setDest(self,dest) -> None :
        return;

    #본 모듈이 처리할 루틴을 시작하는 기능
    @abstractmethod
    def startLoop(self) -> None :
        return;
