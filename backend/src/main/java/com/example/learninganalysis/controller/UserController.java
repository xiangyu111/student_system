package com.example.learninganalysis.controller;

import com.example.learninganalysis.dto.LoginRequest;
import com.example.learninganalysis.dto.RegisterRequest;
import com.example.learninganalysis.dto.UpdateUserRequest;
import com.example.learninganalysis.dto.UserInfoResponse;
import com.example.learninganalysis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> registerRequest) {
        String username = registerRequest.get("username");
        String password = registerRequest.get("password");
        String role = registerRequest.get("role");
        userService.register(username, password, role);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "注册成功");
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        return userService.login(username, password);
    }
    
    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> updateUserInfo(@RequestBody UpdateUserRequest request) {
        userService.updateUserInfo(request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "信息更新成功");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/info")
    public ResponseEntity<?> getUserInfo(@RequestParam(required = false) String token,
                                        @RequestHeader(value = "Authorization", required = false) String authHeader) {
        // 优先从 Authorization 头获取 token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }
        
        if (token == null) {
            return ResponseEntity.badRequest().body("Token is required");
        }
        
        return userService.getUserInfo(token);
    }
} 