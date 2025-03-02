package com.example.learninganalysis.controller;

import com.example.learninganalysis.dto.ResourceRequest;
import com.example.learninganalysis.dto.ResourceResponse;
import com.example.learninganalysis.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resource")
public class ResourceController {
    
    @Autowired
    private ResourceService resourceService;
    
    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addResource(@RequestBody ResourceRequest request) {
        Long resourceId = resourceService.addResource(request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "资源添加成功");
        response.put("resourceId", resourceId);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getAllResources(@RequestParam String token) {
        List<ResourceResponse> resources = resourceService.getAllResources(token);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "获取资源列表成功");
        response.put("resources", resources);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{resourceId}")
    public ResponseEntity<Map<String, Object>> getResourceById(
            @PathVariable Long resourceId, 
            @RequestParam String token) {
        ResourceResponse resource = resourceService.getResourceById(resourceId, token);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "获取资源详情成功");
        response.put("resource", resource);
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{resourceId}/update")
    public ResponseEntity<Map<String, Object>> updateResource(
            @PathVariable Long resourceId, 
            @RequestBody ResourceRequest request) {
        resourceService.updateResource(resourceId, request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "资源更新成功");
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{resourceId}/delete")
    public ResponseEntity<Map<String, Object>> deleteResource(
            @PathVariable Long resourceId, 
            @RequestParam String token) {
        resourceService.deleteResource(resourceId, token);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "资源删除成功");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchResources(
            @RequestParam String keyword, 
            @RequestParam String token) {
        List<ResourceResponse> resources = resourceService.searchResources(keyword, token);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", 200);
        response.put("message", "资源搜索成功");
        response.put("resources", resources);
        
        return ResponseEntity.ok(response);
    }
} 