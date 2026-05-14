export interface Profile {
  id: number;
  bio?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Student {
  id: string;
  name: string;
  surname?: string | null;
  email: string;
  profile?: Profile;
  courses?: Course[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Assignment {
  id: number;
  title: string;
  dueDate?: string;
  course?: Course;
  createdAt: string;
  updatedAt?: string;
}

export interface Course {
  id: number;
  title: string;
  code: string;
  assignments?: Assignment[];
  students?: Student[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: number;
  email: string;
  name?: string;
  surname?: string;
  role: 'admin' | 'student';
}
