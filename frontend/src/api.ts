import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001' });

// Students
export const getStudents = () => api.get('/students');
export const getStudent = (id: number) => api.get(`/students/${id}`);
export const createStudent = (data: { name: string; email: string }) => api.post('/students', data);
export const updateStudent = (id: number, data: { name?: string; email?: string }) => api.patch(`/students/${id}`, data);
export const deleteStudent = (id: number) => api.delete(`/students/${id}`);
export const enrollStudent = (studentId: number, courseId: number) => api.post(`/students/${studentId}/enroll/${courseId}`);
export const unenrollStudent = (studentId: number, courseId: number) => api.delete(`/students/${studentId}/unenroll/${courseId}`);
export const getAllEnrollments = () => api.get('/students/enrollments');

// Profiles
export const createProfile = (data: { studentId: number; bio?: string; avatarUrl?: string }) => api.post('/profiles', data);
export const updateProfile = (id: number, data: { bio?: string; avatarUrl?: string }) => api.patch(`/profiles/${id}`, data);
export const deleteProfile = (id: number) => api.delete(`/profiles/${id}`);

// Courses
export const getCourses = () => api.get('/courses');
export const getCourse = (id: number) => api.get(`/courses/${id}`);
export const createCourse = (data: { title: string; code: string }) => api.post('/courses', data);
export const updateCourse = (id: number, data: { title?: string; code?: string }) => api.patch(`/courses/${id}`, data);
export const deleteCourse = (id: number) => api.delete(`/courses/${id}`);

// Assignments
export const createAssignment = (data: { title: string; dueDate?: string; courseId: number }) => api.post('/assignments', data);
export const updateAssignment = (id: number, data: { title?: string; dueDate?: string }) => api.patch(`/assignments/${id}`, data);
export const deleteAssignment = (id: number) => api.delete(`/assignments/${id}`);
