package com.example.learninganalysis.service.impl;

import com.example.learninganalysis.dto.ResourceRequest;
import com.example.learninganalysis.dto.ResourceResponse;
import com.example.learninganalysis.entity.Resource;
import com.example.learninganalysis.entity.User;
import com.example.learninganalysis.repository.ResourceRepository;
import com.example.learninganalysis.repository.UserRepository;
import com.example.learninganalysis.service.ResourceService;
import com.example.learninganalysis.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceServiceImpl implements ResourceService {
    
    @Autowired
    private ResourceRepository resourceRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    public Long addResource(ResourceRequest request) {
        // 验证管理员或教师权限
        String username = jwtUtil.getUsernameFromToken(request.getToken());
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        if (!user.getRole().equals("admin") && !user.getRole().equals("teacher")) {
            throw new RuntimeException("无权添加资源");
        }
        
        // 创建资源
        Resource resource = new Resource();
        resource.setResourceName(request.getResourceName());
        resource.setResourceType(request.getResourceType());
        resource.setDescription(request.getDescription());
        resource.setResourceUrl(request.getResourceUrl());
        resource.setCreatedAt(LocalDateTime.now());
        resource.setCreatedBy(user.getId());
        
        // 保存资源
        Resource savedResource = resourceRepository.save(resource);
        
        return savedResource.getId();
    }
    
    @Override
    public List<ResourceResponse> getAllResources(String token) {
        // 验证用户
        jwtUtil.getUsernameFromToken(token);
        
        // 获取所有资源
        List<Resource> resources = resourceRepository.findAll();
        
        // 转换为响应对象
        return resources.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    @Override
    public ResourceResponse getResourceById(Long resourceId, String token) {
        // 验证用户
        jwtUtil.getUsernameFromToken(token);
        
        // 获取资源
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("资源不存在"));
        
        // 转换为响应对象
        return convertToResponse(resource);
    }
    
    @Override
    public void updateResource(Long resourceId, ResourceRequest request) {
        // 验证管理员或教师权限
        String username = jwtUtil.getUsernameFromToken(request.getToken());
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        if (!user.getRole().equals("admin") && !user.getRole().equals("teacher")) {
            throw new RuntimeException("无权更新资源");
        }
        
        // 获取资源
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("资源不存在"));
        
        // 更新资源
        resource.setResourceName(request.getResourceName());
        resource.setResourceType(request.getResourceType());
        resource.setDescription(request.getDescription());
        resource.setResourceUrl(request.getResourceUrl());
        
        // 保存资源
        resourceRepository.save(resource);
    }
    
    @Override
    public void deleteResource(Long resourceId, String token) {
        // 验证管理员或教师权限
        String username = jwtUtil.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        if (!user.getRole().equals("admin") && !user.getRole().equals("teacher")) {
            throw new RuntimeException("无权删除资源");
        }
        
        // 获取资源
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("资源不存在"));
        
        // 删除资源
        resourceRepository.delete(resource);
    }
    
    @Override
    public List<ResourceResponse> searchResources(String keyword, String token) {
        // 验证用户
        jwtUtil.getUsernameFromToken(token);
        
        // 搜索资源
        List<Resource> resources = resourceRepository.findByResourceNameContainingOrDescriptionContaining(keyword, keyword);
        
        // 转换为响应对象
        return resources.stream().map(this::convertToResponse).collect(Collectors.toList());
    }
    
    // 辅助方法：将实体转换为响应对象
    private ResourceResponse convertToResponse(Resource resource) {
        ResourceResponse response = new ResourceResponse();
        response.setResourceId(resource.getId());
        response.setResourceName(resource.getResourceName());
        response.setResourceType(resource.getResourceType());
        response.setDescription(resource.getDescription());
        response.setLink(resource.getResourceUrl());
        return response;
    }
} 