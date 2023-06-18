#시스템에 구성하는 중심 모듈 2개인 Client와 HwController 객체를 생성하며 프로세스를 실행하는 클래스

from implement_module import Client,HwController,HwStatus
from config import ClientConfig,HwConfig
from sub import ErrorLogger,Function
import threading
import asyncio


class Executor:
    def __init__(self) -> None :
        self.client=Client()
        self.hwController=HwController()
        self.client.config=ClientConfig()
        self.hwController.config=HwConfig()


    #각 모듈의 작동을 위한 설정을 하는 기능
    async def execSetUp(self) -> bool :
        self.client.setDest(self.hwController)
        self.hwController.setDest(self.client)
        isInit=await self.hwController.initStatus()
        return isInit

    #각 모듈이 반복해 처리할 루틴를 실행하는 기능
    def execLoop(self) -> None :
        asyncio.run(self.hwController.startLoop())
        self.client.startLoop()