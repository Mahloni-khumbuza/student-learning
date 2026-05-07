import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import { Student, Course } from '../models/models';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
})
export class StudentDetailComponent implements OnInit {
  student: Student | null = null;
  allCourses: Course[] = [];
  loading = true;
  error = '';

  showProfileForm = false;
  profileForm = { bio: '', avatarUrl: '' };
  profileSubmitting = false;

  selectedCourseId: number | null = null;
  enrolling = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadStudent(id);
    this.api.getCourses().subscribe({ next: (c) => (this.allCourses = c) });
  }

  loadStudent(id: number): void {
    this.loading = true;
    this.api.getStudent(id).subscribe({
      next: (s) => { this.student = s; this.loading = false; },
      error: (err) => {
        this.error = err.status === 404 ? 'Student not found.' : 'Failed to load student.';
        this.loading = false;
      },
    });
  }

  openProfileForm(): void {
    this.profileForm = {
      bio: this.student?.profile?.bio || '',
      avatarUrl: this.student?.profile?.avatarUrl || '',
    };
    this.showProfileForm = true;
  }

  saveProfile(): void {
    if (!this.student) return;
    this.profileSubmitting = true;
    const req = this.student.profile
      ? this.api.updateProfile(this.student.profile.id, this.profileForm)
      : this.api.createProfile({ studentId: this.student.id, ...this.profileForm });

    req.subscribe({
      next: () => {
        this.showProfileForm = false;
        this.profileSubmitting = false;
        this.loadStudent(this.student!.id);
      },
      error: (err) => {
        const msg = err.error?.message;
        this.error = Array.isArray(msg) ? msg.join(', ') : (msg || 'Failed to save profile.');
        this.profileSubmitting = false;
      },
    });
  }

  deleteProfile(): void {
    if (!this.student?.profile || !confirm('Delete this profile?')) return;
    this.api.deleteProfile(this.student.profile.id).subscribe({
      next: () => this.loadStudent(this.student!.id),
      error: () => { this.error = 'Failed to delete profile.'; },
    });
  }

  enroll(): void {
    if (!this.student || !this.selectedCourseId) return;
    this.enrolling = true;
    this.api.enrollStudent(this.student.id, this.selectedCourseId).subscribe({
      next: (s) => { this.student = s; this.enrolling = false; this.selectedCourseId = null; },
      error: (err) => {
        const msg = err.error?.message;
        this.error = Array.isArray(msg) ? msg.join(', ') : (msg || 'Failed to enroll.');
        this.enrolling = false;
      },
    });
  }

  unenroll(courseId: number, courseTitle: string): void {
    if (!this.student || !confirm(`Remove from "${courseTitle}"?`)) return;
    this.api.unenrollStudent(this.student.id, courseId).subscribe({
      next: (s) => (this.student = s),
      error: () => { this.error = 'Failed to unenroll.'; },
    });
  }

  get availableCourses(): Course[] {
    const enrolled = (this.student?.courses || []).map(c => c.id);
    return this.allCourses.filter(c => !enrolled.includes(c.id));
  }
}
