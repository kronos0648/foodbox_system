package com.example.iot_hub.service;

import com.example.iot_hub.data.Device;
import com.example.iot_hub.mapper.DeviceMapper;

import org.springframework.stereotype.Service;

@Service
public class DeviceService {

    private final DeviceMapper deviceMapper;

    public DeviceService(DeviceMapper deviceMapper) {
        this.deviceMapper = deviceMapper;
    }

    // 배터리 잔량 정보 전송
    public void postBattery(Device device) throws Exception {
    	deviceMapper.updateBattery(device);
    }

    // 기기 위치 정보 전송
    public void postLocation(Device device) throws Exception {
    	deviceMapper.updateLocation(device);
    }

}
