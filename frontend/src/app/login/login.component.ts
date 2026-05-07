import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  mode: 'login' | 'register' = 'login';
  form = { email: '', password: '', role: 'student', name: '', surname: '' };
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  setRole(role: 'student' | 'admin'): void {
    this.form.role = role;
    this.error = '';
  }

  submit(): void {
    this.loading = true;
    this.error = '';

    if (this.mode === 'register') {
      this.auth.register(
        this.form.email,
        this.form.password,
        this.form.role,
        this.form.name,
        this.form.surname,
      ).subscribe({
        next: () => this.router.navigate(['/students']),
        error: (err) => this.handleError(err),
      });
      return;
    }

    this.auth.login(this.form.email, this.form.password).subscribe({
      next: () => {
        const actualRole = this.auth.currentUser?.role;
        if (actualRole !== this.form.role) {
          this.auth.logout();
          this.error = `This account is not registered as a${this.form.role === 'admin' ? 'n admin' : ' student'}.`;
          this.loading = false;
          return;
        }
        this.router.navigate(['/students']);
      },
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
