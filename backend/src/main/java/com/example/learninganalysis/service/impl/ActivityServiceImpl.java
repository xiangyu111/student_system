package com.example.learninganalysis.service.impl;

import com.example.learninganalysis.dto.ActivityRequest;
import com.example.learninganalysis.dto.ActivityResponse;
import com.example.learninganalysis.entity.Activity;
import com.example.learninganalysis.entity.User;
import com.example.learninganalysis.repository.ActivityRepository;
import com.example.learninganalysis.repository.UserRepository;
import com.example.learninganalysis.service.ActivityService;
import com.example.learninganalysis.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityServiceImpl implements ActivityService {
    
    @Autowired
    private ActivityRepository activityRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    public Long addActivity(ActivityRequest request) {
        // 验证用户
        String username = jwtUtil.getUsernameFromToken(request.getToken());
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 创建活动
        Activity activity = new Activity();
        activity.setStudentId(user.getId());
        activity.setActivityName(request.getActivityName());
        activity.setActivityType(request.getActivityType());
        activity.setStartTime(request.getStartTime());
        activity.setEndTime(request.getEndTime());
        activity.setDescription(request.getDescription());
        
        Activity savedActivity = activityRepository.save(activity);
        return savedActivity.getId();
    }
    
    @Override
    public List<ActivityResponse> getActivities(String token) {
        // 获取用户ID
        String username = jwtUtil.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 获取活动
        List<Activity> activities = activityRepository.findByStudentId(user.getId());
        
        // 构建响应
        return activities.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    @Override
    public List<ActivityResponse> getStudentActivities(Long studentId, String token) {
        // 验证教师权限
        String username = jwtUtil.getUsernameFromToken(token);
        User teacher = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        if (!"teacher".equals(teacher.getRole()) && !"admin".equals(teacher.getRole())) {
            throw new RuntimeException("无权查看学生活动");
        }
        
        // 获取学生活动
        List<Activity> activities = activityRepository.findByStudentId(studentId);
        
        // 构建响应
        return activities.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    @Override
    public void updateActivity(Long activityId, ActivityRequest request) {
        // 验证用户
        String username = jwtUtil.getUsernameFromToken(request.getToken());
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 获取活动
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("活动不存在"));
        
        // 验证权限
        if (!activity.getStudentId().equals(user.getId()) && !"teacher".equals(user.getRole()) && !"admin".equals(user.getRole())) {
            throw new RuntimeException("无权更新此活动");
        }
        
        // 更新活动
        activity.setActivityName(request.getActivityName());
        activity.setActivityType(request.getActivityType());
        activity.setStartTime(request.getStartTime());
        activity.setEndTime(request.getEndTime());
        activity.setDescription(request.getDescription());
        
        activityRepository.save(activity);
    }
    
    @Override
    public void deleteActivity(Long activityId, String token) {
        // 验证用户
        String username = jwtUtil.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 获取活动
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("活动不存在"));
        
        // 验证权限
        if (!activity.getStudentId().equals(user.getId()) && !"teacher".equals(user.getRole()) && !"admin".equals(user.getRole())) {
            throw new RuntimeException("无权删除此活动");
        }
        
        // 删除活动
        activityRepository.delete(activity);
    }
    
    // 辅助方法：将实体转换为响应对象
    private ActivityResponse convertToResponse(Activity activity) {
        ActivityResponse response = new ActivityResponse();
        response.setId(activity.getId());
        response.setActivityName(activity.getActivityName());
        response.setActivityType(activity.getActivityType());
        response.setStartTime(activity.getStartTime());
        response.setEndTime(activity.getEndTime());
        response.setDescription(activity.getDescription());
        
        // 计算活动状态
        LocalDateTime now = LocalDateTime.now();
        if (activity.getEndTime() != null && activity.getEndTime().isBefore(now)) {
            response.setStatus("completed");
        } else if (activity.getStartTime() != null && activity.getStartTime().isAfter(now)) {
            response.setStatus("pending");
        } else {
            response.setStatus("in_progress");
        }
        
        return response;
    }
} 