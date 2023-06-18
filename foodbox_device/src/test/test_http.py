import requests
import json
import asyncio

addr="43.201.199.252:8081"


route_top='/device'

route_battery="/battery"
route_location="/location"


url="http://"+addr+route_top+route_battery

body={
        'dev_id' : 111111,
        'battery' : '1'
     }


headers = {'Content-Type': 'application/json; charset=utf-8'}
response=requests.post(url=url,data=json.dumps(body),headers=headers)
print(response.status_code)