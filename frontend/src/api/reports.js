const BASE_URL = 'http://localhost:8080';

function getAuthHeaders() {
  const token = localStorage.getItem('jwt_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

function handleSessionExpired() {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_name');
  window.location.href = '/login?session=expired';
}

async function safeFetch(url, options) {
  let response;
  try {
    response = await fetch(url, options);
  } catch (err) {
    throw new Error('Unable to connect to the server. Please make sure the backend is running.');
  }
  if (response.status === 401 || response.status === 403) {
    handleSessionExpired();
    throw new Error('Session expired. Please login again.');
  }
  return response;
}

/**
 * POST /reports/monthly — Generate monthly report
 */
export async function generateMonthlyReport() {
  const response = await safeFetch(`${BASE_URL}/reports/monthly`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || 'Failed to generate monthly report.');
  }
  return response.json();
}

/**
 * POST /reports/quarterly — Generate quarterly report
 */
export async function generateQuarterlyReport() {
  const response = await safeFetch(`${BASE_URL}/reports/quarterly`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || 'Failed to generate quarterly report.');
  }
  return response.json();
}

/**
 * POST /reports/annual — Generate annual report
 */
export async function generateAnnualReport() {
  const response = await safeFetch(`${BASE_URL}/reports/annual`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || 'Failed to generate annual report.');
  }
  return response.json();
}

/**
 * POST /reports/custom — Generate custom date range report
 */
export async function generateCustomReport(startDate, endDate) {
  const response = await safeFetch(`${BASE_URL}/reports/custom`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ startDate, endDate }),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || 'Failed to generate custom report.');
  }
  return response.json();
}

/**
 * GET /reports — Fetch all reports for current user
 */
export async function fetchReports() {
  const response = await safeFetch(`${BASE_URL}/reports`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to load reports.');
  return response.json();
}

/**
 * DELETE /reports/{id} — Delete a report
 */
export async function deleteReport(id) {
  const response = await safeFetch(`${BASE_URL}/reports/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete report.');
}
