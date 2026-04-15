import { useNavigate, useLocation } from 'react-router-dom';
import '../pages/Dashboard.css';

/* ─── SVG Icons ────────────────────────────────────────── */
const Icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  records: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  performance: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  payment: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
};

const navItems = [
  { icon: Icons.dashboard,  label: 'Dashboard', path: '/dashboard' },
  { icon: Icons.records,    label: 'Records',   path: '/records'   },
  { icon: Icons.analytics,  label: 'Analytics', path: '#' },
  { icon: Icons.performance,label: 'Performance', path: '#' },
  { icon: Icons.payment,    label: 'Payment',   path: '#' },
];

export default function AppLayout({ children, title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const email    = localStorage.getItem('user_email') || 'User';
  const role     = localStorage.getItem('user_role')  || 'VIEWER';
  const name     = localStorage.getItem('user_name')  || email.split('@')[0];
  const initial  = (name || email).charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* ─── Sidebar ─── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">🏦</div>
          <h2>Finance Hub</h2>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`sidebar-item${location.pathname === item.path ? ' active' : ''}`}
              onClick={() => item.path !== '#' && navigate(item.path)}
              id={`nav-${item.label.toLowerCase()}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="sidebar-item" id="nav-settings">
            {Icons.settings}
            Settings
          </button>
          <button className="sidebar-item" id="nav-logout" onClick={handleLogout}>
            {Icons.logout}
            Log out
          </button>
        </div>
      </aside>

      {/* ─── Main Area ─── */}
      <div className="main-content">
        {/* ─── Top Bar ─── */}
        <header className="topbar">
          <h1 className="topbar-title">{title || 'Dashboard'}</h1>
          <div className="topbar-right">
            <div className="topbar-search">
              {Icons.search}
              <input type="text" placeholder="Search" id="dashboard-search" />
            </div>
            <button className="topbar-notification" id="notification-btn">
              {Icons.bell}
            </button>
            <div className="topbar-user">
              <div className="topbar-avatar">{initial}</div>
              <div className="topbar-user-info">
                <span className="topbar-user-name">{name}</span>
                <span className={`topbar-user-role role-badge ${role === 'ADMIN' ? 'role-admin' : 'role-viewer'}`}>
                  {role}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ─── Page Content ─── */}
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
