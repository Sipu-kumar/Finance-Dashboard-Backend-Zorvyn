import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardSummary } from '../api/dashboard';
import './Dashboard.css';

/* ─── SVG Icons ────────────────────────────────────────── */
const Icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
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
  event: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  payment: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  message: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  support: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
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
  trendUp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  trendDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
    </svg>
  ),
  dots: (
    <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
  ),
};

const navItems = [
  { icon: Icons.dashboard, label: 'Dashboard',   active: true  },
  { icon: Icons.analytics,  label: 'Analytics',    active: false },
  { icon: Icons.performance,label: 'Performance',  active: false },
  { icon: Icons.event,      label: 'Event',        active: false },
  { icon: Icons.payment,    label: 'Payment',      active: false },
  { icon: Icons.message,    label: 'Message',      active: false },
  { icon: Icons.support,    label: 'Support',      active: false },
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem('user_email') || 'User';
  const initial = email.charAt(0).toUpperCase();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchDashboardSummary();
        if (!cancelled) setSummary(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_email');
    navigate('/login');
  };

  const savings = summary ? (summary.balance > 0 ? summary.balance : 0) : 0;

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
              className={`sidebar-item${item.active ? ' active' : ''}`}
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
          <h1 className="topbar-title">Dashboard</h1>

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
                <span className="topbar-user-name">{email.split('@')[0]}</span>
                <span className="topbar-user-role">User account</span>
              </div>
            </div>
          </div>
        </header>

        {/* ─── Dashboard Body ─── */}
        <main className="dashboard-content">
          {loading && (
            <div className="dashboard-loading">
              <div className="spinner-lg" />
              <span>Loading dashboard...</span>
            </div>
          )}

          {error && <div className="dashboard-error">{error}</div>}

          {!loading && !error && summary && (
            <>
              {/* ─── Summary Cards ─── */}
              <div className="summary-cards">
                {/* Balance */}
                <div className="summary-card balance">
                  <div className="summary-card-top">
                    <div className="summary-card-icon">💼</div>
                    <button className="summary-card-menu">{Icons.dots}</button>
                  </div>
                  <span className="summary-card-label">Balance</span>
                  <div className="summary-card-bottom">
                    <span className="summary-card-value">{formatCurrency(summary.balance)}</span>
                    <span className={`summary-card-trend ${summary.balance >= 0 ? 'up' : 'down'}`}>
                      {summary.balance >= 0 ? Icons.trendUp : Icons.trendDown}
                    </span>
                  </div>
                </div>

                {/* Income */}
                <div className="summary-card income">
                  <div className="summary-card-top">
                    <div className="summary-card-icon">💰</div>
                    <button className="summary-card-menu">{Icons.dots}</button>
                  </div>
                  <span className="summary-card-label">Income</span>
                  <div className="summary-card-bottom">
                    <span className="summary-card-value">{formatCurrency(summary.totalIncome)}</span>
                    <span className="summary-card-trend up">
                      {Icons.trendUp}
                    </span>
                  </div>
                </div>

                {/* Expenses */}
                <div className="summary-card expense">
                  <div className="summary-card-top">
                    <div className="summary-card-icon">💸</div>
                    <button className="summary-card-menu">{Icons.dots}</button>
                  </div>
                  <span className="summary-card-label">Expenses</span>
                  <div className="summary-card-bottom">
                    <span className="summary-card-value">{formatCurrency(summary.totalExpense)}</span>
                    <span className="summary-card-trend down">
                      {Icons.trendDown}
                    </span>
                  </div>
                </div>

                {/* Savings */}
                <div className="summary-card savings">
                  <div className="summary-card-top">
                    <div className="summary-card-icon">📊</div>
                    <button className="summary-card-menu">{Icons.dots}</button>
                  </div>
                  <span className="summary-card-label">Savings</span>
                  <div className="summary-card-bottom">
                    <span className="summary-card-value">{formatCurrency(savings)}</span>
                    <span className={`summary-card-trend ${savings >= 0 ? 'up' : 'down'}`}>
                      {savings >= 0 ? Icons.trendUp : Icons.trendDown}
                    </span>
                  </div>
                </div>
              </div>

              {/* ─── Quick Info Panel ─── */}
              <div className="transactions-panel">
                <div className="section-header">
                  <h2 className="section-title">Summary Overview</h2>
                </div>
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total Income</td>
                      <td>{formatCurrency(summary.totalIncome)}</td>
                      <td className="type-income">● Active</td>
                    </tr>
                    <tr>
                      <td>Total Expenses</td>
                      <td>{formatCurrency(summary.totalExpense)}</td>
                      <td className="type-expense">● Tracked</td>
                    </tr>
                    <tr>
                      <td>Net Balance</td>
                      <td>{formatCurrency(summary.balance)}</td>
                      <td style={{ color: summary.balance >= 0 ? '#27ae60' : '#e74c3c', fontWeight: 600 }}>
                        {summary.balance >= 0 ? '● Positive' : '● Negative'}
                      </td>
                    </tr>
                    <tr>
                      <td>Savings</td>
                      <td>{formatCurrency(savings)}</td>
                      <td style={{ color: '#7B2FBE', fontWeight: 600 }}>● Calculated</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
