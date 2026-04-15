import { useState, useEffect } from 'react';
import { fetchDashboardSummary } from '../api/dashboard';
import AppLayout from '../components/AppLayout';
import './Dashboard.css';

const Icons = {
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

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(value);
}

export default function Dashboard() {
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

  const savings = summary ? (summary.balance > 0 ? summary.balance : 0) : 0;

  return (
    <AppLayout title="Dashboard">
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

            <div className="summary-card income">
              <div className="summary-card-top">
                <div className="summary-card-icon">💰</div>
                <button className="summary-card-menu">{Icons.dots}</button>
              </div>
              <span className="summary-card-label">Income</span>
              <div className="summary-card-bottom">
                <span className="summary-card-value">{formatCurrency(summary.totalIncome)}</span>
                <span className="summary-card-trend up">{Icons.trendUp}</span>
              </div>
            </div>

            <div className="summary-card expense">
              <div className="summary-card-top">
                <div className="summary-card-icon">💸</div>
                <button className="summary-card-menu">{Icons.dots}</button>
              </div>
              <span className="summary-card-label">Expenses</span>
              <div className="summary-card-bottom">
                <span className="summary-card-value">{formatCurrency(summary.totalExpense)}</span>
                <span className="summary-card-trend down">{Icons.trendDown}</span>
              </div>
            </div>

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

          {/* ─── Summary Table ─── */}
          <div className="transactions-panel">
            <div className="section-header">
              <h2 className="section-title">Summary Overview</h2>
            </div>
            <table className="transactions-table">
              <thead>
                <tr><th>Metric</th><th>Amount</th><th>Status</th></tr>
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
              </tbody>
            </table>
          </div>
        </>
      )}
    </AppLayout>
  );
}
