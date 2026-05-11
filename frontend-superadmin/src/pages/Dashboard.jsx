import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createOrganization, listOrganizations } from '../api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [orgs, setOrgs] = useState([]);
  const [form, setForm] = useState({ name: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchOrgs = async () => {
    try {
      const res = await listOrganizations();
      setOrgs(res.data.data);
    } catch {
      setError('Failed to fetch organizations');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await createOrganization(form);
      setSuccess(`Organization "${form.name}" created successfully`);
      setForm({ name: '' });
      fetchOrgs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-logo">
          <span className="logo-dot" />
          BYEPO CONTROL
        </div>
        <div className="dash-user">
          <span>{user?.email}</span>
          <button onClick={logout} className="btn-logout">LOGOUT</button>
        </div>
      </header>

      <main className="dash-main">
        <section className="create-section">
          <h2 className="section-title">Create Organization</h2>
          <form onSubmit={handleCreate} className="create-form">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ name: e.target.value })}
              placeholder="Organization name"
              required
              className="text-input"
            />
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'CREATING...' : '+ CREATE'}
            </button>
          </form>
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}
        </section>

        <section className="orgs-section">
          <h2 className="section-title">
            Organizations <span className="count-badge">{orgs.length}</span>
          </h2>
          {fetching ? (
            <div className="loading-text">Loading...</div>
          ) : orgs.length === 0 ? (
            <div className="empty-state">No organizations yet. Create one above.</div>
          ) : (
            <div className="orgs-grid">
              {orgs.map((org) => (
                <div key={org._id} className="org-card">
                  <div className="org-name">{org.name}</div>
                  <div className="org-meta">
                    <span className="org-slug">{org.slug}</span>
                    <span className={`org-status ${org.isActive ? 'active' : 'inactive'}`}>
                      {org.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <div className="org-date">
                    Created {new Date(org.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
