import { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export default function App() {
  const [orgs, setOrgs] = useState([]);
  const [form, setForm] = useState({ featureKey: '', organizationId: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get('/public/organizations')
      .then((res) => setOrgs(res.data.data))
      .catch(() => {});
  }, []);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!form.featureKey.trim() || !form.organizationId) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post('/feature-flags/check', form);
      const data = res.data.data;
      setResult(data);
      const org = orgs.find((o) => o._id === form.organizationId);
      setHistory((prev) => [
        { ...data, orgName: org?.name, timestamp: new Date(), key: Date.now() },
        ...prev.slice(0, 4),
      ]);
    } catch (err) {
      setError(err.response?.data?.message || 'Check failed');
    } finally {
      setLoading(false);
    }
  };

  const selectedOrg = orgs.find((o) => o._id === form.organizationId);

  return (
    <div className="app">
      <div className="left-panel">
        <div className="panel-content">
          <div className="brand">
            <div className="brand-dot" />
            <span>BYEPO</span>
          </div>
          <h1 className="headline">Feature Flag<br />Checker</h1>
          <p className="subline">Check whether a feature is enabled for your organization in real-time.</p>

          <form onSubmit={handleCheck} className="checker-form">
            <div className="form-group">
              <label>Organization</label>
              <select
                value={form.organizationId}
                onChange={(e) => { setForm({ ...form, organizationId: e.target.value }); setResult(null); }}
              >
                <option value="">Select organization...</option>
                {orgs.map((org) => (
                  <option key={org._id} value={org._id}>{org.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Feature Key</label>
              <div className="input-row">
                <input
                  type="text"
                  value={form.featureKey}
                  onChange={(e) => { setForm({ ...form, featureKey: e.target.value }); setResult(null); }}
                  placeholder="e.g. dark_mode"
                />
              </div>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <button type="submit" disabled={loading} className="check-btn">
              {loading ? (
                <span className="btn-loading"><span className="spinner" /> Checking...</span>
              ) : (
                'Check Feature'
              )}
            </button>
          </form>

          {result && (
            <div className={`result-card ${result.isEnabled ? 'enabled' : 'disabled'}`}>
              <div className="result-indicator">
                <div className={`result-dot ${result.isEnabled ? 'on' : 'off'}`} />
                <span className="result-status">{result.isEnabled ? 'ENABLED' : 'DISABLED'}</span>
              </div>
              <div className="result-detail">
                <span className="result-key">{result.featureKey}</span>
                {selectedOrg && <span className="result-org">for {selectedOrg.name}</span>}
              </div>
              {!result.exists && (
                <div className="result-note">This feature flag does not exist in the organization.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="right-panel">
        <div className="history-section">
          <h2 className="history-title">Recent Checks</h2>
          {history.length === 0 ? (
            <div className="history-empty">Your checks will appear here</div>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div key={item.key} className={`history-item ${item.isEnabled ? 'on' : 'off'}`}>
                  <div className="history-flag">
                    <span className={`hd ${item.isEnabled ? 'enabled' : 'disabled'}`}>
                      {item.isEnabled ? '●' : '○'}
                    </span>
                    <span className="history-key">{item.featureKey}</span>
                  </div>
                  <div className="history-meta">
                    <span>{item.orgName}</span>
                    <span className="history-time">
                      {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="info-section">
          <h3>How it works</h3>
          <ol>
            <li>Select your organization from the dropdown</li>
            <li>Enter the feature key you want to check</li>
            <li>Hit <em>Check Feature</em> to get the status</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
