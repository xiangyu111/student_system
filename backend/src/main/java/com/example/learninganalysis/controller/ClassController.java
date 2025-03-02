package com.example.learninganalysis.controller;

import com.example.learninganalysis.dto.AddClassRequest;
import com.example.learninganalysis.dto.AssignTeacherRequest;
import com.example.learninganalysis.dto.ClassResponse;
import com.example.learninganalysis.entity.Class;
import com.example.learninganalysis.entity.User;
import com.example.learninganalysis.repository.ClassRepository;
import com.example.learninganalysis.repository.UserRepository;
import com.example.learninganalysis.service.ClassService;
import com.example.learninganalysis.service.UserService;
import com.example.learninganalysis.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ClassController {
    
    @Autowired
    private ClassService classService;
    
    @Autowired
    private ClassRepository classRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/admin/class/add")
    public ResponseEntity<Map<String, Object>> addClass(@RequestBody AddClassRequest request) {
        Long classId = classService.addClass(request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "班级添加成功");
        response.put("classId", classId);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/admin/class/assignTeacher")
    public ResponseEntity<Map<String, Object>> assignTeacher(@RequestBody AssignTeacherRequest request) {
        classService.assignTeacher(request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "教师分配成功");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/class/list")
    public ResponseEntity<Map<String, Object>> getClassList(@RequestParam String token) {
        Map<String, Object> response = new HashMap<>();
        
        Long userId = userService.getUserIdFromToken(token);
        if (userId == null) {
            response.put("status", 401);
            response.put("message", "无效的token");
            return ResponseEntity.ok(response);
        }
        
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            response.put("status", 404);
            response.put("message", "用户不存在");
            return ResponseEntity.ok(response);
        }
        
        List<Map<String, Object>> classList = new ArrayList<>();
        
        if ("admin".equals(user.getRole())) {
            // 管理员可以查看所有班级
            List<Class> classes = classRepository.findAll();
            for (Class cls : classes) {
                Map<String, Object> classInfo = new HashMap<>();
                classInfo.put("id", cls.getId());
                classInfo.put("className", cls.getClassName());
                classInfo.put("teacherId", cls.getTeacherId());
                
                // 获取教师信息
                User teacher = userRepository.findById(cls.getTeacherId()).orElse(null);
                classInfo.put("teacherName", teacher != null ? teacher.getUsername() : "未分配");
                
                classList.add(classInfo);
            }
        } else if ("teacher".equals(user.getRole())) {
            // 教师只能查看自己负责的班级
            List<Class> classes = classRepository.findByTeacherId(userId);
            for (Class cls : classes) {
                Map<String, Object> classInfo = new HashMap<>();
                classInfo.put("id", cls.getId());
                classInfo.put("className", cls.getClassName());
                classInfo.put("teacherId", cls.getTeacherId());
                classInfo.put("teacherName", user.getUsername());
                
                classList.add(classInfo);
            }
        }
        
        response.put("status", 200);
        response.put("classes", classList);
        
        return ResponseEntity.ok(response);
    }
} 