# foodbox_backend

개발 환경
	    ● DBMS : MariaDB
	    ● Environment : Amazon AWS EC2
	    ● OS : Linux
	    ● Language : Java
	    ● Framework : Spring Boot
	    ● Communication Protocol : HTTP, WebSocket TCP

```
foodbox_app_server
├─ .vscode
│  └─ settings.json
├─ FoodboxAppServer
│  ├─ .mvn
│  │  └─ wrapper
│  │     ├─ maven-wrapper.jar
│  │     └─ maven-wrapper.properties
│  ├─ mvnw
│  ├─ mvnw.cmd
│  ├─ pom.xml
│  └─ src
│     ├─ main
│     │  ├─ java
│     │  │  └─ com
│     │  │     └─ foodbox
│     │  │        └─ server
│     │  │           ├─ FoodboxAppServerApplication.java
│     │  │           ├─ IoTRequestSender.java
│     │  │           ├─ controller
│     │  │           │  ├─ ConsumerController.java
│     │  │           │  └─ StoreController.java
│     │  │           ├─ data
│     │  │           │  ├─ ConsumerDTO.java
│     │  │           │  ├─ FcmMessage.java
│     │  │           │  ├─ LoginRequest.java
│     │  │           │  ├─ OrdersDTO.java
│     │  │           │  └─ StoreDTO.java
│     │  │           ├─ exception
│     │  │           │  ├─ CustomException.java
│     │  │           │  ├─ ExceptionMessage.java
│     │  │           │  └─ GlobalExceptionHandler.java
│     │  │           ├─ interceptor
│     │  │           │  ├─ ConsumerInterceptor.java
│     │  │           │  ├─ RedisRepositoryConfig.java
│     │  │           │  ├─ StoreInterceptor.java
│     │  │           │  └─ WebConfig.java
│     │  │           ├─ mapper
│     │  │           │  ├─ ConsumerMapper.java
│     │  │           │  └─ StoreMapper.java
│     │  │           ├─ service
│     │  │           │  ├─ ConsumerService.java
│     │  │           │  ├─ FirebaseCloudMessageService.java
│     │  │           │  ├─ IoTService.java
│     │  │           │  └─ StoreService.java
│     │  │           ├─ utils
│     │  │           │  ├─ SHA256Util.java
│     │  │           │  └─ TokenUtil.java
│     │  │           └─ websocket
│     │  │              ├─ ConsumerAppWebSocketConfig.java
│     │  │              ├─ ConsumerAppWebSocketHandler.java
│     │  │              ├─ StoreAppWebSocketConfig.java
│     │  │              └─ StoreAppWebSocketHandler.java
│     │  └─ resources
│     │     ├─ META-INF
│     │     │  └─ additional-spring-configuration-metadata.json
│     │     ├─ application.properties
│     │     ├─ firebase
│     │     │  └─ foodboxmanager-firebase-adminsdk-36618-20b22f562b.json
│     │     └─ mappers
│     │        ├─ ConsumerMapper.xml
│     │        ├─ StoreMapper.xml
│     │        └─ mybatis-3-mapper.dtd
│     └─ test
│        └─ java
│           └─ com
│              └─ example
│                 └─ demo
│                    └─ FoodboxAppServerApplicationTests.java
├─ LICENSE
├─ README.md
└─ foodbox.sql

```