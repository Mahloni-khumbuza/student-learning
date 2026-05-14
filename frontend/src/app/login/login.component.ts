import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  mode: 'login' | 'register' = 'login';
  form = { fullName: '', email: '', username: '', password: '', role: 'STUDENT' };
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  setRole(role: 'STUDENT' | 'ADMIN'): void {
    this.form.role = role;
    this.error = '';
  }

  submit(): void {
    this.loading = true;
    this.error = '';

    if (this.mode === 'register') {
      this.auth.register(
        this.form.fullName,
        this.form.email,
        this.form.username,
        this.form.password,
        this.form.role
      ).subscribe({
        next: () => this.router.navigate(['/courses']),
        error: (err) => this.handleError(err),
      });
      return;
    }

    this.auth.login(this.form.username, this.form.password).subscribe({
      next: () => this.router.navigate(['/courses']),
      error: (err) => this.handleError(err),
    });
  }

  private handleError(err: any): void {
    const msg = err.error?.message;
    this.error = Array.isArray(msg) ? msg.join(', ') : (msg || 'Authentication failed.');
    this.loading = false;
  }

  toggle(): void {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.error = '';
  }
}