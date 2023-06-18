package com.example.iot_hub.controller;

import com.example.iot_hub.data.Device;
import com.example.iot_hub.service.*;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/device")
public class DeviceController {
    private final DeviceService deviceService;

    // 배터리 잔량 정보 전송
    @PostMapping("/battery")
    public ResponseEntity<Device> postBattery(@RequestBody HashMap<String, Object> map) {
        Device device = new Device();
        device.setDev_id(Integer.parseInt(map.get("dev_id").toString()));
        device.setBattery(map.get("dev_id").toString().charAt(0));
        try {
            deviceService.postBattery(device);
            return new ResponseEntity<Device>(HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<Device>(HttpStatus.BAD_REQUEST);
        }
    }

    // 기기 위치 정보 전송
    @PostMapping("/location")
    public ResponseEntity<Device> postLocation(@RequestBody HashMap<String, Object> map) {
        Device device = new Device();
        device.setDev_id(Integer.parseInt(map.get("dev_id").toString()));
        device.setLatitude(Double.parseDouble(map.get("latitude").toString()));
        device.setLongitude(Double.parseDouble(map.get("longitude").toString()));
        try {
            deviceService.postLocation(device);
            return new ResponseEntity<Device>(HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<Device>(HttpStatus.BAD_REQUEST);
        }
    }

}
