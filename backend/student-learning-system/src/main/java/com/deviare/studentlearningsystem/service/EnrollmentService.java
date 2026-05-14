package com.deviare.studentlearningsystem.service;

import com.deviare.studentlearningsystem.dto.EnrollmentRequest;
import com.deviare.studentlearningsystem.dto.EnrollmentResponse;
import com.deviare.studentlearningsystem.entity.*;
import com.deviare.studentlearningsystem.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             UserRepository userRepository,
                             CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    public EnrollmentResponse enroll(String username, EnrollmentRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (enrollmentRepository.existsByUserAndCourse(user, course))
            throw new RuntimeException("Already enrolled in this course");

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        return mapToResponse(enrollmentRepository.save(enrollment));
    }

    public List<EnrollmentResponse> getMyEnrollments(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return enrollmentRepository.findByUser(user)
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<EnrollmentResponse> getCourseEnrollments(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return enrollmentRepository.findByCourse(course)
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private EnrollmentResponse mapToResponse(Enrollment enrollment) {
        EnrollmentResponse response = new EnrollmentResponse();
        response.setId(enrollment.getId());
        response.setStudentName(enrollment.getUser().getFullName());
        response.setStudentEmail(enrollment.getUser().getEmail());
        response.setCourseTitle(enrollment.getCourse().getTitle());
        response.setInstructor(enrollment.getCourse().getInstructor());
        response.setStatus(enrollment.getStatus().name());
        response.setEnrolledAt(enrollment.getEnrolledAt());
        return response;
    }
}