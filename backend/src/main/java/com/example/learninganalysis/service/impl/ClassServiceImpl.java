package com.example.learninganalysis.service.impl;

import com.example.learninganalysis.dto.AddClassRequest;
import com.example.learninganalysis.dto.AssignTeacherRequest;
import com.example.learninganalysis.dto.ClassResponse;
import com.example.learninganalysis.entity.Class;
import com.example.learninganalysis.entity.User;
import com.example.learninganalysis.repository.ClassRepository;
import com.example.learninganalysis.repository.UserRepository;
import com.example.learninganalysis.service.ClassService;
import com.example.learninganalysis.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClassServiceImpl implements ClassService {
    
    @Autowired
    private ClassRepository classRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    public Long addClass(AddClassRequest request) {
        // 验证管理员权限
        String username = jwtUtil.getUsernameFromToken(request.getToken());
        User admin = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 创建班级
        Class newClass = new Class();
        newClass.setClassName(request.getClassName());
        
        Class savedClass = classRepository.save(newClass);
        return savedClass.getId();
    }
    
    @Override
    public void assignTeacher(AssignTeacherRequest request) {
        // 验证管理员权限
        String username = jwtUtil.getUsernameFromToken(request.getToken());
        User admin = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 查找班级
        Class classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new RuntimeException("班级不存在"));
        
        // 查找教师
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("教师不存在"));
        
        // 验证教师角色
        if (!"teacher".equals(teacher.getRole())) {
            throw new RuntimeException("指定用户不是教师");
        }
        
        // 分配教师
        classEntity.setTeacherId(teacher.getId());
        classRepository.save(classEntity);
    }
    
    @Override
    public List<ClassResponse> getClassList(String token) {
        // 获取用户角色
        String username = jwtUtil.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        List<Class> classes = new ArrayList<>();
        
        // 根据角色获取班级列表
        if ("admin".equals(user.getRole())) {
            classes = classRepository.findAll();
        } else if ("teacher".equals(user.getRole())) {
            classes = classRepository.findByTeacherId(user.getId());
        }
        
        // 转换为响应对象
        return classes.stream().map(classEntity -> {
            ClassResponse response = new ClassResponse();
            response.setClassId(classEntity.getId());
            response.setClassName(classEntity.getClassName());
            response.setTeacherId(classEntity.getTeacherId());
            
            // 如果有教师，获取教师信息
            if (classEntity.getTeacherId() != null) {
                userRepository.findById(classEntity.getTeacherId()).ifPresent(teacher -> {
                    response.setTeacherName(teacher.getUsername());
                });
            }
            
            return response;
        }).collect(Collectors.toList());
    }
} 