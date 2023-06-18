package com.example.iot_hub.controller;

import com.example.iot_hub.data.Device;
import com.example.iot_hub.service.*;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/iot")
@RequiredArgsConstructor
public class AppController {
    private final AppService appService;

//    // 기기 위치 정보 요청
//    @ResponseBody
//    @GetMapping("/location")
//    public ResponseEntity<Device> getLocation(@RequestBody HashMap<String, Object> map) {
//        try {
//
//            Device responseBody = appService.getLocation(Integer.parseInt(map.get("dev_id").toString()));
//            return new ResponseEntity<Device>(HttpStatus.CREATED);
//				} catch (Exception e) {
//  		  return new ResponseEntity<Device>(HttpStatus.BAD_REQUEST);
//		}
//    }
    
    // 기기 주문 할당 요청
    @PostMapping("/allocation")
    public ResponseEntity<HttpStatus> postAllocation(@RequestBody HashMap<String, Integer> map) {
        try {
            appService.postAllocation(map.get("dev_id"));
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // 기기 할당 해제 요청
    @PostMapping("/dismission")
    public ResponseEntity<Device> postDismission(@RequestBody HashMap<String, Integer> map) {
        try {
            appService.postDismission(map.get("dev_id"));
            return new ResponseEntity<Device>(HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<Device>(HttpStatus.BAD_REQUEST);
        }
    }

    // 기기 잠금 요청
    @PostMapping("/lock")
    public ResponseEntity<Device> postLock(@RequestBody HashMap<String, Integer> map) {
        try {
            appService.postLock(map.get("dev_id"));
            return new ResponseEntity<Device>(HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<Device>(HttpStatus.BAD_REQUEST);
        }
    }

    // 기기 잠금 해제 요청
    @PostMapping("/unlock")
    public ResponseEntity<Device> postUnlock(@RequestBody HashMap<String, Integer> map) {
        try {
            appService.postUnlock(map.get("dev_id"));
            return new ResponseEntity<Device>(HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<Device>(HttpStatus.BAD_REQUEST);
        }
    }

}
