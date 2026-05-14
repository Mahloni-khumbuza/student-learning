package com.deviare.studentlearningsystem.service;

import com.deviare.studentlearningsystem.dto.AssignmentResponse;
import com.deviare.studentlearningsystem.dto.CourseRequest;
import com.deviare.studentlearningsystem.dto.CourseResponse;
import com.deviare.studentlearningsystem.dto.StudentSummary;
import com.deviare.studentlearningsystem.entity.Assignment;
import com.deviare.studentlearningsystem.entity.Course;
import com.deviare.studentlearningsystem.entity.Enrollment;
import com.deviare.studentlearningsystem.entity.User;
import com.deviare.studentlearningsystem.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final AssignmentService assignmentService;

    public CourseService(CourseRepository courseRepository,
                         AssignmentService assignmentService) {
        this.courseRepository = courseRepository;
        this.assignmentService = assignmentService;
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getAllCourses() {
        return courseRepository.findByDeletedFalse()
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        if (course.isDeleted()) throw new RuntimeException("Course not found");
        return mapToResponse(course);
    }

    public CourseResponse createCourse(CourseRequest request) {
        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setInstructor(request.getInstructor());
        return mapToResponse(courseRepository.save(course));
    }

    public CourseResponse updateCourse(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setInstructor(request.getInstructor());
        return mapToResponse(courseRepository.save(course));
    }

    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setDeleted(true);
        courseRepository.save(course);
    }

    private CourseResponse mapToResponse(Course course) {
        CourseResponse response = new CourseResponse();
        response.setId(course.getId());
        response.setTitle(course.getTitle());
        response.setDescription(course.getDescription());
        response.setInstructor(course.getInstructor());
        response.setCreatedAt(course.getCreatedAt());
        response.setUpdatedAt(course.getUpdatedAt());

        List<Assignment> assignments = course.getAssignments();
        List<AssignmentResponse> assignmentResponses = assignments == null
                ? Collections.emptyList()
                : assignments.stream().map(assignmentService::mapToResponse).collect(Collectors.toList());
        response.setAssignments(assignmentResponses);

        List<Enrollment> enrollments = course.getEnrollments();
        List<StudentSummary> students = enrollments == null
                ? Collections.emptyList()
                : enrollments.stream()
                    .filter(e -> e.getStatus() == Enrollment.Status.ACTIVE)
                    .map(Enrollment::getUser)
                    .filter(u -> u != null)
                    .distinct()
                    .map(this::toStudentSummary)
                    .collect(Collectors.toList());
        response.setStudents(students);

        return response;
    }

    private StudentSummary toStudentSummary(User user) {
        StudentSummary s = new StudentSummary();
        s.setId(user.getId());
        s.setName(user.getFullName());
        s.setEmail(user.getEmail());
        s.setProfile(null);
        s.setCreatedAt(user.getCreatedAt());
        return s;
    }
}
