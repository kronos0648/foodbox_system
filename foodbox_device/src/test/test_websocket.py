
import websocket
import socket


HOST='127.0.0.1'
PORT=1111

client_socket=socket.socket(socket.AF_INET,socket.SOCK_STREAM)

client_socket.connect((HOST,PORT))

def getNow():
    from datetime import datetime
    now=datetime.now()
    strDate=now.strftime('%Y-%m-%d %H:%M:%S')
    return "["+strDate+"]" 

def on_message(ws, message):
    msg=getNow()+" Iot Hub : " + message
    client_socket.sendall(msg.encode())
    
    

def on_error(ws, error):
    msg=getNow()+" "+str(error)
    #client_socket.sendall(msg.encode())
    
def on_close(ws, close_status_code, close_msg):
    msg=getNow()+" Closed... Status Code : ["+str(close_status_code)+"]"
    #client_socket.sendall(msg.encode())

def on_open(ws):
    print("Open dev_id = 11111")
    msg=getNow()+"IoT Hub WebSocket Connected!!"
    #client_socket.sendall(msg.encode())
    
def connect():
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("ws://43.201.199.252:8081/device",
                              on_open=on_open,
                              on_message=on_message,
                              on_error=on_error,
                              on_close=on_close
                              ,header={ 'dev_id' : "11111"})

    ws.run_forever(reconnect=60) 


if __name__ == "__main__":
    try:
        connect()
    except KeyboardInterrupt:
        client_socket.close()
        import sys
        sys.exit(0)
    
    
