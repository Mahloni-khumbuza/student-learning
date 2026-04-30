import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../api';
import { Student } from '../types';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const { data } = await getStudents();
      setStudents(data);
    } catch {
      setError('Failed to load students.');
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditing(null);
    setForm({ name: '', email: '' });
    setError('');
    setShowForm(true);
  }

  function openEdit(s: Student) {
    setEditing(s);
    setForm({ name: s.name, email: s.email });
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
        await updateStudent(editing.id, form);
      } else {
        await createStudent(form);
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

  async function handleDelete(s: Student) {
    if (!window.confirm(`Delete student "${s.name}"?\nThis will also delete their profile and remove all enrollments.`)) return;
    try {
      await deleteStudent(s.id);
      load();
    } catch {
      setError('Failed to delete student.');
    }
  }

  if (loading) return <div className="loading">Loading students…</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h2>Students</h2>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Student</button>
      </div>

      {error && !showForm && <div className="alert-error">{error}</div>}

      {showForm && (
        <div className="card form-card">
          <h3>{editing ? 'Edit Student' : 'New Student'}</h3>
          {error && <div className="alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving…' : editing ? 'Save Changes' : 'Create Student'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={cancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {students.length === 0 ? (
          <div className="empty-state">No students yet. Click "Add Student" to get started.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Profile</th>
                <th>Courses Enrolled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>
                    <Link to={`/students/${s.id}`} className="table-link">{s.name}</Link>
                  </td>
                  <td className="text-muted">{s.email}</td>
                  <td>
                    {s.profile
                      ? <span className="badge badge-green">Has Profile</span>
                      : <span className="badge badge-gray">No Profile</span>}
                  </td>
                  <td>
                    <span className="badge badge-blue">{s.courses?.length ?? 0} course{s.courses?.length !== 1 ? 's' : ''}</span>
                  </td>
                  <td>
                    <div className="actions">
                      <Link to={`/students/${s.id}`} className="btn btn-secondary btn-sm">View</Link>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s)}>Delete</button>
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
