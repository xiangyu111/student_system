package com.example.learninganalysis.controller;

import com.example.learninganalysis.entity.Resource;
import com.example.learninganalysis.service.RecommendationService;
import com.example.learninganalysis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendation")
public class RecommendationController {
    
    @Autowired
    private RecommendationService recommendationService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/get")
    public ResponseEntity<Map<String, Object>> getRecommendations(@RequestParam String token) {
        Map<String, Object> response = new HashMap<>();
        
        Long userId = userService.getUserIdFromToken(token);
        if (userId == null) {
            response.put("status", 401);
            response.put("message", "无效的token");
            return ResponseEntity.ok(response);
        }
        
        List<Resource> recommendations = recommendationService.getRecommendationsForStudent(userId);
        
        response.put("status", 200);
        response.put("recommendations", recommendations);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/feedback")
    public ResponseEntity<Map<String, Object>> submitFeedback(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        String token = (String) request.get("token");
        Long resourceId = Long.valueOf(request.get("resourceId").toString());
        String feedback = (String) request.get("feedback");
        Integer rating = Integer.valueOf(request.get("rating").toString());
        
        if (token == null || resourceId == null || rating == null) {
            response.put("status", 400);
            response.put("message", "参数不完整");
            return ResponseEntity.ok(response);
        }
        
        Long userId = userService.getUserIdFromToken(token);
        if (userId == null) {
            response.put("status", 401);
            response.put("message", "无效的token");
            return ResponseEntity.ok(response);
        }
        
        boolean success = recommendationService.submitResourceFeedback(userId, resourceId, feedback, rating);
        
        if (success) {
            response.put("status", 200);
            response.put("message", "反馈提交成功");
        } else {
            response.put("status", 500);
            response.put("message", "反馈提交失败");
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/teacher/recommend")
    public ResponseEntity<Map<String, Object>> teacherRecommendResource(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        String token = (String) request.get("token");
        Long studentId = Long.valueOf(request.get("studentId").toString());
        Long resourceId = Long.valueOf(request.get("resourceId").toString());
        
        if (token == null || studentId == null || resourceId == null) {
            response.put("status", 400);
            response.put("message", "参数不完整");
            return ResponseEntity.ok(response);
        }
        
        Long teacherId = userService.getUserIdFromToken(token);
        if (teacherId == null) {
            response.put("status", 401);
            response.put("message", "无效的token");
            return ResponseEntity.ok(response);
        }
        
        // 验证教师是否有权限为该学生推荐资源
        if (!userService.isTeacherOfStudent(teacherId, studentId)) {
            response.put("status", 403);
            response.put("message", "无权为该学生推荐资源");
            return ResponseEntity.ok(response);
        }
        
        boolean success = recommendationService.teacherRecommendResource(teacherId, studentId, resourceId);
        
        if (success) {
            response.put("status", 200);
            response.put("message", "资源推荐成功");
        } else {
            response.put("status", 500);
            response.put("message", "资源推荐失败");
        }
        
        return ResponseEntity.ok(response);
    }
} 