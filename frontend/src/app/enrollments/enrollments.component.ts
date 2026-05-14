import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import { Enrollment, Course } from '../models/models';

@Component({
  selector: 'app-enrollments',
  templateUrl: './enrollments.component.html',
})
export class EnrollmentsComponent implements OnInit {
  enrollments: Enrollment[] = [];
  courses: Course[] = [];
  loading = true;
  error = '';
  enrolling = false;
  selectedCourseId: number | null = null;

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.getMyEnrollments().subscribe({
      next: (data) => { this.enrollments = data; this.loading = false; },
      error: () => { this.error = 'Failed to load enrollments.'; this.loading = false; },
    });
    this.api.getCourses().subscribe({
      next: (data) => this.courses = data,
    });
  }

  enroll(): void {
    if (!this.selectedCourseId) return;
    this.enrolling = true;
    this.error = '';
    this.api.enroll(this.selectedCourseId).subscribe({
      next: () => { this.enrolling = false; this.selectedCourseId = null; this.load(); },
      error: (err) => {
        this.error = err.error?.message || 'Failed to enroll.';
        this.enrolling = false;
      },
    });
  }
}