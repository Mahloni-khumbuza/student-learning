import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student, Course, Assignment, Profile } from '../models/models';

const BASE = 'http://localhost:3001';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // Students
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${BASE}/students`);
  }
  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${BASE}/students/${id}`);
  }
  createStudent(data: { name: string; surname?: string; email: string }): Observable<Student> {
    return this.http.post<Student>(`${BASE}/students`, data);
  }
  updateStudent(id: number, data: Partial<{ name: string; surname: string; email: string }>): Observable<Student> {
    return this.http.patch<Student>(`${BASE}/students/${id}`, data);
  }
  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/students/${id}`);
  }
  enrollStudent(studentId: number, courseId: number): Observable<Student> {
    return this.http.post<Student>(`${BASE}/students/${studentId}/enroll/${courseId}`, {});
  }
  unenrollStudent(studentId: number, courseId: number): Observable<Student> {
    return this.http.delete<Student>(`${BASE}/students/${studentId}/unenroll/${courseId}`);
  }
  getAllEnrollments(): Observable<Student[]> {
    return this.http.get<Student[]>(`${BASE}/students/enrollments`);
  }

  // Profiles
  createProfile(data: { studentId: number; bio?: string; avatarUrl?: string }): Observable<Profile> {
    return this.http.post<Profile>(`${BASE}/profiles`, data);
  }
  updateProfile(id: number, data: Partial<{ bio: string; avatarUrl: string }>): Observable<Profile> {
    return this.http.patch<Profile>(`${BASE}/profiles/${id}`, data);
  }
  deleteProfile(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/profiles/${id}`);
  }

  // Courses
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${BASE}/courses`);
  }
  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`${BASE}/courses/${id}`);
  }
  createCourse(data: { title: string; code: string }): Observable<Course> {
    return this.http.post<Course>(`${BASE}/courses`, data);
  }
  updateCourse(id: number, data: Partial<{ title: string; code: string }>): Observable<Course> {
    return this.http.patch<Course>(`${BASE}/courses/${id}`, data);
  }
  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/courses/${id}`);
  }

  // Assignments
  createAssignment(data: { title: string; dueDate?: string; courseId: number }): Observable<Assignment> {
    return this.http.post<Assignment>(`${BASE}/assignments`, data);
  }
  updateAssignment(id: number, data: Partial<{ title: string; dueDate: string }>): Observable<Assignment> {
    return this.http.patch<Assignment>(`${BASE}/assignments/${id}`, data);
  }
  deleteAssignment(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/assignments/${id}`);
  }
}
