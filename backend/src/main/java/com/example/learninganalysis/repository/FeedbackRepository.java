package com.example.learninganalysis.repository;

import com.example.learninganalysis.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    /**
     * 根据学生ID查询反馈，按时间降序排序
     * 
     * @param studentId 学生ID
     * @return 反馈列表
     */
    List<Feedback> findByStudentIdOrderByTimestampDesc(Long studentId);
    
    /**
     * 根据学生ID查询反馈
     * 
     * @param studentId 学生ID
     * @return 反馈列表
     */
    List<Feedback> findByStudentId(Long studentId);

    List<Feedback> findByTeacherId(Long teacherId);
} 