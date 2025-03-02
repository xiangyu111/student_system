package com.example.learninganalysis.service.impl;

import com.example.learninganalysis.dto.GoalRequest;
import com.example.learninganalysis.dto.GoalResponse;
import com.example.learninganalysis.entity.Goal;
import com.example.learninganalysis.entity.User;
import com.example.learninganalysis.repository.GoalRepository;
import com.example.learninganalysis.repository.UserRepository;
import com.example.learninganalysis.service.GoalService;
import com.example.learninganalysis.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GoalServiceImpl implements GoalService {
    
    @Autowired
    private GoalRepository goalRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    public Long addGoal(GoalRequest request) {
        // 验证用户
        String username = jwtUtil.getUsernameFromToken(request.getToken());
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 创建目标
        Goal goal = new Goal();
        goal.setStudentId(user.getId());
        goal.setGoalName(request.getGoalName());
        goal.setGoalDescription(request.getGoalDescription());
        goal.setDueDate(request.getDueDate());
        goal.setPriority(request.getPriority());
        goal.setStatus("pending"); // 初始状态为待完成
        
        Goal savedGoal = goalRepository.save(goal);
        return savedGoal.getId();
    }
    
    @Override
    public List<GoalResponse> getGoals(String token) {
        // 验证用户
        String username = jwtUtil.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 获取用户的目标
        List<Goal> goals = goalRepository.findByStudentId(user.getId());
        
        // 转换为响应对象
        return goals.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    @Override
    public List<GoalResponse> getStudentGoals(Long studentId, String token) {
        // 验证教师权限
        String username = jwtUtil.getUsernameFromToken(token);
        User teacher = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        if (!"teacher".equals(teacher.getRole()) && !"admin".equals(teacher.getRole())) {
            throw new RuntimeException("无权查看学生目标");
        }
        
        // 获取学生目标
        List<Goal> goals = goalRepository.findByStudentId(studentId);
        
        // 转换为响应对象
        return goals.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    @Override
    public void updateGoal(Long goalId, GoalRequest request) {
        // 验证用户
        String username = jwtUtil.getUsernameFromToken(request.getToken());
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 获取目标
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("目标不存在"));
        
        // 验证权限
        if (!goal.getStudentId().equals(user.getId()) && !"teacher".equals(user.getRole()) && !"admin".equals(user.getRole())) {
            throw new RuntimeException("无权更新此目标");
        }
        
        // 更新目标
        goal.setGoalName(request.getGoalName());
        goal.setGoalDescription(request.getGoalDescription());
        goal.setDueDate(request.getDueDate());
        goal.setPriority(request.getPriority());
        
        goalRepository.save(goal);
    }
    
    @Override
    public void deleteGoal(Long goalId, String token) {
        // 验证用户
        String username = jwtUtil.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 获取目标
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("目标不存在"));
        
        // 验证权限
        if (!goal.getStudentId().equals(user.getId()) && !"teacher".equals(user.getRole()) && !"admin".equals(user.getRole())) {
            throw new RuntimeException("无权删除此目标");
        }
        
        // 删除目标
        goalRepository.delete(goal);
    }
    
    @Override
    public void updateGoalStatus(Long goalId, String status, String token) {
        // 验证用户
        String username = jwtUtil.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 获取目标
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("目标不存在"));
        
        // 验证权限
        if (!goal.getStudentId().equals(user.getId()) && !"teacher".equals(user.getRole()) && !"admin".equals(user.getRole())) {
            throw new RuntimeException("无权更新此目标状态");
        }
        
        // 更新状态
        goal.setStatus(status);
        
        goalRepository.save(goal);
    }
    
    // 辅助方法：将实体转换为响应对象
    private GoalResponse convertToResponse(Goal goal) {
        GoalResponse response = new GoalResponse();
        response.setId(goal.getId());
        response.setGoalName(goal.getGoalName());
        response.setGoalDescription(goal.getGoalDescription());
        response.setDueDate(goal.getDueDate());
        response.setStatus(goal.getStatus());
        response.setPriority(goal.getPriority());
        return response;
    }
} 