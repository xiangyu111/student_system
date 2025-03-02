package com.example.learninganalysis.service;

import com.example.learninganalysis.dto.ActivityRequest;
import com.example.learninganalysis.dto.ActivityResponse;
import java.util.List;

public interface ActivityService {
    Long addActivity(ActivityRequest request);
    List<ActivityResponse> getActivities(String token);
    List<ActivityResponse> getStudentActivities(Long studentId, String token);
    void updateActivity(Long activityId, ActivityRequest request);
    void deleteActivity(Long activityId, String token);
} 