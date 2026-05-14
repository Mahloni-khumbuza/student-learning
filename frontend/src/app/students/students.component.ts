import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/models';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
})
export class StudentsComponent implements OnInit {
  students: User[] = [];
  loading = true;
  error = '';

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.getUsers().subscribe({
      next: (data) => {
        this.students = data.filter(u => u.role === 'STUDENT');
        this.loading = false;
      },
      error: () => { this.error = 'Failed to load students.'; this.loading = false; },
    });
  }
}