import { useState, useEffect } from 'react';
import {
  fetchPayments, fetchPaymentStats, fetchScheduledPayments,
  createPayment, completePayment, deletePayment
} from '../api/payments';
import AppLayout from '../components/AppLayout';
import './Payment.css';

/* ─── Helpers ──────────────────────────────────────────── */
function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(value);
}
function todayISO() { return new Date().toISOString().split('T')[0]; }

const METHODS = ['UPI', 'CARD', 'BANK_TRANSFER', 'WALLET'];
const CATEGORIES = ['Bills', 'Rent', 'Subscription', 'Transfer', 'Shopping', 'Food', 'Travel', 'Other'];
const METHOD_LABELS = { UPI: 'UPI', CARD: 'Card', BANK_TRANSFER: 'Bank Transfer', WALLET: 'Wallet' };
const STATUS_CLASSES = { COMPLETED: 'completed', PENDING: 'pending', FAILED: 'failed', SCHEDULED: 'scheduled' };

/* ─── SVG Icons ────────────────────────────────────────── */
const Ic = {
  send: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  wallet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
  ),
  creditCard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  activity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
};

const initialForm = {
  payeeName: '', amount: '', method: 'UPI', category: 'Bills',
  notes: '', date: todayISO(), scheduledDate: '',
};

