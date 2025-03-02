package com.example.learninganalysis.repository;

import com.example.learninganalysis.entity.ResourceFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceFeedbackRepository extends JpaRepository<ResourceFeedback, Long> {
    
    /**
     * 根据学生ID和资源ID查找反馈
     */
    Optional<ResourceFeedback> findByStudentIdAndResourceId(Long studentId, Long resourceId);
    
    /**
     * 根据资源ID查找所有反馈
     */
    List<ResourceFeedback> findByResourceId(Long resourceId);
    
    /**
     * 根据学生ID查找所有反馈
     */
    List<ResourceFeedback> findByStudentId(Long studentId);
    
    /**
     * 根据评分降序查找资源反馈
     */
    List<ResourceFeedback> findByResourceIdOrderByRatingDesc(Long resourceId);
    
    @Query("SELECT AVG(rf.rating) FROM ResourceFeedback rf WHERE rf.resourceId = :resourceId")
    Double getAverageRatingByResourceId(@Param("resourceId") Long resourceId);
} 