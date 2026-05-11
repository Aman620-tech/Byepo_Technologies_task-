import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.data.token, { email: res.data.data.email, role: res.data.data.role });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-badge">SUPER ADMIN</div>
        <h1 className="login-title">Control Panel</h1>
        <p className="login-sub">Byepo Technologies — System Management</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label>EMAIL</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@byepo.com"
              required
            />
          </div>
          <div className="field-group">
            <label>PASSWORD</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
          </button>
        </form>
      </div>
    </div>
  );
}
