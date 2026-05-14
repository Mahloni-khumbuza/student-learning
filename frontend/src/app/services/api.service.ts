import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Course, Enrollment, Assignment, AuthRequest, RegisterRequest, AuthResponse } from '../models/models';

const BASE = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  // Auth
  login(data: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${BASE}/auth/login`, data);
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${BASE}/auth/register`, data);
  }

  // Users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${BASE}/users`, { headers: this.getHeaders() });
  }

  getMyProfile(): Observable<User> {
    return this.http.get<User>(`${BASE}/users/me`, { headers: this.getHeaders() });
  }

  // Courses
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${BASE}/courses`, { headers: this.getHeaders() });
  }

  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`${BASE}/courses/${id}`, { headers: this.getHeaders() });
  }

  createCourse(data: { title: string; description?: string; instructor: string }): Observable<Course> {
    return this.http.post<Course>(`${BASE}/courses`, data, { headers: this.getHeaders() });
  }

  updateCourse(id: number, data: { title: string; description?: string; instructor: string }): Observable<Course> {
    return this.http.put<Course>(`${BASE}/courses/${id}`, data, { headers: this.getHeaders() });
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/courses/${id}`, { headers: this.getHeaders() });
  }

  // Enrollments
  enroll(courseId: number): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${BASE}/enrollments`, { courseId }, { headers: this.getHeaders() });
  }

  getMyEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${BASE}/enrollments/my`, { headers: this.getHeaders() });
  }

  getCourseEnrollments(courseId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${BASE}/enrollments/course/${courseId}`, { headers: this.getHeaders() });
  }

  // Assignments
  getCourseAssignments(courseId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${BASE}/assignments/course/${courseId}`, { headers: this.getHeaders() });
  }

  createAssignment(data: { title: string; dueDate?: string; courseId: number }): Observable<Assignment> {
    return this.http.post<Assignment>(`${BASE}/assignments`, data, { headers: this.getHeaders() });
  }

  updateAssignment(id: number, data: { title: string; dueDate?: string }): Observable<Assignment> {
    return this.http.put<Assignment>(`${BASE}/assignments/${id}`, data, { headers: this.getHeaders() });
  }

  deleteAssignment(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/assignments/${id}`, { headers: this.getHeaders() });
  }
}