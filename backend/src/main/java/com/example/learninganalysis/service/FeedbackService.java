package com.example.learninganalysis.service;

import com.example.learninganalysis.dto.FeedbackResponse;
import com.example.learninganalysis.entity.Feedback;

import java.util.List;

public interface FeedbackService {
    
    /**
     * 提交学习反馈
     * 
     * @param studentId 学生ID
     * @param feedback 反馈内容
     * @return 是否提交成功
     */
    boolean submitFeedback(Long studentId, String feedback);
    
    /**
     * 获取学生的反馈列表
     * 
     * @param studentId 学生ID
     * @return 反馈列表
     */
    List<Feedback> getFeedbackByStudentId(Long studentId);
    
    /**
     * 教师回复学生反馈
     * 
     * @param feedbackId 反馈ID
     * @param reply 回复内容
     * @return 是否回复成功
     */
    boolean replyToFeedback(Long feedbackId, String reply);
    
    /**
     * 获取学生的反馈（教师视图）
     */
    List<FeedbackResponse> getStudentFeedbacks(Long studentId, String token);
    
    /**
     * 获取我的反馈
     */
    List<FeedbackResponse> getMyFeedbacks(String token);
    
    /**
     * 回复反馈
     */
    void respondToFeedback(Long feedbackId, String response, String token);
} 