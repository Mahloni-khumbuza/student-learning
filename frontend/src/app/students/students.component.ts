import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import { Student } from '../models/models';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  loading = true;
  error = '';
  showForm = false;
  editing: Student | null = null;
  form = { name: '', surname: '', email: '' };
  submitting = false;

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.getStudents().subscribe({
      next: (data) => { this.students = data; this.loading = false; },
      error: () => { this.error = 'Failed to load students.'; this.loading = false; },
    });
  }

  openAdd(): void {
    this.editing = null;
    this.form = { name: '', surname: '', email: '' };
    this.error = '';
    this.showForm = true;
  }

  openEdit(s: Student): void {
    this.editing = s;
    this.form = { name: s.name, surname: s.surname || '', email: s.email };
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
      ? this.api.updateStudent(this.editing.id, this.form)
      : this.api.createStudent(this.form);

    req.subscribe({
      next: () => { this.cancel(); this.load(); this.submitting = false; },
      error: (err) => {
        const msg = err.error?.message;
        this.error = Array.isArray(msg) ? msg.join(', ') : (msg || 'An error occurred.');
        this.submitting = false;
      },
    });
  }

  deleteStudent(s: Student): void {
    if (!confirm(`Soft-delete student "${s.name}"?\nThey can be restored later.`)) return;
    this.api.deleteStudent(s.id).subscribe({
      next: () => this.load(),
      error: (err) => {
        const msg = err.error?.message || 'Failed to delete student.';
        this.error = Array.isArray(msg) ? msg.join(', ') : msg;
      },
    });
  }
}
