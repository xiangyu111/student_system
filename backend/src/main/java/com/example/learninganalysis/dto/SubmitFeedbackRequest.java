package com.example.learninganalysis.dto;

public class SubmitFeedbackRequest {
    private String token;
    private String feedback;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
} 