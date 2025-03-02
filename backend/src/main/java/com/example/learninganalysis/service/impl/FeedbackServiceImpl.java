package com.example.learninganalysis.service.impl;

import com.example.learninganalysis.dto.FeedbackResponse;
import com.example.learninganalysis.dto.SubmitFeedbackRequest;
import com.example.learninganalysis.entity.Feedback;
import com.example.learninganalysis.entity.User;
import com.example.learninganalysis.repository.FeedbackRepository;
import com.example.learninganalysis.repository.UserRepository;
import com.example.learninganalysis.service.FeedbackService;
import com.example.learninganalysis.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FeedbackServiceImpl implements FeedbackService {
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    public boolean submitFeedback(Long studentId, String feedback) {
        try {
            Feedback newFeedback = new Feedback();
            newFeedback.setStudentId(studentId);
            newFeedback.setFeedback(feedback);
            newFeedback.setTimestamp(new Date());
            
            feedbackRepository.save(newFeedback);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    @Override
    public List<Feedback> getFeedbackByStudentId(Long studentId) {
        return feedbackRepository.findByStudentIdOrderByTimestampDesc(studentId);
    }
    
    @Override
    public boolean replyToFeedback(Long feedbackId, String reply) {
        try {
            Optional<Feedback> optionalFeedback = feedbackRepository.findById(feedbackId);
            if (optionalFeedback.isPresent()) {
                Feedback feedback = optionalFeedback.get();
                feedback.setTeacherFeedback(reply);
                feedbackRepository.save(feedback);
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    @Override
    public List<FeedbackResponse> getStudentFeedbacks(Long studentId, String token) {
        // 验证教师权限
        String username = jwtUtil.getUsernameFromToken(token);
        User teacher = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        if (!"teacher".equals(teacher.getRole()) && !"admin".equals(teacher.getRole())) {
            throw new RuntimeException("无权查看学生反馈");
        }
        
        // 获取学生反馈
        List<Feedback> feedbacks = feedbackRepository.findByStudentId(studentId);
        
        // 构建响应
        return feedbacks.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    @Override
    public List<FeedbackResponse> getMyFeedbacks(String token) {
        // 获取用户ID
        String username = jwtUtil.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        // 获取反馈
        List<Feedback> feedbacks = feedbackRepository.findByStudentId(user.getId());
        
        // 构建响应
        return feedbacks.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    @Override
    public void respondToFeedback(Long feedbackId, String response, String token) {
        // 验证教师权限
        String username = jwtUtil.getUsernameFromToken(token);
        User teacher = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        if (!"teacher".equals(teacher.getRole()) && !"admin".equals(teacher.getRole())) {
            throw new RuntimeException("无权回复反馈");
        }
        
        // 获取反馈
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("反馈不存在"));
        
        // 更新反馈
        feedback.setTeacherId(teacher.getId());
        feedback.setResponse(response);
        feedback.setResponseTime(LocalDateTime.now());
        
        feedbackRepository.save(feedback);
    }
    
    // 辅助方法：将实体转换为响应对象
    private FeedbackResponse convertToResponse(Feedback feedback) {
        FeedbackResponse response = new FeedbackResponse();
        response.setId(feedback.getId());
        response.setFeedback(feedback.getFeedback());
        response.setTimestamp(feedback.getTimestamp().toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime());
        response.setResponse(feedback.getResponse());
        response.setResponseTime(feedback.getResponseTime());
        return response;
    }
} 