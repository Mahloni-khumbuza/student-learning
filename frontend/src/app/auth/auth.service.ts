import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthUser } from '../models/models';

const BASE = 'http://localhost:3001';
const TOKEN_KEY = 'sls_token';

function decodePayload(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      surname: payload.surname,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<AuthUser | null>(this.loadUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  private loadUser(): AuthUser | null {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? decodePayload(token) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.userSubject.value?.role === 'admin';
  }

  get currentUser(): AuthUser | null {
    return this.userSubject.value;
  }

  displayName(): string {
    const u = this.userSubject.value;
    if (!u) return '';
    const full = [u.name, u.surname].filter(Boolean).join(' ').trim();
    return full || u.email;
  }

  login(email: string, password: string): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${BASE}/auth/login`, { email, password }).pipe(
      tap(({ accessToken }) => this.setToken(accessToken)),
    );
  }

  register(
    email: string,
    password: string,
    role: string,
    name?: string,
    surname?: string,
  ): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${BASE}/auth/register`, {
      email, password, role, name, surname,
    }).pipe(
      tap(({ accessToken }) => this.setToken(accessToken)),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.userSubject.next(null);
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.userSubject.next(decodePayload(token));
  }
}
