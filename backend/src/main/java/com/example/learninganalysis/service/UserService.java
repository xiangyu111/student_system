package com.example.learninganalysis.service;

import com.example.learninganalysis.dto.RegisterRequest;
import com.example.learninganalysis.dto.UpdateUserRequest;
import org.springframework.http.ResponseEntity;

public interface UserService {
    
    /**
     * 注册新用户
     */
    void register(String username, String password, String role);
    
    /**
     * 用户登录
     */
    ResponseEntity<?> login(String username, String password);
    
    /**
     * 更新用户信息
     */
    void updateUserInfo(UpdateUserRequest request);
    
    /**
     * 获取用户信息
     */
    ResponseEntity<?> getUserInfo(String token);
    
    /**
     * 从token中获取用户ID
     * 
     * @param token JWT令牌
     * @return 用户ID，如果token无效则返回null
     */
    Long getUserIdFromToken(String token);
    
    /**
     * 判断教师是否是学生的任课教师
     * 
     * @param teacherId 教师ID
     * @param studentId 学生ID
     * @return 如果是任课教师则返回true，否则返回false
     */
    boolean isTeacherOfStudent(Long teacherId, Long studentId);
} 