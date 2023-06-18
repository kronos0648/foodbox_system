#파일명 : sub.py
#경로 : foodbox_device/.
#용도 : 시스템에 부수적으로 필요한 구현
#내용 : ErrorLogger 클래스, Function 열거형 구현



#기기 시스템에서 발생한 오류에 대해 기록하는 클래스
class ErrorLogger:
    def __init__(self) -> None :
        self.__path : str ='log/error_log.txt'
        self.__log_file = None

    #시스템 작동 중 발생한 오류에 대해 로컬 파일로 로그를 기록하는 기능
    def writeErrorLog(self,function) -> bool :
        dateString=self.__getDateTime()
        funcString=None
        if(function == Function.BATTERY):
            funcString='Battery'

        elif(function == Function.LOCATION):
            funcString='Location'

        elif(function == Function.ALLOCATION):
            funcString='Allocation'
            
        elif(function == Function.LOCK):
            funcString='Lock'

        elif(function == Function.SOUND):
            funcString='Sound'

        elif(function == Function.CONNECT):
            funcString='Connect'

        elif(function == Function.READ):
            funcString='Read'

        elif(function == Function.WRITE):
            funcString='Write'

        elif(function == Function.REQUEST):
            funcString='Request'
        
        elif(function == Function.RESPONSE):
            funcString='Response'
        
        elif(function == Function.NONE):
            funcString='Not Ordinary Name'

        else:
            funcString=None

        log_string=funcString+' Error Occured...['+dateString+']\n'
        with open(self.__path,"+a") as log:
            log.write(log_string)
        


        

    #현재 날짜 및 시간을 가져오는 기능
    def __getDateTime(self) -> str :
        from datetime import datetime
        now=datetime.now()
        strDate=now.strftime('%Y-%m-%d %H:%M:%S')
        return strDate



#기기 시스템이 가지는 단위 기능의 속성에 대해 정의한 열거형
from enum import Enum
class Function(Enum):
    BATTERY=0
    LOCATION=1
    ALLOCATION=2
    LOCK=3
    SOUND=4
    CONNECT=5
    READ=6
    WRITE=7
    REQUEST=8
    RESPONSE=9
    NONE=10