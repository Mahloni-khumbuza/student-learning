package com.deviare.studentlearningsystem.dto;

import jakarta.validation.constraints.NotNull;

public class EnrollmentRequest {
    @NotNull(message = "Course ID is required")
    private Long courseId;

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
}