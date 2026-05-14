package com.deviare.studentlearningsystem.service;

import com.deviare.studentlearningsystem.dto.AssignmentRequest;
import com.deviare.studentlearningsystem.dto.AssignmentResponse;
import com.deviare.studentlearningsystem.dto.AssignmentUpdateRequest;
import com.deviare.studentlearningsystem.entity.Assignment;
import com.deviare.studentlearningsystem.entity.Course;
import com.deviare.studentlearningsystem.repository.AssignmentRepository;
import com.deviare.studentlearningsystem.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;

    public AssignmentService(AssignmentRepository assignmentRepository,
                             CourseRepository courseRepository) {
        this.assignmentRepository = assignmentRepository;
        this.courseRepository = courseRepository;
    }

    public List<AssignmentResponse> getByCourse(Long courseId) {
        return assignmentRepository.findByCourseId(courseId)
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AssignmentResponse create(AssignmentRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        if (course.isDeleted()) throw new RuntimeException("Course not found");

        Assignment assignment = new Assignment();
        assignment.setTitle(request.getTitle());
        assignment.setDueDate(request.getDueDate());
        assignment.setCourse(course);
        return mapToResponse(assignmentRepository.save(assignment));
    }

    public AssignmentResponse update(Long id, AssignmentUpdateRequest request) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        assignment.setTitle(request.getTitle());
        assignment.setDueDate(request.getDueDate());
        return mapToResponse(assignmentRepository.save(assignment));
    }

    public void delete(Long id) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        assignmentRepository.delete(assignment);
    }

    AssignmentResponse mapToResponse(Assignment a) {
        AssignmentResponse r = new AssignmentResponse();
        r.setId(a.getId());
        r.setTitle(a.getTitle());
        r.setDueDate(a.getDueDate());
        r.setCourseId(a.getCourse() != null ? a.getCourse().getId() : null);
        r.setCreatedAt(a.getCreatedAt());
        r.setUpdatedAt(a.getUpdatedAt());
        return r;
    }
}