/* ─── Payment Page ─────────────────────────────────────── */
export default function Payment() {
  const [payments, setPayments] = useState([]);
  const [scheduled, setScheduled] = useState([]);
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  const userRole = localStorage.getItem('user_role') || 'VIEWER';
  const isAdmin = userRole === 'ADMIN';

  useEffect(() => { loadData(); }, [filter]);

  async function loadData() {
    setLoading(true);
    try {
      const [payList, sched, st] = await Promise.all([
        filter === 'ALL' ? fetchPayments() : fetchPayments(filter),
        fetchScheduledPayments(),
        fetchPaymentStats(),
      ]);
      setPayments(payList);
      setScheduled(sched);
      setStats(st);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  function showMsg(type, msg) {
    if (type === 'success') { setSuccess(msg); setError(''); }
    else { setError(msg); setSuccess(''); }
    setTimeout(() => { setSuccess(''); setError(''); }, 3500);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.payeeName.trim()) return showMsg('error', 'Payee name is required.');
    if (!form.amount || Number(form.amount) <= 0) return showMsg('error', 'Enter a valid amount.');

    setSaving(true);
    try {
      await createPayment({
        payeeName: form.payeeName,
        amount: parseFloat(form.amount),
        method: form.method,
        category: form.category,
        notes: form.notes,
        date: form.date,
        scheduledDate: form.scheduledDate || null,
      });
      showMsg('success', `Payment of ${formatCurrency(form.amount)} to ${form.payeeName} created!`);
      setForm(initialForm);
      setShowForm(false);
      await loadData();
    } catch (err) {
      showMsg('error', err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleComplete(id) {
    try {
      await completePayment(id);
      showMsg('success', 'Payment marked as completed.');
      await loadData();
    } catch (err) { showMsg('error', err.message); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this payment?')) return;
    try {
      await deletePayment(id);
      await loadData();
    } catch (err) { showMsg('error', err.message); }
  }

  return (
    <AppLayout title="Payment">
      {/* ─── Alerts ─── */}
      {success && <div className="pay-alert pay-alert-success">{success}</div>}
      {error && !loading && <div className="pay-alert pay-alert-error">{error}</div>}

      {loading ? (
        <div className="dashboard-loading">
          <div className="spinner-lg" />
          <span>Loading payments...</span>
        </div>
      ) : (
        <>
          {/* ─── Stats Cards ─── */}
          {stats && (
            <div className="pay-stats-row">
              <div className="pay-stat-card" id="stat-total-paid">
                <div className="pay-stat-icon green">{Ic.check}</div>
                <div className="pay-stat-info">
                  <span className="pay-stat-label">Total Paid</span>
                  <span className="pay-stat-value">{formatCurrency(stats.totalPaid)}</span>
                </div>
              </div>
              <div className="pay-stat-card" id="stat-total-payments">
                <div className="pay-stat-icon blue">{Ic.activity}</div>
                <div className="pay-stat-info">
                  <span className="pay-stat-label">Total Payments</span>
                  <span className="pay-stat-value">{stats.totalPayments}</span>
                </div>
              </div>
              <div className="pay-stat-card" id="stat-pending">
                <div className="pay-stat-icon amber">{Ic.clock}</div>
                <div className="pay-stat-info">
                  <span className="pay-stat-label">Pending</span>
                  <span className="pay-stat-value">{stats.pendingCount}</span>
                </div>
              </div>
              <div className="pay-stat-card" id="stat-scheduled">
                <div className="pay-stat-icon purple">{Ic.creditCard}</div>
                <div className="pay-stat-info">
                  <span className="pay-stat-label">Scheduled</span>
                  <span className="pay-stat-value">{scheduled.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* ─── Main Content ─── */}
          <div className="pay-grid">

            {/* ─── Left: Payment History ─── */}
            <div className="pay-panel pay-history-panel" id="payment-history-panel">
              <div className="pay-panel-header">
                <h2>Payment History</h2>
                <div className="pay-filter-group">
                  {['ALL', 'COMPLETED', 'PENDING', 'FAILED'].map(f => (
                    <button
                      key={f}
                      className={`pay-filter-btn${filter === f ? ' active' : ''}`}
                      onClick={() => setFilter(f)}
                      id={`filter-${f.toLowerCase()}`}
                    >
                      {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {payments.length === 0 ? (
                <div className="pay-empty">
                  <div className="pay-empty-icon">{Ic.wallet}</div>
                  <h3>No payments found</h3>
                  <p>Create your first payment to get started!</p>
                </div>
              ) : (
                <div className="pay-list">
                  {payments.map(p => (
                    <div className="pay-item" key={p.id} id={`payment-${p.id}`}>
                      <div className="pay-item-left">
                        <div className={`pay-item-method-icon ${p.method?.toLowerCase()}`}>
                          {p.method === 'CARD' ? Ic.creditCard : Ic.send}
                        </div>
                        <div className="pay-item-info">
                          <span className="pay-item-payee">{p.payeeName}</span>
                          <span className="pay-item-meta">
                            {METHOD_LABELS[p.method] || p.method} • {p.category} • {p.date}
                          </span>
                          {p.referenceId && (
                            <span className="pay-item-ref">Ref: {p.referenceId}</span>
                          )}
                        </div>
                      </div>
                      <div className="pay-item-right">
                        <span className="pay-item-amount">-{formatCurrency(p.amount)}</span>
                        <span className={`pay-status-badge ${STATUS_CLASSES[p.status]}`}>
                          {p.status}
                        </span>
                        {isAdmin && (
                          <div className="pay-item-actions">
                            {(p.status === 'PENDING' || p.status === 'SCHEDULED') && (
                              <button className="pay-action-btn complete"
                                onClick={() => handleComplete(p.id)}
                                title="Mark complete"
                              >{Ic.check}</button>
                            )}
                            <button className="pay-action-btn delete"
                              onClick={() => handleDelete(p.id)}
                              title="Delete"
                            >{Ic.trash}</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Right: Quick Pay + Upcoming ─── */}
            <div className="pay-right-col">

              {/* Quick Pay */}
              {isAdmin ? (
                <div className="pay-panel" id="quick-pay-panel">
                  <div className="pay-panel-header">
                    <h2>{Ic.send} Quick Pay</h2>
                    {!showForm && (
                      <button className="pay-new-btn" onClick={() => setShowForm(true)} id="new-payment-btn">
                        + New Payment
                      </button>
                    )}
                  </div>

                  {showForm ? (
                    <form className="pay-form" onSubmit={handleSubmit} noValidate>
                      <div className="pay-form-group">
                        <label htmlFor="pay-payee">Payee Name</label>
                        <input id="pay-payee" name="payeeName" className="pay-input"
                          placeholder="Enter payee name" value={form.payeeName} onChange={handleChange} />
                      </div>
                      <div className="pay-form-row">
                        <div className="pay-form-group">
                          <label htmlFor="pay-amount">Amount (₹)</label>
                          <input id="pay-amount" name="amount" type="number" className="pay-input"
                            placeholder="0" value={form.amount} onChange={handleChange} min="0" step="0.01" />
                        </div>
                        <div className="pay-form-group">
                          <label htmlFor="pay-method">Method</label>
                          <select id="pay-method" name="method" className="pay-select"
                            value={form.method} onChange={handleChange}>
                            {METHODS.map(m => <option key={m} value={m}>{METHOD_LABELS[m]}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="pay-form-row">
                        <div className="pay-form-group">
                          <label htmlFor="pay-category">Category</label>
                          <select id="pay-category" name="category" className="pay-select"
                            value={form.category} onChange={handleChange}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="pay-form-group">
                          <label htmlFor="pay-date">Date</label>
                          <input id="pay-date" name="date" type="date" className="pay-input"
                            value={form.date} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="pay-form-group">
                        <label htmlFor="pay-scheduled">Schedule For (optional)</label>
                        <input id="pay-scheduled" name="scheduledDate" type="date" className="pay-input"
                          value={form.scheduledDate} onChange={handleChange} />
                      </div>
                      <div className="pay-form-group">
                        <label htmlFor="pay-notes">Notes</label>
                        <textarea id="pay-notes" name="notes" className="pay-textarea"
                          placeholder="Add a note..." value={form.notes} onChange={handleChange} />
                      </div>
                      <div className="pay-form-actions">
                        <button type="submit" className="pay-submit-btn" disabled={saving} id="submit-payment-btn">
                          {saving ? 'Processing...' : '💸 Send Payment'}
                        </button>
                        <button type="button" className="pay-cancel-btn"
                          onClick={() => { setShowForm(false); setForm(initialForm); }}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="pay-quick-methods">
                      {METHODS.map(m => (
                        <button key={m} className="pay-method-chip" onClick={() => { setForm({ ...initialForm, method: m }); setShowForm(true); }}>
                          {m === 'CARD' ? Ic.creditCard : m === 'WALLET' ? Ic.wallet : Ic.send}
                          <span>{METHOD_LABELS[m]}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="pay-panel pay-viewer-notice">
                  <div className="pay-empty-icon">{Ic.wallet}</div>
                  <h3>View Only</h3>
                  <p>Only Admins can create payments.</p>
                </div>
              )}

              {/* Upcoming / Scheduled */}
              <div className="pay-panel" id="scheduled-payments-panel">
                <div className="pay-panel-header">
                  <h2>{Ic.clock} Upcoming</h2>
                </div>
                {scheduled.length === 0 ? (
                  <div className="pay-empty-sm">
                    <p>No scheduled payments</p>
                  </div>
                ) : (
                  <div className="pay-scheduled-list">
                    {scheduled.map(p => (
                      <div className="pay-scheduled-item" key={p.id}>
                        <div className="pay-scheduled-info">
                          <span className="pay-scheduled-payee">{p.payeeName}</span>
                          <span className="pay-scheduled-date">{p.scheduledDate}</span>
                        </div>
                        <div className="pay-scheduled-right">
                          <span className="pay-scheduled-amount">{formatCurrency(p.amount)}</span>
                          {isAdmin && (
                            <button className="pay-action-btn complete" onClick={() => handleComplete(p.id)} title="Pay now">
                              {Ic.check}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
