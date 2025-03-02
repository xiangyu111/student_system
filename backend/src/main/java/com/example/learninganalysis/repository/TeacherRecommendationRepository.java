package com.example.learninganalysis.repository;

import com.example.learninganalysis.entity.TeacherRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRecommendationRepository extends JpaRepository<TeacherRecommendation, Long> {
    
    /**
     * 根据学生ID查找所有教师推荐
     */
    List<TeacherRecommendation> findByStudentId(Long studentId);
    
    /**
     * 根据教师ID查找所有推荐
     */
    List<TeacherRecommendation> findByTeacherId(Long teacherId);
    
    /**
     * 查找特定教师对特定学生的特定资源的推荐
     */
    Optional<TeacherRecommendation> findByTeacherIdAndStudentIdAndResourceId(
            Long teacherId, Long studentId, Long resourceId);
    
    /**
     * 根据教师ID和学生ID查找所有推荐
     */
    List<TeacherRecommendation> findByTeacherIdAndStudentId(Long teacherId, Long studentId);
} 