# foodbox_iot_hub

food box system's iot hub

```
foodbox_iot_hub
├─ .vscode
│  └─ settings.json
├─ LICENSE
├─ README.md
└─ iot_hub
   ├─ .mvn
   │  └─ wrapper
   │     ├─ maven-wrapper.jar
   │     └─ maven-wrapper.properties
   ├─ .vscode
   │  ├─ launch.json
   │  └─ settings.json
   ├─ HELP.md
   ├─ mvnw
   ├─ mvnw.cmd
   ├─ pom.xml
   ├─ src
   │  ├─ main
   │  │  ├─ java
   │  │  │  └─ com
   │  │  │     └─ example
   │  │  │        └─ iot_hub
   │  │  │           ├─ IotHubApplication.java
   │  │  │           ├─ controller
   │  │  │           │  ├─ AppController.java
   │  │  │           │  └─ DeviceController.java
   │  │  │           ├─ data
   │  │  │           │  └─ Device.java
   │  │  │           ├─ mapper
   │  │  │           │  ├─ AppMapper.java
   │  │  │           │  └─ DeviceMapper.java
   │  │  │           ├─ service
   │  │  │           │  ├─ AppService.java
   │  │  │           │  └─ DeviceService.java
   │  │  │           └─ websocket
   │  │  │              ├─ DeviceWebSocketConfiguration.java
   │  │  │              └─ DeviceWebSocketHandler.java
   │  │  └─ resources
   │  │     ├─ application.properties
   │  │     ├─ mappers
   │  │     │  ├─ AppMapper.xml
   │  │     │  ├─ DeviceMapper.xml
   │  │     │  └─ mybatis-3-mapper.dtd
   │  │     ├─ static
   │  │     └─ templates
   │  └─ test
   │     └─ java
   │        └─ com
   │           └─ example
   │              ├─ demo
   │              │  └─ IotHubApplicationTests.java
   │              └─ iot_hub
   │                 └─ IotHubApplicationTests.java
   └─ target
      ├─ classes
      │  └─ com
      │     └─ example
      │        └─ iot_hub
      │           ├─ IotHubApplication.class
      │           ├─ controller
      │           │  ├─ AppController.class
      │           │  └─ DeviceController.class
      │           ├─ data
      │           │  └─ Device.class
      │           ├─ mapper
      │           │  ├─ AppMapper.class
      │           │  └─ DeviceMapper.class
      │           ├─ service
      │           │  ├─ AppService.class
      │           │  └─ DeviceService.class
      │           └─ websocket
      │              ├─ DeviceWebSocketConfiguration.class
      │              └─ DeviceWebSocketHandler.class
      ├─ generated-sources
      │  └─ annotations
      ├─ generated-test-sources
      │  └─ test-annotations
      └─ test-classes
         └─ com
            └─ example
               ├─ demo
               │  └─ IotHubApplicationTests.class
               └─ iot_hub
                  └─ IotHubApplicationTests.class

```