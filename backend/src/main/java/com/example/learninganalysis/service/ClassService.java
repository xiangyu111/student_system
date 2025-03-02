package com.example.learninganalysis.service;

import com.example.learninganalysis.dto.AddClassRequest;
import com.example.learninganalysis.dto.AssignTeacherRequest;
import com.example.learninganalysis.dto.ClassResponse;
import java.util.List;

public interface ClassService {
    Long addClass(AddClassRequest request);
    void assignTeacher(AssignTeacherRequest request);
    List<ClassResponse> getClassList(String token);
} 