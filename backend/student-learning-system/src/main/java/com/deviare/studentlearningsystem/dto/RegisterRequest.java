package com.deviare.studentlearningsystem.dto;

import jakarta.validation.constraints.*;

public class RegisterRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;
    @NotBlank @Email(message = "Email must be valid")
    private String email;
    @NotBlank @Size(min = 3, max = 50)
    private String username;
    @NotBlank @Size(min = 6)
    private String password;
    private String role;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}