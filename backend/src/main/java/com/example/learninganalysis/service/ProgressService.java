package com.example.learninganalysis.service;

import java.util.Map;

public interface ProgressService {
    Map<String, Object> getProgress(String token);
    void updateProgress(String token, Long activityId, Integer progress);
} 