package com.example.iot_hub.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.iot_hub.data.Device;

@Mapper
public interface DeviceMapper {
	Device deviceForInit(int dev_id); // 허브 연결
	void updateBattery(Device device); // 배터리 잔량 정보 전송
	void updateLocation(Device device); // 기기 위치 정보 전송
}
