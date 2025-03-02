package com.example.learninganalysis.service;

import com.example.learninganalysis.dto.ResourceRequest;
import com.example.learninganalysis.dto.ResourceResponse;
import java.util.List;

public interface ResourceService {
    Long addResource(ResourceRequest request);
    List<ResourceResponse> getAllResources(String token);
    ResourceResponse getResourceById(Long resourceId, String token);
    void updateResource(Long resourceId, ResourceRequest request);
    void deleteResource(Long resourceId, String token);
    List<ResourceResponse> searchResources(String keyword, String token);
} 