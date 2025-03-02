package com.example.learninganalysis.controller;

import com.example.learninganalysis.entity.Feedback;
import com.example.learninganalysis.service.FeedbackService;
import com.example.learninganalysis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitFeedback(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        String token = request.get("token");
        String feedbackContent = request.get("feedback");
        
        if (token == null || feedbackContent == null) {
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
        
        boolean success = feedbackService.submitFeedback(userId, feedbackContent);
        
        if (success) {
            response.put("status", 200);
            response.put("message", "反馈提交成功");
        } else {
            response.put("status", 500);
            response.put("message", "反馈提交失败");
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getFeedbackList(@RequestParam String token) {
        Map<String, Object> response = new HashMap<>();
        
        Long userId = userService.getUserIdFromToken(token);
        if (userId == null) {
            response.put("status", 401);
            response.put("message", "无效的token");
            return ResponseEntity.ok(response);
        }
        
        List<Feedback> feedbackList = feedbackService.getFeedbackByStudentId(userId);
        
        response.put("status", 200);
        response.put("feedbackList", feedbackList);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/teacher/student/{studentId}/feedbacks")
    public ResponseEntity<Map<String, Object>> getStudentFeedbacks(
            @PathVariable Long studentId,
            @RequestParam String token) {
        Map<String, Object> response = new HashMap<>();
        
        Long teacherId = userService.getUserIdFromToken(token);
        if (teacherId == null) {
            response.put("status", 401);
            response.put("message", "无效的token");
            return ResponseEntity.ok(response);
        }
        
        // 验证教师是否有权限查看该学生的反馈
        if (!userService.isTeacherOfStudent(teacherId, studentId)) {
            response.put("status", 403);
            response.put("message", "无权查看该学生的反馈");
            return ResponseEntity.ok(response);
        }
        
        List<Feedback> feedbacks = feedbackService.getFeedbackByStudentId(studentId);
        
        response.put("status", 200);
        response.put("feedbacks", feedbacks);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/teacher/student/{studentId}/feedback/{feedbackId}/reply")
    public ResponseEntity<Map<String, Object>> replyToFeedback(
            @PathVariable Long studentId,
            @PathVariable Long feedbackId,
            @RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        String token = request.get("token");
        String replyContent = request.get("feedback");
        
        if (token == null || replyContent == null) {
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
        
        // 验证教师是否有权限回复该学生的反馈
        if (!userService.isTeacherOfStudent(teacherId, studentId)) {
            response.put("status", 403);
            response.put("message", "无权回复该学生的反馈");
            return ResponseEntity.ok(response);
        }
        
        boolean success = feedbackService.replyToFeedback(feedbackId, replyContent);
        
        if (success) {
            response.put("status", 200);
            response.put("message", "回复提交成功");
        } else {
            response.put("status", 500);
            response.put("message", "回复提交失败");
        }
        
        return ResponseEntity.ok(response);
    }
} 