package com.example.learninganalysis.repository;

import com.example.learninganalysis.entity.Class;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassRepository extends JpaRepository<Class, Long> {
    
    /**
     * 检查指定ID的班级是否由指定ID的教师负责
     * 
     * @param id 班级ID
     * @param teacherId 教师ID
     * @return 如果班级由该教师负责则返回true，否则返回false
     */
    boolean existsByIdAndTeacherId(Long id, Long teacherId);
    
    /**
     * 查询指定教师负责的所有班级
     * 
     * @param teacherId 教师ID
     * @return 班级列表
     */
    List<Class> findByTeacherId(Long teacherId);
} 