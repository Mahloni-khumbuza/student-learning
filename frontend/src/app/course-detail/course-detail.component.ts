import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Course, Assignment } from '../models/models';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  loading = true;
  error = '';

  showAssignmentForm = false;
  editingAssignment: Assignment | null = null;
  assignmentForm = { title: '', dueDate: '' };
  assignmentSubmitting = false;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCourse(id);
  }

  loadCourse(id: number): void {
    this.api.getCourse(id).subscribe({
      next: (c) => { this.course = c; this.loading = false; },
      error: () => { this.error = 'Course not found.'; this.loading = false; },
    });
  }

  openAddAssignment(): void {
    this.editingAssignment = null;
    this.assignmentForm = { title: '', dueDate: '' };
    this.showAssignmentForm = true;
  }

  openEditAssignment(a: Assignment): void {
    this.editingAssignment = a;
    this.assignmentForm = { title: a.title, dueDate: a.dueDate || '' };
    this.showAssignmentForm = true;
  }

  cancelAssignment(): void {
    this.showAssignmentForm = false;
    this.editingAssignment = null;
  }

  saveAssignment(): void {
    if (!this.course) return;
    this.assignmentSubmitting = true;
    const req = this.editingAssignment
      ? this.api.updateAssignment(this.editingAssignment.id, this.assignmentForm)
      : this.api.createAssignment({ ...this.assignmentForm, courseId: this.course.id });

    req.subscribe({
      next: () => {
        this.cancelAssignment();
        this.assignmentSubmitting = false;
        this.loadCourse(this.course!.id);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to save assignment.';
        this.assignmentSubmitting = false;
      },
    });
  }

  deleteAssignment(a: Assignment): void {
    if (!confirm(`Delete assignment "${a.title}"? This cannot be undone.`)) return;
    this.api.deleteAssignment(a.id).subscribe({
      next: () => this.loadCourse(this.course!.id),
      error: () => { this.error = 'Failed to delete assignment.'; },
    });
  }
}
