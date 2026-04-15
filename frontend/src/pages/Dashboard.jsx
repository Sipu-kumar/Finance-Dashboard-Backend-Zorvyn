import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem('user_email') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_email');
    navigate('/login');
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '480px', textAlign: 'center' }}>
        <div className="auth-card-header">
          <div style={{
            width: 72, height: 72,
            background: 'linear-gradient(135deg, #7B2FBE, #9B59D0)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '2rem'
          }}>
            🎉
          </div>
          <h1>Welcome!</h1>
          <p style={{ marginTop: 8 }}>Logged in as <strong>{email}</strong></p>
        </div>

        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: 24 }}>
          Your JWT token has been stored. Dashboard is coming soon!
        </p>

        <button
          id="logout-btn"
          className="btn-primary"
          onClick={handleLogout}
          style={{ maxWidth: 220, margin: '0 auto' }}
        >
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
