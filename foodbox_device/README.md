# foodbox_device

개발 환경
	    ● Board : Raspberry Pi 4 Model B
	    ● OS : Raspberry Pi OS(Debian Linux)
	    ● Language : Python, Bash Shell Script
	    ● Network Configuration : LTE Cat M1

	    ● Design Tool
		- Visual Paradigm : 회로도, 평면도 설계에 이용, S/W 설계에 쓰이는 각종 모델링에 이용
    
    	● Implementation Tool
		- Putty : 기능 동작 환경 ssh 접속에 이용
		- VNC Viewer : 기능 동작 환경 vnc 접속에 이용
		- Visual Studio Code : 소스 코드 작성 및 Git 관리에 이용
```
foodbox_device
├─ .vscode
│  └─ settings.json
├─ dat
│  ├─ dev_id.dat
│  ├─ hub_addr.dat
│  ├─ hwconfig
│  │  ├─ battery_addr.dat
│  │  ├─ battery_bus.dat
│  │  ├─ battery_func.dat
│  │  ├─ gps_port.dat
│  │  ├─ pin_blue.dat
│  │  ├─ pin_green.dat
│  │  ├─ pin_led.dat
│  │  ├─ pin_red.dat
│  │  ├─ pin_servomotor.dat
│  │  └─ pin_speaker.dat
│  └─ status
│     ├─ alloc.dat
│     └─ lock.dat
├─ foodbox_batterycheck.sh
├─ foodbox_commcheck.sh
├─ foodbox_register.sh
├─ foodbox_remove.sh
├─ foodbox_service
├─ LICENSE
├─ log
│  └─ error_log.txt
├─ README.md
├─ service_script_log.txt
└─ src
   ├─ abs
   │  ├─ abstract_module.py
   │  └─ abstract_request.py
   ├─ config.py
   ├─ executor.py
   ├─ implement_module.py
   ├─ main.py
   ├─ request.py
   ├─ sub.py
   └─ test
      ├─ discord_debug.py
      ├─ gps_log.txt
      ├─ test_battery.py
      ├─ test_battery_remain.txt
      ├─ test_doorlock.py
      ├─ test_gpio.py
      ├─ test_gps.py
      ├─ test_http.py
      ├─ test_ups_plus.py
      └─ test_websocket.py

```