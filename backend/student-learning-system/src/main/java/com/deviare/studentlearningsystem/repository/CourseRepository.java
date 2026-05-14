package com.deviare.studentlearningsystem.repository;

import com.deviare.studentlearningsystem.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByDeletedFalse();
    List<Course> findByInstructorAndDeletedFalse(String instructor);
}