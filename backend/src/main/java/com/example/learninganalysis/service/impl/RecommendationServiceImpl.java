package com.example.learninganalysis.service.impl;

import com.example.learninganalysis.dto.ResourceFeedbackRequest;
import com.example.learninganalysis.dto.ResourceResponse;
import com.example.learninganalysis.entity.Activity;
import com.example.learninganalysis.entity.Resource;
import com.example.learninganalysis.entity.ResourceFeedback;
import com.example.learninganalysis.entity.TeacherRecommendation;
import com.example.learninganalysis.entity.User;
import com.example.learninganalysis.repository.ActivityRepository;
import com.example.learninganalysis.repository.ResourceFeedbackRepository;
import com.example.learninganalysis.repository.ResourceRepository;
import com.example.learninganalysis.repository.TeacherRecommendationRepository;
import com.example.learninganalysis.repository.UserRepository;
import com.example.learninganalysis.service.RecommendationService;
import com.example.learninganalysis.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationServiceImpl implements RecommendationService {
    
    @Autowired
    private ResourceRepository resourceRepository;
    
    @Autowired
    private ActivityRepository activityRepository;
    
    @Autowired
    private ResourceFeedbackRepository resourceFeedbackRepository;
    
    @Autowired
    private TeacherRecommendationRepository teacherRecommendationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    public List<ResourceResponse> getRecommendations(String token) {
        // 验证用户
        String username = jwtUtil.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 获取用户最近的活动
        List<Activity> recentActivities = activityRepository.findTop10ByStudentIdOrderByStartTimeDesc(user.getId());
        
        // 分析用户兴趣
        Map<String, Integer> interestCount = new HashMap<>();
        for (Activity activity : recentActivities) {
            String activityType = activity.getActivityType();
            interestCount.put(activityType, interestCount.getOrDefault(activityType, 0) + 1);
        }
        
        // 找出最感兴趣的活动类型
        String mostInterestingType = "";
        int maxCount = 0;
        for (Map.Entry<String, Integer> entry : interestCount.entrySet()) {
            if (entry.getValue() > maxCount) {
                maxCount = entry.getValue();
                mostInterestingType = entry.getKey();
            }
        }
        
        // 根据兴趣推荐资源
        List<Resource> allResources = resourceRepository.findAll();
        List<Resource> recommendedResources = new ArrayList<>();
        
        // 如果有明确的兴趣，优先推荐相关资源
        if (!mostInterestingType.isEmpty()) {
            String resourceType = mapActivityTypeToResourceType(mostInterestingType);
            for (Resource resource : allResources) {
                if (resource.getResourceType().equals(resourceType)) {
                    recommendedResources.add(resource);
                    if (recommendedResources.size() >= 3) {
                        break;
                    }
                }
            }
        }
        
        // 如果推荐不足3个，添加其他类型的资源
        if (recommendedResources.size() < 3) {
            for (Resource resource : allResources) {
                if (!recommendedResources.contains(resource)) {
                    recommendedResources.add(resource);
                    if (recommendedResources.size() >= 3) {
                        break;
                    }
                }
            }
        }
        
        // 转换为响应对象
        return recommendedResources.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    @Override
    public void submitResourceFeedback(ResourceFeedbackRequest request) {
        // 验证用户
        String username = jwtUtil.getUsernameFromToken(request.getToken());
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 验证资源存在
        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new RuntimeException("资源不存在"));
        
        // 创建反馈
        ResourceFeedback feedback = new ResourceFeedback();
        feedback.setResourceId(request.getResourceId());
        feedback.setStudentId(user.getId());
        feedback.setRating(request.getRating());
        feedback.setFeedback(request.getFeedback());
        feedback.setTimestamp(LocalDateTime.now());
        
        resourceFeedbackRepository.save(feedback);
    }
    
    @Override
    public List<ResourceResponse> getPopularResources(String token) {
        // 验证用户
        jwtUtil.getUsernameFromToken(token);
        
        // 获取所有资源
        List<Resource> allResources = resourceRepository.findAll();
        
        // 计算每个资源的平均评分
        Map<Resource, Double> resourceRatings = new HashMap<>();
        for (Resource resource : allResources) {
            Double avgRating = resourceFeedbackRepository.getAverageRatingByResourceId(resource.getId());
            if (avgRating != null) {
                resourceRatings.put(resource, avgRating);
            } else {
                resourceRatings.put(resource, 0.0);
            }
        }
        
        // 按评分排序
        List<Resource> sortedResources = new ArrayList<>(resourceRatings.keySet());
        sortedResources.sort((r1, r2) -> Double.compare(resourceRatings.get(r2), resourceRatings.get(r1)));
        
        // 获取前4个资源
        List<Resource> popularResources = sortedResources.stream().limit(4).collect(Collectors.toList());
        
        // 如果不足4个，随机添加其他资源
        if (popularResources.size() < 4) {
            List<Resource> remainingResources = new ArrayList<>(allResources);
            remainingResources.removeAll(popularResources);
            Collections.shuffle(remainingResources);
            
            for (Resource resource : remainingResources) {
                popularResources.add(resource);
                if (popularResources.size() >= 4) {
                    break;
                }
            }
        }
        
        // 转换为响应对象
        return popularResources.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    @Override
    public List<ResourceResponse> getRecentResources(String token) {
        // 验证用户
        jwtUtil.getUsernameFromToken(token);
        
        // 获取所有资源
        List<Resource> allResources = resourceRepository.findAll();
        
        // 按创建时间排序
        allResources.sort((r1, r2) -> {
            if (r1.getCreatedAt() == null && r2.getCreatedAt() == null) return 0;
            if (r1.getCreatedAt() == null) return 1;
            if (r2.getCreatedAt() == null) return -1;
            return r2.getCreatedAt().compareTo(r1.getCreatedAt());
        });
        
        // 获取前4个最新资源
        List<Resource> recentResources = allResources.stream().limit(4).collect(Collectors.toList());
        
        // 转换为响应对象
        return recentResources.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    @Override
    public List<Resource> getRecommendationsForStudent(Long studentId) {
        // 获取教师推荐的资源
        List<TeacherRecommendation> teacherRecommendations = 
                teacherRecommendationRepository.findByStudentId(studentId);
        
        List<Long> teacherRecommendedResourceIds = teacherRecommendations.stream()
                .map(TeacherRecommendation::getResourceId)
                .collect(Collectors.toList());
        
        // 获取教师推荐的资源详情
        List<Resource> teacherRecommendedResources = new ArrayList<>();
        if (!teacherRecommendedResourceIds.isEmpty()) {
            teacherRecommendedResources = resourceRepository.findAllById(teacherRecommendedResourceIds);
        }
        
        // 获取系统推荐的资源（这里简化为获取评分最高的资源）
        List<Resource> systemRecommendedResources = resourceRepository.findTopRatedResources(10);
        
        // 合并推荐结果，优先展示教师推荐的资源
        List<Resource> allRecommendations = new ArrayList<>(teacherRecommendedResources);
        
        // 添加系统推荐的资源，但排除已经由教师推荐的资源
        for (Resource resource : systemRecommendedResources) {
            if (!teacherRecommendedResourceIds.contains(resource.getId())) {
                allRecommendations.add(resource);
            }
        }
        
        return allRecommendations;
    }
    
    @Override
    public boolean submitResourceFeedback(Long studentId, Long resourceId, String feedback, Integer rating) {
        try {
            // 检查资源是否存在
            Optional<Resource> resourceOptional = resourceRepository.findById(resourceId);
            if (!resourceOptional.isPresent()) {
                return false;
            }
            
            // 检查是否已经提交过反馈
            Optional<ResourceFeedback> existingFeedback = 
                    resourceFeedbackRepository.findByStudentIdAndResourceId(studentId, resourceId);
            
            ResourceFeedback resourceFeedback;
            if (existingFeedback.isPresent()) {
                // 更新现有反馈
                resourceFeedback = existingFeedback.get();
                resourceFeedback.setFeedback(feedback);
                resourceFeedback.setRating(rating);
                resourceFeedback.setTimestamp(LocalDateTime.now());
            } else {
                // 创建新反馈
                resourceFeedback = new ResourceFeedback();
                resourceFeedback.setStudentId(studentId);
                resourceFeedback.setResourceId(resourceId);
                resourceFeedback.setFeedback(feedback);
                resourceFeedback.setRating(rating);
                resourceFeedback.setTimestamp(LocalDateTime.now());
            }
            
            resourceFeedbackRepository.save(resourceFeedback);
            
            // 更新资源的平均评分
            updateResourceAverageRating(resourceId);
            
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    @Override
    public boolean teacherRecommendResource(Long teacherId, Long studentId, Long resourceId) {
        try {
            // 检查资源是否存在
            Optional<Resource> resourceOptional = resourceRepository.findById(resourceId);
            if (!resourceOptional.isPresent()) {
                return false;
            }
            
            // 检查是否已经推荐过
            Optional<TeacherRecommendation> existingRecommendation = 
                    teacherRecommendationRepository.findByTeacherIdAndStudentIdAndResourceId(
                            teacherId, studentId, resourceId);
            
            if (existingRecommendation.isPresent()) {
                // 已经推荐过，不需要重复推荐
                return true;
            }
            
            // 创建新推荐
            TeacherRecommendation recommendation = new TeacherRecommendation();
            recommendation.setTeacherId(teacherId);
            recommendation.setStudentId(studentId);
            recommendation.setResourceId(resourceId);
            recommendation.setTimestamp(LocalDateTime.now());
            
            teacherRecommendationRepository.save(recommendation);
            
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    // 辅助方法：将活动类型映射到资源类型
    private String mapActivityTypeToResourceType(String activityType) {
        switch (activityType) {
            case "reading":
                return "article";
            case "course":
                return "course";
            case "research":
                return "research";
            default:
                return "teaching";
        }
    }
    
    // 辅助方法：将实体转换为响应对象
    private ResourceResponse convertToResponse(Resource resource) {
        ResourceResponse response = new ResourceResponse();
        response.setResourceId(resource.getId());
        response.setResourceName(resource.getResourceName());
        response.setResourceType(resource.getResourceType());
        response.setDescription(resource.getDescription());
        response.setLink(resource.getResourceUrl());
        return response;
    }
    
    // 辅助方法：更新资源的平均评分
    private void updateResourceAverageRating(Long resourceId) {
        List<ResourceFeedback> feedbacks = resourceFeedbackRepository.findByResourceId(resourceId);
        
        if (feedbacks.isEmpty()) {
            return;
        }
        
        // 计算平均评分
        double averageRating = feedbacks.stream()
                .mapToInt(ResourceFeedback::getRating)
                .average()
                .orElse(0.0);
        
        // 更新资源的平均评分
        Optional<Resource> resourceOptional = resourceRepository.findById(resourceId);
        if (resourceOptional.isPresent()) {
            Resource resource = resourceOptional.get();
            resource.setAverageRating(averageRating);
            resourceRepository.save(resource);
        }
    }
} 