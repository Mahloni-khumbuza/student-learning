export interface Profile {
  id: number;
  bio?: string;
  avatarUrl?: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  profile?: Profile;
  courses?: Course[];
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: number;
  title: string;
  dueDate?: string;
  course?: Course;
  createdAt: string;
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
