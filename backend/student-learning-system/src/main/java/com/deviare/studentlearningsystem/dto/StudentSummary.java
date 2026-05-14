package com.deviare.studentlearningsystem.dto;

import java.time.LocalDateTime;

public class StudentSummary {
    private Long id;
    private String name;
    private String email;
    private Object profile;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Object getProfile() { return profile; }
    public void setProfile(Object profile) { this.profile = profile; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
