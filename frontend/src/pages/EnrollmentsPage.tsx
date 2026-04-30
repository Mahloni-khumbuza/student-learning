import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllEnrollments, getCourses, enrollStudent, unenrollStudent } from '../api';
import { Student, Course } from '../types';

export default function EnrollmentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const [sRes, cRes] = await Promise.all([getAllEnrollments(), getCourses()]);
      setStudents(sRes.data);
      setCourses(cRes.data);
    } catch {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  }

  async function handleEnroll(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStudent || !selectedCourse) return;
    setSubmitting(true);
    setError('');
    try {
      await enrollStudent(Number(selectedStudent), Number(selectedCourse));
      setSelectedStudent('');
      setSelectedCourse('');
      load();
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg || 'Failed to enroll.'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUnenroll(studentId: number, courseId: number, studentName: string, courseTitle: string) {
    if (!window.confirm(`Remove "${studentName}" from "${courseTitle}"?`)) return;
    try {
      await unenrollStudent(studentId, courseId);
      load();
    } catch {
      setError('Failed to remove enrollment.');
    }
  }

  const allEnrollments = students.flatMap(s =>
    (s.courses || []).map(c => ({ student: s, course: c }))
  );

  if (loading) return <div className="loading">Loading enrollments…</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h2>Enrollments</h2>
        <span className="badge badge-blue" style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
          {allEnrollments.length} total
        </span>
      </div>

      <div className="relationship-note">
        <strong>Many-to-Many:</strong> Students can enroll in multiple courses; each course can have multiple students.
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="card form-card">
        <h3>Enroll a Student</h3>
        <form onSubmit={handleEnroll}>
          <div className="form-row">
            <div className="form-group">
              <label>Student</label>
              <select
                required
                value={selectedStudent}
                onChange={e => setSelectedStudent(e.target.value)}
              >
                <option value="">Select student…</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Course</label>
              <select
                required
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
              >
                <option value="">Select course…</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Enrolling…' : 'Enroll Student'}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>All Enrollments</h3>
        {allEnrollments.length === 0 ? (
          <div className="empty-state">No enrollments yet. Use the form above to enroll a student.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Course Code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allEnrollments.map(({ student, course }) => (
                <tr key={`${student.id}-${course.id}`}>
                  <td>
                    <Link to={`/students/${student.id}`} className="table-link">{student.name}</Link>
                  </td>
                  <td>
                    <Link to={`/courses/${course.id}`} className="table-link">{course.title}</Link>
                  </td>
                  <td><span className="badge badge-purple">{course.code}</span></td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleUnenroll(student.id, course.id, student.name, course.title)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>By Student</h3>
        {students.length === 0 ? (
          <div className="empty-state">No students found.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Enrolled Courses</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td><Link to={`/students/${s.id}`} className="table-link">{s.name}</Link></td>
                  <td>
                    {(s.courses?.length ?? 0) === 0
                      ? <span className="text-muted">None</span>
                      : (
                        <div className="tag-list">
                          {s.courses!.map(c => (
                            <Link key={c.id} to={`/courses/${c.id}`} className="badge badge-purple" style={{ textDecoration: 'none' }}>
                              {c.code}
                            </Link>
                          ))}
                        </div>
                      )
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
