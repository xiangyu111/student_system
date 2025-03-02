package com.example.learninganalysis.controller;

import com.example.learninganalysis.dto.ActivityRequest;
import com.example.learninganalysis.dto.ActivityResponse;
import com.example.learninganalysis.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ActivityController {
    
    @Autowired
    private ActivityService activityService;
    
    @PostMapping("/activity/add")
    public ResponseEntity<Map<String, Object>> addActivity(@RequestBody ActivityRequest request) {
        Long activityId = activityService.addActivity(request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "活动添加成功");
        response.put("activityId", activityId);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/activity/list")
    public ResponseEntity<Map<String, Object>> getActivities(@RequestParam String token) {
        List<ActivityResponse> activities = activityService.getActivities(token);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "获取活动列表成功");
        response.put("activities", activities);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/teacher/student/{studentId}/activities")
    public ResponseEntity<Map<String, Object>> getStudentActivities(
            @PathVariable Long studentId, 
            @RequestParam String token) {
        List<ActivityResponse> activities = activityService.getStudentActivities(studentId, token);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "获取学生活动列表成功");
        response.put("activities", activities);
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/activity/{activityId}/update")
    public ResponseEntity<Map<String, Object>> updateActivity(
            @PathVariable Long activityId, 
            @RequestBody ActivityRequest request) {
        activityService.updateActivity(activityId, request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "活动更新成功");
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/activity/{activityId}/delete")
    public ResponseEntity<Map<String, Object>> deleteActivity(
            @PathVariable Long activityId, 
            @RequestParam String token) {
        activityService.deleteActivity(activityId, token);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "活动删除成功");
        
        return ResponseEntity.ok(response);
    }
} 