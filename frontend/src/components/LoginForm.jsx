import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

function validate(email, password) {
  const errs = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Podaj prawidłowy adres e-mail';
  if (password.length < 6) errs.password = 'Hasło musi mieć co najmniej 6 znaków';
  return errs;
}

export default function LoginForm() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const errs = validate(email, password);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        toast.success('Witaj z powrotem!');
      } else {
        await register(email, password);
        toast.success('Konto zostało utworzone!');
      }
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.error || 'Coś poszło nie tak. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="login-logo-text">SubTrack</span>
        </div>
        <p className="login-tagline">Zarządzaj swoimi cyfrowymi subskrypcjami</p>

        <div className="login-tabs">
          <button className={`login-tab${mode === 'login' ? ' active' : ''}`} onClick={() => switchMode('login')}>
            Logowanie
          </button>
          <button className={`login-tab${mode === 'register' ? ' active' : ''}`} onClick={() => switchMode('register')}>
            Rejestracja
          </button>
        </div>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              className={`form-input${errors.email ? ' field-error' : ''}`}
              placeholder="ty@przykład.pl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {errors.email && <span className="field-error-msg">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Hasło</label>
            <input
              id="password"
              type="password"
              className={`form-input${errors.password ? ' field-error' : ''}`}
              placeholder="Min. 6 znaków"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            />
            {errors.password && <span className="field-error-msg">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Proszę czekać…' : mode === 'login' ? 'Zaloguj się' : 'Utwórz konto'}
          </button>
        </form>
      </div>
    </div>
  );
}
