package com.example.learninganalysis.service.impl;

import com.example.learninganalysis.dto.UpdateUserRequest;
import com.example.learninganalysis.entity.User;
import com.example.learninganalysis.repository.UserRepository;
import com.example.learninganalysis.service.UserService;
import com.example.learninganalysis.repository.ClassRepository;
import com.example.learninganalysis.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ClassRepository classRepository;
    
    @Override
    public void register(String username, String password, String role) {
        // 检查用户名是否已存在
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("用户名已存在");
        }
        
        // 创建新用户
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role); // 使用传入的角色
        
        userRepository.save(user);
    }
    
    @Override
    public ResponseEntity<?> login(String username, String password) {
        try {
            // 查找用户
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("用户名或密码错误"));
            
            // 验证密码
            if (!passwordEncoder.matches(password, user.getPassword())) {
                throw new RuntimeException("用户名或密码错误");
            }
            
            // 生成令牌
            String token = jwtUtil.generateToken(user.getUsername());
            
            // 构建响应
            Map<String, Object> response = new HashMap<>();
            response.put("status", 200);
            response.put("token", token);
            response.put("message", "登录成功");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", 401);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }
    
    @Override
    public void updateUserInfo(UpdateUserRequest request) {
        // 从令牌中获取用户名
        String username = jwtUtil.getUsernameFromToken(request.getToken());
        
        // 查找用户
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 更新头像
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }
        
        userRepository.save(user);
    }
    
    @Override
    public ResponseEntity<?> getUserInfo(String token) {
        try {
            String username = jwtUtil.getUsernameFromToken(token);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("role", user.getRole());
            response.put("avatar", user.getAvatar());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }
    
    @Override
    public Long getUserIdFromToken(String token) {
        try {
            String username = jwtUtil.getUsernameFromToken(token);
            if (username == null) {
                return null;
            }
            
            User user = userRepository.findByUsername(username)
                    .orElse(null);
            
            return user != null ? user.getId() : null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    @Override
    public boolean isTeacherOfStudent(Long teacherId, Long studentId) {
        // 这里需要根据您的业务逻辑实现
        // 例如，检查教师是否是学生所在班级的任课教师
        
        // 获取学生所在的班级
        User student = userRepository.findById(studentId).orElse(null);
        if (student == null) {
            return false;
        }
        
        // 假设学生表中有classId字段，表示学生所在班级
        Long classId = student.getClassId();
        if (classId == null) {
            return false;
        }
        
        // 检查教师是否是该班级的任课教师
        // 假设有一个班级教师关联表或者班级表中有teacherId字段
        return classRepository.existsByIdAndTeacherId(classId, teacherId);
    }
}
