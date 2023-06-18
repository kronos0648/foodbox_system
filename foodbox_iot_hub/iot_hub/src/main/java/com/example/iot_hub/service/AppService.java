package com.example.iot_hub.service;

import com.example.iot_hub.data.Device;
import com.example.iot_hub.mapper.AppMapper;
import com.example.iot_hub.mapper.DeviceMapper;
import com.example.iot_hub.websocket.*;

import org.springframework.stereotype.Service;

@Service
public class AppService {
	private final AppMapper appMapper;
    private final DeviceWebSocketHandler handler;

    public AppService(AppMapper appMapper, DeviceMapper deviceMapper) {
        this.appMapper = appMapper;
        handler = new DeviceWebSocketHandler(deviceMapper);
        new DeviceWebSocketConfiguration(handler);
    }

//    // 기기 위치 정보 요청
//    public Device getLocation(int dev_id) throws Exception {
//        Device device = appDAO.queryLocation(dev_id);
//        return device;
//    }

    // 기기 주문 할당 요청
    public void postAllocation(int dev_id) throws Exception {
        if (!handler.requestAlloc(dev_id, true))
            throw new Exception();
        Device device = new Device();
        device.setDev_id(dev_id);
        device.setAlloc('1');
        appMapper.updateAlloc(device);
    }

    // 기기 할당 해제 요청
    public void postDismission(int dev_id) throws Exception {
        if (!handler.requestAlloc(dev_id, false))
            throw new Exception();
        Device device = new Device();
        device.setDev_id(dev_id);
        device.setAlloc('0');
        appMapper.updateAlloc(device);
    }
    

    // 기기 잠금 요청
    public void postLock(int dev_id) throws Exception {
        if (!handler.requestLock(dev_id, true))
            throw new Exception();
        Device device = new Device();
        device.setDev_id(dev_id);
        device.setLock('1');
        appMapper.updateLock(device);
    }

    // 기기 잠금 해제 요청
    public void postUnlock(int dev_id) throws Exception {
        if (!handler.requestLock(dev_id, false))
            throw new Exception();
        Device device = new Device();
        device.setDev_id(dev_id);
        device.setLock('0');
        appMapper.updateLock(device);
    }

}
