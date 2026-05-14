export interface User {
  id: number;
  fullName: string;
  email: string;
  username: string;
  role: 'ADMIN' | 'STUDENT';
  createdAt: string;
}

export interface Student {
  id: number;
  fullName: string;
  email: string;
  username: string;
  role: 'ADMIN' | 'STUDENT';
  createdAt: string;
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  instructor: string;
  createdAt: string;
  updatedAt: string;
  assignments?: Assignment[];
  students?: CourseStudent[];
}

export interface CourseStudent {
  id: number;
  name: string;
  email: string;
  profile?: Profile | null;
  createdAt: string;
}

export interface Enrollment {
  id: number;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  instructor: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DROPPED';
  enrolledAt: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  username: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  username: string;
}

export interface AuthUser {
  username: string;
  role: 'ADMIN' | 'STUDENT';
}

export interface Assignment {
  id: number;
  title: string;
  dueDate?: string;
  courseId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Profile {
  id: number;
  bio?: string;
  avatarUrl?: string;
}