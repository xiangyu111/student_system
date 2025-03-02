package com.example.learninganalysis.service;

import com.example.learninganalysis.dto.ResourceFeedbackRequest;
import com.example.learninganalysis.dto.ResourceResponse;
import com.example.learninganalysis.entity.Resource;
import java.util.List;

public interface RecommendationService {
    
    /**
     * 获取学生的个性化推荐资源
     * 
     * @param studentId 学生ID
     * @return 推荐资源列表
     */
    List<Resource> getRecommendationsForStudent(Long studentId);
    
    /**
     * 提交资源反馈
     * 
     * @param studentId 学生ID
     * @param resourceId 资源ID
     * @param feedback 反馈内容
     * @param rating 评分（1-5）
     * @return 是否提交成功
     */
    boolean submitResourceFeedback(Long studentId, Long resourceId, String feedback, Integer rating);
    
    /**
     * 教师为学生推荐资源
     * 
     * @param teacherId 教师ID
     * @param studentId 学生ID
     * @param resourceId 资源ID
     * @return 是否推荐成功
     */
    boolean teacherRecommendResource(Long teacherId, Long studentId, Long resourceId);
    
    /**
     * 获取推荐资源列表
     */
    List<ResourceResponse> getRecommendations(String token);
    
    /**
     * 提交资源反馈
     */
    void submitResourceFeedback(ResourceFeedbackRequest request);
    
    /**
     * 获取热门资源
     */
    List<ResourceResponse> getPopularResources(String token);
    
    /**
     * 获取最新资源
     */
    List<ResourceResponse> getRecentResources(String token);
} 