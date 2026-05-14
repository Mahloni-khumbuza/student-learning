package com.deviare.studentlearningsystem.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private String instructor;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<AssignmentResponse> assignments;
    private List<StudentSummary> students;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public List<AssignmentResponse> getAssignments() { return assignments; }
    public void setAssignments(List<AssignmentResponse> assignments) { this.assignments = assignments; }
    public List<StudentSummary> getStudents() { return students; }
    public void setStudents(List<StudentSummary> students) { this.students = students; }
}