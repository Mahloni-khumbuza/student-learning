import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import { Course } from '../models/models';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  loading = true;
  error = '';
  showForm = false;
  editing: Course | null = null;
  form = { title: '', description: '', instructor: '' };
  submitting = false;

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.getCourses().subscribe({
      next: (data) => { this.courses = data; this.loading = false; },
      error: () => { this.error = 'Failed to load courses.'; this.loading = false; },
    });
  }

  openAdd(): void {
    this.editing = null;
    this.form = { title: '', description: '', instructor: '' };
    this.error = '';
    this.showForm = true;
  }

  openEdit(c: Course): void {
    this.editing = c;
    this.form = { title: c.title, description: c.description || '', instructor: c.instructor };
    this.error = '';
    this.showForm = true;
  }

  cancel(): void {
    this.showForm = false;
    this.editing = null;
    this.error = '';
  }

  submit(): void {
    this.submitting = true;
    this.error = '';
    const req = this.editing
      ? this.api.updateCourse(this.editing.id, this.form)
      : this.api.createCourse(this.form);

    req.subscribe({
      next: () => { this.cancel(); this.load(); this.submitting = false; },
      error: (err) => {
        const msg = err.error?.message;
        this.error = Array.isArray(msg) ? msg.join(', ') : (msg || 'An error occurred.');
        this.submitting = false;
      },
    });
  }

  deleteCourse(c: Course): void {
    if (!confirm(`Delete course "${c.title}"?`)) return;
    this.api.deleteCourse(c.id).subscribe({
      next: () => this.load(),
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete course.';
      },
    });
  }
}