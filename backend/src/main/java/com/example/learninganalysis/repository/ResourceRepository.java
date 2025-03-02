package com.example.learninganalysis.repository;

import com.example.learninganalysis.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByResourceNameContainingOrDescriptionContaining(String name, String description);
    
    @Query("SELECT r FROM Resource r ORDER BY r.averageRating DESC NULLS LAST")
    List<Resource> findTopRatedResources(int limit);
    
    @Query("SELECT r FROM Resource r ORDER BY r.createdAt DESC")
    List<Resource> findRecentResources(int limit);
    
    @Query("SELECT r FROM Resource r WHERE r.resourceType = :resourceType")
    List<Resource> findByResourceType(@Param("resourceType") String resourceType);
} 