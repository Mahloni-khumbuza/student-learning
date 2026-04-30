import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../api';
import { Course } from '../types';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState({ title: '', code: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const { data } = await getCourses();
      setCourses(data);
    } catch {
      setError('Failed to load courses.');
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditing(null);
    setForm({ title: '', code: '' });
    setError('');
    setShowForm(true);
  }

  function openEdit(c: Course) {
    setEditing(c);
    setForm({ title: c.title, code: c.code });
    setError('');
    setShowForm(true);
  }

  function cancel() {
    setShowForm(false);
    setEditing(null);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (editing) {
        await updateCourse(editing.id, form);
      } else {
        await createCourse(form);
      }
      cancel();
      load();
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg || 'An error occurred.'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(c: Course) {
    if (!window.confirm(`Delete course "${c.title} (${c.code})"?\nThis will also delete all assignments and remove all enrollments.`)) return;
    try {
      await deleteCourse(c.id);
      load();
    } catch {
      setError('Failed to delete course.');
    }
  }

  if (loading) return <div className="loading">Loading courses…</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h2>Courses</h2>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Course</button>
      </div>

      {error && !showForm && <div className="alert-error">{error}</div>}

      {showForm && (
        <div className="card form-card">
          <h3>{editing ? 'Edit Course' : 'New Course'}</h3>
          {error && <div className="alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Course Title</label>
                <input
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Introduction to Programming"
                />
              </div>
              <div className="form-group">
                <label>Course Code</label>
                <input
                  required
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value })}
                  placeholder="e.g. CS101"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving…' : editing ? 'Save Changes' : 'Create Course'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={cancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {courses.length === 0 ? (
          <div className="empty-state">No courses yet. Click "Add Course" to get started.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Code</th>
                <th>Assignments</th>
                <th>Enrolled Students</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id}>
                  <td>
                    <Link to={`/courses/${c.id}`} className="table-link">{c.title}</Link>
                  </td>
                  <td><span className="badge badge-purple">{c.code}</span></td>
                  <td>
                    <span className="badge badge-blue">{c.assignments?.length ?? 0} assignment{c.assignments?.length !== 1 ? 's' : ''}</span>
                  </td>
                  <td>
                    <span className="badge badge-green">{c.students?.length ?? 0} student{c.students?.length !== 1 ? 's' : ''}</span>
                  </td>
                  <td>
                    <div className="actions">
                      <Link to={`/courses/${c.id}`} className="btn btn-secondary btn-sm">View</Link>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c)}>Delete</button>
                    </div>
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
