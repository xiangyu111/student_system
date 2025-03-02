package com.example.learninganalysis.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "feedbacks")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long studentId;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String feedback;
    
    @Column
    private Long teacherId;
    
    @Column(columnDefinition = "TEXT")
    private String response;
    
    @Column(columnDefinition = "TEXT")
    private String teacherFeedback;
    
    @Column
    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;
    
    @Column
    private java.time.LocalDateTime responseTime;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }
    
    public String getTeacherFeedback() {
        return teacherFeedback;
    }

    public void setTeacherFeedback(String teacherFeedback) {
        this.teacherFeedback = teacherFeedback;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public java.time.LocalDateTime getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(java.time.LocalDateTime responseTime) {
        this.responseTime = responseTime;
    }
} 