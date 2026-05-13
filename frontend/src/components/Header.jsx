import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/dashboard" className="header-brand">SubTrack</Link>
        <div className="header-actions">
          {user && <span className="header-user">{user.email}</span>}
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            Wyloguj
          </button>
        </div>
      </div>
    </header>
  );
}
