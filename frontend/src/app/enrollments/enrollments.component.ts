import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from '../services/api.service';
import { Student, Course } from '../models/models';

@Component({
  selector: 'app-enrollments',
  templateUrl: './enrollments.component.html',
})
export class EnrollmentsComponent implements OnInit {
  students: Student[] = [];
  courses: Course[] = [];
  loading = true;
  error = '';
  selectedStudentId: number | null = null;
  selectedCourseId: number | null = null;
  submitting = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    forkJoin([this.api.getAllEnrollments(), this.api.getCourses()]).subscribe({
      next: ([students, courses]) => {
        this.students = students;
        this.courses = courses;
        this.loading = false;
      },
      error: () => { this.error = 'Failed to load data.'; this.loading = false; },
    });
  }

  get allEnrollments(): { student: Student; course: Course }[] {
    return this.students.flatMap(s =>
      (s.courses || []).map(c => ({ student: s, course: c }))
    );
  }

  enroll(): void {
    if (!this.selectedStudentId || !this.selectedCourseId) return;
    this.submitting = true;
    this.error = '';
    this.api.enrollStudent(this.selectedStudentId, this.selectedCourseId).subscribe({
      next: () => {
        this.selectedStudentId = null;
        this.selectedCourseId = null;
        this.submitting = false;
        this.load();
      },
      error: (err) => {
        const msg = err.error?.message;
        this.error = Array.isArray(msg) ? msg.join(', ') : (msg || 'Failed to enroll.');
        this.submitting = false;
      },
    });
  }

  unenroll(studentId: number, courseId: number, studentName: string, courseTitle: string): void {
    if (!confirm(`Remove "${studentName}" from "${courseTitle}"?`)) return;
    this.api.unenrollStudent(studentId, courseId).subscribe({
      next: () => this.load(),
      error: () => { this.error = 'Failed to remove enrollment.'; },
    });
  }
}
