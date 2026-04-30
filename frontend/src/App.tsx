import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import StudentsPage from './pages/StudentsPage';
import StudentDetail from './pages/StudentDetail';
import CoursesPage from './pages/CoursesPage';
import CourseDetail from './pages/CourseDetail';
import EnrollmentsPage from './pages/EnrollmentsPage';

export default function App() {
  return (
    <>
      <nav className="navbar">
        <span className="navbar-brand">Student Learning System</span>
        <NavLink to="/students" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Students
        </NavLink>
        <NavLink to="/courses" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Courses
        </NavLink>
        <NavLink to="/enrollments" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Enrollments
        </NavLink>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<StudentsPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/enrollments" element={<EnrollmentsPage />} />
        </Routes>
      </main>
    </>
  );
}
