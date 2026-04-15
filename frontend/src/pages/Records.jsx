import { useState, useEffect } from 'react';
import { fetchRecords, createRecord, deleteRecord } from '../api/records';
import { fetchDashboardSummary } from '../api/dashboard';
import AppLayout from '../components/AppLayout';
import './Records.css';

const CATEGORIES = [
  'Salary',
  'Food & Dining',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Transportation',
  'Shopping',
  'Investment',
  'Rent & Housing',
  'Travel',
  'Education',
  'Other',
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(value);
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

const initialForm = {
  amount: '',
  type: 'INCOME',
  category: '',
  date: todayISO(),
  notes: '',
};

// Delete icon SVG
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

export default function Records() {
  const [records, setRecords]   = useState([]);
  const [summary, setSummary]   = useState(null);
  const [form, setForm]         = useState(initialForm);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  // Read role from localStorage
  const userRole = localStorage.getItem('user_role') || 'VIEWER';
  const isAdmin  = userRole === 'ADMIN';

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [recs, sum] = await Promise.all([
        fetchRecords(),
        fetchDashboardSummary(),
      ]);
      setRecords(recs);
      setSummary(sum);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleTypeToggle(type) {
    setForm({ ...form, type });
  }

  function resetForm() {
    setForm(initialForm);
    setError('');
    setSuccess('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.amount || Number(form.amount) <= 0) {
      return setError('Please enter a valid amount.');
    }
    if (!form.category) {
      return setError('Please select a category.');
    }
    if (!form.date) {
      return setError('Please select a date.');
    }

    setSaving(true);
    try {
      const payload = {
        amount:   parseFloat(form.amount),
        type:     form.type,
        category: form.category,
        date:     form.date,
        notes:    form.notes || '',
      };
      await createRecord(payload);
      setSuccess(`${form.type === 'INCOME' ? 'Income' : 'Expense'} of ${formatCurrency(form.amount)} added!`);
      setForm(initialForm);
      await loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this record?')) return;
    setDeletingId(id);
    try {
      await deleteRecord(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AppLayout title="Records">
      {/* ─── Top Summary Strip ─── */}
      {summary && (
        <div className="records-summary-strip">
          <div className="summary-mini-card">
            <div className="summary-mini-icon income">💰</div>
            <div className="summary-mini-info">
              <h3>Total Income</h3>
              <p className="positive">{formatCurrency(summary.totalIncome)}</p>
            </div>
          </div>
          <div className="summary-mini-card">
            <div className="summary-mini-icon expense">💸</div>
            <div className="summary-mini-info">
              <h3>Total Expenses</h3>
              <p className="negative">{formatCurrency(summary.totalExpense)}</p>
            </div>
          </div>
          <div className="summary-mini-card">
            <div className="summary-mini-icon balance">📊</div>
            <div className="summary-mini-info">
              <h3>Balance</h3>
              <p className={summary.balance >= 0 ? 'positive' : 'negative'}>
                {formatCurrency(summary.balance)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Main Grid ─── */}
      <div className="records-grid">

        {/* ─── Add Record Form (ADMIN only) ─── */}
        {isAdmin ? (
          <div className="add-record-card">
            <h2>➕ Add Record</h2>

            {error   && <div className="record-alert record-alert-error"   style={{ marginBottom: 14 }}>{error}</div>}
            {success && <div className="record-alert record-alert-success" style={{ marginBottom: 14 }}>{success}</div>}

            <form className="record-form" onSubmit={handleSubmit} noValidate>
              {/* Type Toggle */}
              <div className="record-form-group">
                <label>Type</label>
                <div className="type-toggle">
                  <button
                    type="button"
                    className={`type-toggle-btn${form.type === 'INCOME' ? ' active-income' : ''}`}
                    onClick={() => handleTypeToggle('INCOME')}
                    id="type-income-btn"
                  >
                    💰 Income
                  </button>
                  <button
                    type="button"
                    className={`type-toggle-btn${form.type === 'EXPENSE' ? ' active-expense' : ''}`}
                    onClick={() => handleTypeToggle('EXPENSE')}
                    id="type-expense-btn"
                  >
                    💸 Expense
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="record-form-group">
                <label htmlFor="record-amount">Amount (₹)</label>
                <input
                  type="number"
                  id="record-amount"
                  name="amount"
                  className="record-form-input"
                  placeholder="Enter amount"
                  value={form.amount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Category */}
              <div className="record-form-group">
                <label htmlFor="record-category">Category</label>
                <select
                  id="record-category"
                  name="category"
                  className="record-form-select"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="record-form-group">
                <label htmlFor="record-date">Date</label>
                <input
                  type="date"
                  id="record-date"
                  name="date"
                  className="record-form-input"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>

              {/* Notes */}
              <div className="record-form-group">
                <label htmlFor="record-notes">Notes (Optional)</label>
                <textarea
                  id="record-notes"
                  name="notes"
                  className="record-form-textarea"
                  placeholder="Add description..."
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>

              {/* Buttons */}
              <div className="record-form-actions">
                <button
                  type="submit"
                  className="btn-save-record"
                  disabled={saving}
                  id="save-record-btn"
                >
                  {saving ? (
                    <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</>
                  ) : (
                    <>💾 Save Transaction</>
                  )}
                </button>
                <button type="button" className="btn-cancel-record" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ─── Viewer notice ─── */
          <div className="add-record-card viewer-notice">
            <div className="viewer-notice-icon">👀</div>
            <h2>View Only</h2>
            <p>You are logged in as a <strong>Viewer</strong>.</p>
            <p>Only Admins can add or delete records.</p>
          </div>
        )}

        {/* ─── Records Table ─── */}
        <div className="records-table-card">
          <div className="records-table-header">
            <h2>Transaction History</h2>
            <span className="records-count">{records.length} records</span>
          </div>

          {/* Non-admin errors (e.g. delete not available) shown here */}
          {!isAdmin && error && (
            <div className="record-alert record-alert-error" style={{ margin: '0 0 14px' }}>{error}</div>
          )}

          {loading ? (
            <div className="dashboard-loading">
              <div className="spinner-lg" />
              <span>Loading records...</span>
            </div>
          ) : records.length === 0 ? (
            <div className="records-empty">
              <div className="records-empty-icon">📋</div>
              <h3>No transactions yet</h3>
              <p>Add your first income or expense to get started!</p>
            </div>
          ) : (
            <table className="records-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Notes</th>
                  {isAdmin && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {records
                  .slice()
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((rec) => (
                    <tr key={rec.id}>
                      <td>{rec.date}</td>
                      <td>
                        <span className="record-category-chip">{rec.category}</span>
                      </td>
                      <td>
                        <span className={`record-type-badge ${rec.type.toLowerCase()}`}>
                          {rec.type === 'INCOME' ? '↑' : '↓'} {rec.type}
                        </span>
                      </td>
                      <td>
                        <span className={`record-amount ${rec.type.toLowerCase()}`}>
                          {rec.type === 'INCOME' ? '+' : '-'}{formatCurrency(rec.amount)}
                        </span>
                      </td>
                      <td>
                        <span className="record-notes">{rec.notes || '—'}</span>
                      </td>
                      {isAdmin && (
                        <td>
                          <button
                            className="btn-delete-record"
                            onClick={() => handleDelete(rec.id)}
                            disabled={deletingId === rec.id}
                            title="Delete record"
                            id={`delete-record-${rec.id}`}
                          >
                            {deletingId === rec.id
                              ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                              : <TrashIcon />
                            }
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
