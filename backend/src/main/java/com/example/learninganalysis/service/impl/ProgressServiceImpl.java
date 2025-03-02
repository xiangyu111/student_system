package com.example.learninganalysis.service.impl;

import com.example.learninganalysis.entity.Activity;
import com.example.learninganalysis.entity.Goal;
import com.example.learninganalysis.entity.User;
import com.example.learninganalysis.repository.ActivityRepository;
import com.example.learninganalysis.repository.GoalRepository;
import com.example.learninganalysis.repository.UserRepository;
import com.example.learninganalysis.service.ProgressService;
import com.example.learninganalysis.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProgressServiceImpl implements ProgressService {
    
    @Autowired
    private ActivityRepository activityRepository;
    
    @Autowired
    private GoalRepository goalRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    public Map<String, Object> getProgress(String token) {
        // 验证用户
        String username = jwtUtil.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 获取用户的活动和目标
        List<Activity> activities = activityRepository.findByStudentId(user.getId());
        List<Goal> goals = goalRepository.findByStudentId(user.getId());
        
        // 计算总体进度
        int totalActivities = activities.size();
        int completedActivities = (int) activities.stream()
                .filter(a -> a.getEndTime() != null && a.getEndTime().isBefore(LocalDateTime.now()))
                .count();
        
        int totalGoals = goals.size();
        int completedGoals = (int) goals.stream()
                .filter(g -> "completed".equals(g.getStatus()))
                .count();
        
        int overallProgress = 0;
        if (totalActivities + totalGoals > 0) {
            overallProgress = (completedActivities + completedGoals) * 100 / (totalActivities + totalGoals);
        }
        
        // 构建响应数据
        Map<String, Object> progressData = new HashMap<>();
        progressData.put("overallProgress", overallProgress);
        progressData.put("totalActivities", totalActivities);
        progressData.put("completedActivities", completedActivities);
        progressData.put("totalGoals", totalGoals);
        progressData.put("completedGoals", completedGoals);
        
        // 获取最近的活动
        List<Map<String, Object>> recentActivities = activities.stream()
                .sorted((a1, a2) -> a2.getStartTime().compareTo(a1.getStartTime()))
                .limit(5)
                .map(activity -> {
                    Map<String, Object> activityMap = new HashMap<>();
                    activityMap.put("id", activity.getId());
                    activityMap.put("name", activity.getActivityName());
                    activityMap.put("type", activity.getActivityType());
                    activityMap.put("startTime", activity.getStartTime());
                    activityMap.put("endTime", activity.getEndTime());
                    
                    // 计算活动状态
                    LocalDateTime now = LocalDateTime.now();
                    if (activity.getEndTime() != null && activity.getEndTime().isBefore(now)) {
                        activityMap.put("status", "completed");
                    } else if (activity.getStartTime() != null && activity.getStartTime().isAfter(now)) {
                        activityMap.put("status", "pending");
                    } else {
                        activityMap.put("status", "in_progress");
                    }
                    
                    return activityMap;
                })
                .collect(Collectors.toList());
        
        progressData.put("recentActivities", recentActivities);
        
        // 获取未完成的目标
        List<Map<String, Object>> pendingGoals = goals.stream()
                .filter(g -> !"completed".equals(g.getStatus()))
                .sorted((g1, g2) -> g1.getDueDate().compareTo(g2.getDueDate()))
                .limit(5)
                .map(goal -> {
                    Map<String, Object> goalMap = new HashMap<>();
                    goalMap.put("id", goal.getId());
                    goalMap.put("name", goal.getGoalName());
                    goalMap.put("description", goal.getGoalDescription());
                    goalMap.put("dueDate", goal.getDueDate());
                    goalMap.put("status", goal.getStatus());
                    goalMap.put("priority", goal.getPriority());
                    return goalMap;
                })
                .collect(Collectors.toList());
        
        progressData.put("pendingGoals", pendingGoals);
        
        return progressData;
    }
    
    @Override
    public void updateProgress(String token, Long activityId, Integer progress) {
        // 验证用户
        String username = jwtUtil.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 获取活动
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("活动不存在"));
        
        // 验证权限
        if (!activity.getStudentId().equals(user.getId())) {
            throw new RuntimeException("无权更新此活动进度");
        }
        
        // 更新进度（这里简化处理，实际可能需要更复杂的进度跟踪机制）
        if (progress >= 100) {
            // 如果进度达到100%，将活动标记为已完成
            activity.setEndTime(LocalDateTime.now());
        }
        
        activityRepository.save(activity);
    }
} 