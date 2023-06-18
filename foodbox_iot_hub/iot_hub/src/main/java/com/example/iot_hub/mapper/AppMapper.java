package com.example.iot_hub.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.iot_hub.data.Device;

@Mapper
public interface AppMapper {
	int updateAlloc(Device device); // 기기 주문 할당 및 해제 요청
	int updateLock(Device device); // 기기 쟘금 및 해제 요청
}
