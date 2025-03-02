package com.example.learninganalysis.controller;

import com.example.learninganalysis.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProgressController {
    
    @Autowired
    private ProgressService progressService;
    
    @GetMapping("/progress/get")
    public ResponseEntity<Map<String, Object>> getProgress(@RequestParam String token) {
        Map<String, Object> progressData = progressService.getProgress(token);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "获取学习进度成功");
        response.put("data", progressData);
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/progress/update")
    public ResponseEntity<Map<String, Object>> updateProgress(@RequestBody Map<String, Object> request) {
        String token = (String) request.get("token");
        Long activityId = Long.valueOf(request.get("activityId").toString());
        Integer progress = (Integer) request.get("progress");
        
        progressService.updateProgress(token, activityId, progress);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "更新学习进度成功");
        
        return ResponseEntity.ok(response);
    }
} 