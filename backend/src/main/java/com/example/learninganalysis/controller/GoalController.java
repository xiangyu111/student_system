package com.example.learninganalysis.controller;

import com.example.learninganalysis.dto.GoalRequest;
import com.example.learninganalysis.dto.GoalResponse;
import com.example.learninganalysis.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class GoalController {
    
    @Autowired
    private GoalService goalService;
    
    @PostMapping("/goal/add")
    public ResponseEntity<Map<String, Object>> addGoal(@RequestBody GoalRequest request) {
        Long goalId = goalService.addGoal(request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "学习目标添加成功");
        response.put("goalId", goalId);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/goal/list")
    public ResponseEntity<Map<String, Object>> getGoals(@RequestParam String token) {
        List<GoalResponse> goals = goalService.getGoals(token);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "获取学习目标列表成功");
        response.put("goals", goals);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/teacher/student/{studentId}/goals")
    public ResponseEntity<Map<String, Object>> getStudentGoals(
            @PathVariable Long studentId, 
            @RequestParam String token) {
        List<GoalResponse> goals = goalService.getStudentGoals(studentId, token);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "获取学生学习目标列表成功");
        response.put("goals", goals);
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/goal/{goalId}/update")
    public ResponseEntity<Map<String, Object>> updateGoal(
            @PathVariable Long goalId, 
            @RequestBody GoalRequest request) {
        goalService.updateGoal(goalId, request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "学习目标更新成功");
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/goal/{goalId}/delete")
    public ResponseEntity<Map<String, Object>> deleteGoal(
            @PathVariable Long goalId, 
            @RequestParam String token) {
        goalService.deleteGoal(goalId, token);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "学习目标删除成功");
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/goal/{goalId}/status")
    public ResponseEntity<Map<String, Object>> updateGoalStatus(
            @PathVariable Long goalId, 
            @RequestBody Map<String, String> request) {
        String token = request.get("token");
        String status = request.get("status");
        
        goalService.updateGoalStatus(goalId, status, token);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "学习目标状态更新成功");
        
        return ResponseEntity.ok(response);
    }
} 