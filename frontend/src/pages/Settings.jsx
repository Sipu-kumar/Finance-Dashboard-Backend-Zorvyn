import { useState } from 'react';
import { fetchRecords } from '../api/records';
import AppLayout from '../components/AppLayout';
import './Settings.css';

/* ─── SVG Icons ────────────────────────────────────────── */
const SettingsIcons = {
  database: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  upload: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
  ),
  gear: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

/* ─── CSV Export Utility ───────────────────────────────── */
function downloadCSV(records) {
  if (!records || records.length === 0) {
    alert('No data to export.');
    return;
  }
  const headers = ['Date', 'Category', 'Type', 'Amount', 'Notes'];
  const rows = records.map(r =>
    [r.date, r.category, r.type, r.amount, `"${(r.notes || '').replace(/"/g, '""')}"`].join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `finance_data_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── CSV Import Parser ────────────────────────────────── */
function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  // Skip header row
  return lines.slice(1).map(line => {
    const parts = line.split(',');
    return {
      date: parts[0]?.trim(),
      category: parts[1]?.trim(),
      type: parts[2]?.trim(),
      amount: parseFloat(parts[3]?.trim()) || 0,
      notes: (parts[4] || '').replace(/^"|"$/g, '').trim(),
    };
  });
}

/* ─── Settings Page ────────────────────────────────────── */
export default function Settings() {
  // System settings (persisted in localStorage)
  const [autoSave, setAutoSave] = useState(() => {
    return localStorage.getItem('settings_autosave') !== 'false';
  });
  const [animations, setAnimations] = useState(() => {
    return localStorage.getItem('settings_animations') !== 'false';
  });
  const [dateFormat, setDateFormat] = useState(() => {
    return localStorage.getItem('settings_date_format') || 'DD/MM/YYYY';
  });

  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  function showSuccess(msg) {
    setSuccessMsg(msg);
    setErrorMsg('');
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  function showError(msg) {
    setErrorMsg(msg);
    setSuccessMsg('');
    setTimeout(() => setErrorMsg(''), 4000);
  }

  /* ─── Export All Data ──────────────────────────────── */
  async function handleExport() {
    setExporting(true);
    try {
      const records = await fetchRecords();
      downloadCSV(records);
      showSuccess('Data exported successfully!');
    } catch (err) {
      showError(err.message || 'Failed to export data.');
    } finally {
      setExporting(false);
    }
  }

  /* ─── Import Data ──────────────────────────────────── */
  function handleImportClick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setImporting(true);
      try {
        const text = await file.text();
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          showError('CSV file is empty or has invalid format.');
          return;
        }

        // Import records one by one via the existing API
        const { createRecord } = await import('../api/records');
        let successCount = 0;
        for (const rec of parsed) {
          try {
            await createRecord(rec);
            successCount++;
          } catch {
            // Skip failed records
          }
        }
        showSuccess(`Imported ${successCount} of ${parsed.length} records.`);
      } catch (err) {
        showError(err.message || 'Failed to import data.');
      } finally {
        setImporting(false);
      }
    };
    input.click();
  }

  /* ─── Clear All Data ───────────────────────────────── */
  async function handleClearAll() {
    if (!window.confirm('⚠️ Are you sure you want to permanently delete ALL your transaction data? This action cannot be undone.')) {
      return;
    }
    try {
      const records = await fetchRecords();
      if (records.length === 0) {
        showError('No records to delete.');
        return;
      }
      const { deleteRecord } = await import('../api/records');
      let deleted = 0;
      for (const rec of records) {
        try {
          await deleteRecord(rec.id);
          deleted++;
        } catch {
          // skip
        }
      }
      showSuccess(`Deleted ${deleted} records.`);
    } catch (err) {
      showError(err.message || 'Failed to clear data.');
    }
  }

  /* ─── Save System Settings ─────────────────────────── */
  function handleSaveSettings() {
    localStorage.setItem('settings_autosave', String(autoSave));
    localStorage.setItem('settings_animations', String(animations));
    localStorage.setItem('settings_date_format', dateFormat);

    // Toggle animations globally
    if (!animations) {
      document.documentElement.style.setProperty('--transition', 'none');
    } else {
      document.documentElement.style.setProperty('--transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
    }

    showSuccess('Settings saved successfully!');
  }

  return (
    <AppLayout title="Settings">

      {/* ─── Alerts ─── */}
      {successMsg && <div className="settings-alert settings-alert-success">{successMsg}</div>}
      {errorMsg && <div className="settings-alert settings-alert-error">{errorMsg}</div>}

      {/* ─── Settings Grid ─── */}
      <div className="settings-grid">

        {/* ─── Data Management Card ─── */}
        <div className="settings-card" id="data-management-card">
          <div className="settings-card-header">
            <h2>Data Management</h2>
            <span className="settings-card-icon">{SettingsIcons.database}</span>
          </div>

          <div className="settings-card-body">
            <button
              className="settings-action-btn export"
              onClick={handleExport}
              disabled={exporting}
              id="export-data-btn"
            >
              {SettingsIcons.download}
              {exporting ? 'Exporting...' : 'Export All Data'}
            </button>
            <p className="settings-action-desc">Download all your financial data as CSV</p>

            <button
              className="settings-action-btn import"
              onClick={handleImportClick}
              disabled={importing}
              id="import-data-btn"
            >
              {SettingsIcons.upload}
              {importing ? 'Importing...' : 'Import Data'}
            </button>
            <p className="settings-action-desc">Import transactions from CSV file</p>

            <button
              className="settings-action-btn danger"
              onClick={handleClearAll}
              id="clear-data-btn"
            >
              {SettingsIcons.trash}
              Clear All Data
            </button>
            <p className="settings-action-desc">Permanently delete all transaction data</p>
          </div>
        </div>

        {/* ─── System Settings Card ─── */}
        <div className="settings-card" id="system-settings-card">
          <div className="settings-card-header">
            <h2>System</h2>
            <span className="settings-card-icon">{SettingsIcons.gear}</span>
          </div>

          <div className="settings-card-body">
            {/* Auto-save Toggle */}
            <label className="settings-toggle" id="autosave-toggle">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
              />
              <span className="toggle-switch" />
              <span className="toggle-label">Auto-save</span>
            </label>
            <p className="settings-action-desc">Automatically save changes to localStorage</p>

            {/* Animations Toggle */}
            <label className="settings-toggle" id="animations-toggle">
              <input
                type="checkbox"
                checked={animations}
                onChange={(e) => setAnimations(e.target.checked)}
              />
              <span className="toggle-switch" />
              <span className="toggle-label">Animations</span>
            </label>
            <p className="settings-action-desc">Enable UI animations and transitions</p>

            {/* Date Format */}
            <div className="settings-select-group">
              <label className="settings-select-label" htmlFor="date-format-select">Date Format</label>
              <select
                id="date-format-select"
                className="settings-select"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            {/* Save Button */}
            <button
              className="settings-save-btn"
              onClick={handleSaveSettings}
              id="save-settings-btn"
            >
              Save Settings
            </button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
