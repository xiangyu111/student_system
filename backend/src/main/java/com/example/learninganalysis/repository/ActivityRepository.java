package com.example.learninganalysis.repository;

import com.example.learninganalysis.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByStudentId(Long studentId);
    
    List<Activity> findByStudentIdAndActivityType(Long studentId, String activityType);
    
    List<Activity> findByStudentIdAndStartTimeBetween(Long studentId, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT a FROM Activity a WHERE a.studentId = :studentId AND a.startTime >= :startDate ORDER BY a.startTime DESC")
    List<Activity> findRecentActivities(@Param("studentId") Long studentId, @Param("startDate") LocalDateTime startDate);
    
    List<Activity> findTop10ByStudentIdOrderByStartTimeDesc(Long studentId);
    
    @Query("SELECT SUM(TIMESTAMPDIFF(SECOND, a.startTime, a.endTime)) FROM Activity a WHERE a.studentId = :studentId AND a.activityType = :activityType AND a.startTime BETWEEN :startDate AND :endDate")
    Long sumDurationByStudentIdAndActivityTypeAndDateRange(
            @Param("studentId") Long studentId,
            @Param("activityType") String activityType,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}
