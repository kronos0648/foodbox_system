#!/usr/bin/python3

#파일명 : main.py
#경로 : foodbox_device/.
#용도 : 시스템을 구동하기 위한 실행 파일
#내용 : Exectutor 객체를 통한 기기 모듈의 SetUp 및 Loop 실행

from executor import Executor
import sys
import asyncio

def execute(executor):
    loop=asyncio.get_event_loop()
    task_setup=loop.create_task(executor.execSetUp())
    loop.run_until_complete(task_setup)
    task_setup.add_done_callback(loop.create_task(executeCallBack(loop=loop,executor=executor,pre_task=task_setup)))
    
    
def executeCallBack(loop,executor,pre_task):
    print("Setup Okay\nSetUp Status : "+str(bool(pre_task.result)))
    isSetUp=pre_task.result
    if(isSetUp==False): sys.exit(1)
    loop.close()
    executor.execLoop()
    

if __name__ == '__main__':
    executor=Executor()
    execute(executor=executor)
    
    