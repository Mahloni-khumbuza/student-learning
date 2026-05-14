import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
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
  successMessage = '';
  selectedStudentId: string | null = null;
  selectedCourseIds: number[] = [];
  submitting = false;

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
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

  get availableCourses(): Course[] {
    if (!this.selectedStudentId) return this.courses;
    const student = this.students.find(s => s.id === this.selectedStudentId);
    if (!student) return this.courses;
    const enrolledIds = (student.courses || []).map(c => c.id);
    return this.courses.filter(c => !enrolledIds.includes(c.id));
  }

  onStudentChange(): void {
    this.selectedCourseIds = [];
    this.error = '';
    this.successMessage = '';
  }

  toggleCourse(courseId: number): void {
    const idx = this.selectedCourseIds.indexOf(courseId);
    if (idx >= 0) this.selectedCourseIds.splice(idx, 1);
    else this.selectedCourseIds.push(courseId);
  }

  isCourseSelected(courseId: number): boolean {
    return this.selectedCourseIds.includes(courseId);
  }

  enroll(): void {
    if (!this.selectedStudentId || this.selectedCourseIds.length === 0) return;
    this.submitting = true;
    this.error = '';
    this.successMessage = '';

    const studentId = this.selectedStudentId;
    const requests = this.selectedCourseIds.map(courseId =>
      this.api.enrollStudent(studentId, courseId).pipe(
        map(() => ({ courseId, success: true, message: '' })),
        catchError((err) => of({
          courseId,
          success: false,
          message: err.error?.message || 'Failed',
        })),
      ),
    );

    forkJoin(requests).subscribe((results) => {
      const succeeded = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success);

      if (failed.length === 0) {
        this.successMessage = `Successfully enrolled in ${succeeded} course${succeeded !== 1 ? 's' : ''}.`;
      } else if (succeeded === 0) {
        this.error = `Could not enroll: ${failed.map(f => f.message).join('; ')}`;
      } else {
        this.successMessage = `Enrolled in ${succeeded} course${succeeded !== 1 ? 's' : ''}.`;
        this.error = `${failed.length} failed: ${failed.map(f => f.message).join('; ')}`;
      }

      this.selectedStudentId = null;
      this.selectedCourseIds = [];
      this.submitting = false;
      this.load();
    });
  }

  unenroll(studentId: string, courseId: number, studentName: string, courseTitle: string): void {
    if (!confirm(`Remove "${studentName}" from "${courseTitle}"?`)) return;
    this.api.unenrollStudent(studentId, courseId).subscribe({
      next: () => this.load(),
      error: () => { this.error = 'Failed to remove enrollment.'; },
    });
  }
}
