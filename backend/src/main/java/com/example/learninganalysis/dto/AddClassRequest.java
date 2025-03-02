package com.example.learninganalysis.dto;

public class AddClassRequest {
    private String token;
    private String className;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }
} 