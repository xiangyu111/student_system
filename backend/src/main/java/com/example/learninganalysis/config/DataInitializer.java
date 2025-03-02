package com.example.learninganalysis.config;

import com.example.learninganalysis.entity.Resource;
import com.example.learninganalysis.entity.User;
import com.example.learninganalysis.repository.ResourceRepository;
import com.example.learninganalysis.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ResourceRepository resourceRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // 初始化用户数据
        initUsers();
        
        // 初始化资源数据
        initResources();
    }
    
    private void initUsers() {
        if (userRepository.count() == 0) {
            // 创建管理员用户
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("admin");
            userRepository.save(admin);
            
            // 创建教师用户
            User teacher = new User();
            teacher.setUsername("teacher");
            teacher.setPassword(passwordEncoder.encode("teacher123"));
            teacher.setRole("teacher");
            userRepository.save(teacher);
            
            // 创建学生用户
            User student = new User();
            student.setUsername("student");
            student.setPassword(passwordEncoder.encode("student123"));
            student.setRole("student");
            userRepository.save(student);

            System.out.println("初始化用户数据完成");
        }
    }
    
    private void initResources() {
        if (resourceRepository.count() == 0) {
            List<Resource> resources = Arrays.asList(
                // 课程资源
                createResource("Java编程基础", "course", "Java编程入门课程，适合初学者", "https://www.example.com/java-basics"),
                createResource("数据结构与算法", "course", "计算机科学核心课程，讲解常用数据结构和算法", "https://www.example.com/data-structures"),
                createResource("Web前端开发", "course", "HTML、CSS和JavaScript基础教程", "https://www.example.com/web-frontend"),
                
                // 文章资源
                createResource("如何高效学习编程", "article", "分享编程学习的有效方法和技巧", "https://www.example.com/effective-learning"),
                createResource("大学生学习时间管理指南", "article", "帮助大学生合理规划学习时间", "https://www.example.com/time-management"),
                createResource("程序员职业发展路径", "article", "探讨IT行业的职业规划和发展方向", "https://www.example.com/career-path"),
                
                // 教学资源
                createResource("有效的教学方法", "teaching", "现代教育理论与实践指南", "https://www.example.com/teaching-methods"),
                createResource("学生学习动机激发技巧", "teaching", "如何提高学生的学习积极性", "https://www.example.com/motivation"),
                
                // 研究资源
                createResource("教育数据分析方法", "research", "使用数据分析改进教学效果的研究", "https://www.example.com/edu-data-analysis"),
                createResource("学习行为模式研究", "research", "学习行为与学习效果关系的研究报告", "https://www.example.com/learning-patterns")
            );
            
            resourceRepository.saveAll(resources);
            System.out.println("初始化资源数据完成");
        }
    }
    
    private Resource createResource(String name, String type, String description, String url) {
        Resource resource = new Resource();
        resource.setResourceName(name);
        resource.setResourceType(type);
        resource.setDescription(description);
        resource.setResourceUrl(url);
        return resource;
    }
} 