package com.example.learninganalysis.service;

import com.example.learninganalysis.dto.GoalRequest;
import com.example.learninganalysis.dto.GoalResponse;
import java.util.List;

public interface GoalService {
    Long addGoal(GoalRequest request);
    List<GoalResponse> getGoals(String token);
    List<GoalResponse> getStudentGoals(Long studentId, String token);
    void updateGoal(Long goalId, GoalRequest request);
    void deleteGoal(Long goalId, String token);
    void updateGoalStatus(Long goalId, String status, String token);
} 