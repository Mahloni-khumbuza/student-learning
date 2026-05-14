import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/models';

const BASE = 'http://localhost:8080/api';
const TOKEN_KEY = 'token';

export interface AuthUser {
  username: string;
  role: 'ADMIN' | 'STUDENT';
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private userSubject = new BehaviorSubject<AuthUser | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  private loadUser(): AuthUser | null {
    const token = localStorage.getItem(TOKEN_KEY);
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    if (token && role && username) {
      return { username, role: role as 'ADMIN' | 'STUDENT' };
    }
    return null;
  }

  get currentUser(): AuthUser | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  isAdmin(): boolean {
    return this.userSubject.value?.role === 'ADMIN';
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  displayName(): string {
    return this.userSubject.value?.username || '';
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${BASE}/auth/login`, { username, password }).pipe(
      tap(res => this.setSession(res))
    );
  }

  register(
    fullName: string,
    email: string,
    username: string,
    password: string,
    role: string = 'STUDENT'
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${BASE}/auth/register`, {
      fullName, email, username, password,
      role: role.toUpperCase()
    }).pipe(
      tap(res => this.setSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  private setSession(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem('role', res.role);
    localStorage.setItem('username', res.username);
    this.userSubject.next({ username: res.username, role: res.role as 'ADMIN' | 'STUDENT' });
  }
}