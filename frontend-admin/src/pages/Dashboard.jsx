import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFlags, createFlag, updateFlag, deleteFlag } from '../api';

function FlagModal({ flag, onClose, onSave }) {
  const [form, setForm] = useState({
    featureKey: flag?.featureKey || '',
    description: flag?.description || '',
    isEnabled: flag?.isEnabled ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{flag ? 'Edit Flag' : 'New Feature Flag'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="field">
            <label>Feature Key</label>
            <input
              type="text"
              value={form.featureKey}
              onChange={(e) => setForm({ ...form, featureKey: e.target.value })}
              placeholder="e.g. dark_mode, new_checkout"
              required
              disabled={!!flag}
              pattern="[a-zA-Z0-9_]+"
              title="Only letters, numbers, and underscores"
            />
          </div>
          <div className="field">
            <label>Description (optional)</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What does this flag control?"
            />
          </div>
          <div className="field-toggle">
            <label>Enabled</label>
            <button
              type="button"
              className={`toggle ${form.isEnabled ? 'on' : 'off'}`}
              onClick={() => setForm({ ...form, isEnabled: !form.isEnabled })}
            >
              <span className="toggle-knob" />
            </button>
          </div>
          {error && <div className="error-msg">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : flag ? 'Update Flag' : 'Create Flag'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(null);

  const fetchFlags = async () => {
    try {
      const res = await getFlags();
      setFlags(res.data.data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFlags(); }, []);

  const handleCreate = async (form) => {
    await createFlag(form);
    await fetchFlags();
  };

  const handleUpdate = async (id, form) => {
    await updateFlag(id, form);
    await fetchFlags();
  };

  const handleDelete = async (id) => {
    await deleteFlag(id);
    setDeleteTarget(null);
    await fetchFlags();
  };

  const handleToggle = async (flag) => {
    setToggleLoading(flag._id);
    try {
      await updateFlag(flag._id, { isEnabled: !flag.isEnabled });
      await fetchFlags();
    } catch {}
    finally { setToggleLoading(null); }
  };

  const orgName = user?.organization?.name || 'Your Organization';

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-left">
          <div className="dash-org-badge">{orgName}</div>
          <span className="dash-title">Feature Flags</span>
        </div>
        <div className="dash-right">
          <span className="dash-email">{user?.email}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="dash-main">
        <div className="dash-toolbar">
          <div className="dash-stats">
            <div className="stat">
              <span className="stat-num">{flags.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat">
              <span className="stat-num enabled">{flags.filter((f) => f.isEnabled).length}</span>
              <span className="stat-label">Enabled</span>
            </div>
            <div className="stat">
              <span className="stat-num disabled">{flags.filter((f) => !f.isEnabled).length}</span>
              <span className="stat-label">Disabled</span>
            </div>
          </div>
          <button className="btn-primary" onClick={() => setModal({ type: 'create' })}>
            + New Flag
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading flags...</div>
        ) : flags.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⚑</div>
            <p>No feature flags yet.</p>
            <button className="btn-primary" onClick={() => setModal({ type: 'create' })}>Create your first flag</button>
          </div>
        ) : (
          <div className="flags-table">
            <div className="table-header">
              <span>Feature Key</span>
              <span>Description</span>
              <span>Status</span>
              <span>Created</span>
              <span>Actions</span>
            </div>
            {flags.map((flag) => (
              <div key={flag._id} className="table-row">
                <span className="flag-key">{flag.featureKey}</span>
                <span className="flag-desc">{flag.description || '—'}</span>
                <span>
                  <button
                    className={`toggle ${flag.isEnabled ? 'on' : 'off'}`}
                    onClick={() => handleToggle(flag)}
                    disabled={toggleLoading === flag._id}
                  >
                    <span className="toggle-knob" />
                  </button>
                </span>
                <span className="flag-date">{new Date(flag.createdAt).toLocaleDateString()}</span>
                <span className="row-actions">
                  <button
                    className="btn-icon edit"
                    onClick={() => setModal({ type: 'edit', flag })}
                  >Edit</button>
                  <button
                    className="btn-icon delete"
                    onClick={() => setDeleteTarget(flag)}
                  >Delete</button>
                </span>
              </div>
            ))}
          </div>
        )}
      </main>

      {modal?.type === 'create' && (
        <FlagModal onClose={() => setModal(null)} onSave={handleCreate} />
      )}
      {modal?.type === 'edit' && (
        <FlagModal
          flag={modal.flag}
          onClose={() => setModal(null)}
          onSave={(form) => handleUpdate(modal.flag._id, form)}
        />
      )}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Flag</h3>
            <p>Are you sure you want to delete <strong>{deleteTarget.featureKey}</strong>? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn-danger" onClick={() => handleDelete(deleteTarget._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
