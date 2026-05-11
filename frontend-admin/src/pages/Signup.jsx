import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signup, getPublicOrgs } from '../api';

export default function Signup() {
  const [form, setForm] = useState({ email: '', password: '', organizationId: '' });
  const [orgs, setOrgs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getPublicOrgs()
      .then((res) => setOrgs(res.data.data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await signup(form);
      const { token, email, role, organization } = res.data.data;
      loginUser(token, { email, role, organization });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-role-tag">ORG ADMIN</div>
          <h1>Create Account</h1>
          <p>Manage feature flags for your organization</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@company.com"
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min. 6 characters"
              minLength={6}
              required
            />
          </div>
          <div className="field">
            <label>Organization</label>
            <select
              value={form.organizationId}
              onChange={(e) => setForm({ ...form, organizationId: e.target.value })}
              required
            >
              <option value="">Select an organization</option>
              {orgs.map((org) => (
                <option key={org._id} value={org._id}>{org.name}</option>
              ))}
            </select>
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
