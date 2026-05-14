import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import { User, Course, Enrollment } from '../models/models';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
})
export class StudentDetailComponent implements OnInit {
  student: User | null = null;
  enrollments: Enrollment[] = [];
  courses: Course[] = [];
  loading = true;
  error = '';
  selectedCourseId: number | null = null;
  enrolling = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getMyProfile().subscribe({
      next: (data) => { this.student = data; this.loading = false; },
      error: () => { this.error = 'Failed to load profile.'; this.loading = false; },
    });

    this.api.getMyEnrollments().subscribe({
      next: (data) => this.enrollments = data,
    });

    this.api.getCourses().subscribe({
      next: (data) => this.courses = data,
    });
  }

  enroll(): void {
    if (!this.selectedCourseId) return;
    this.enrolling = true;
    this.api.enroll(this.selectedCourseId).subscribe({
      next: () => { this.enrolling = false; this.selectedCourseId = null; this.load(); },
      error: (err) => {
        this.error = err.error?.message || 'Failed to enroll.';
        this.enrolling = false;
      },
    });
  }
}