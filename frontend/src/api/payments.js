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

async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, { ...options, headers: getAuthHeaders() });
  } catch (err) {
    throw new Error('Unable to connect to the server. Please make sure the backend is running.');
  }
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      handleSessionExpired();
      throw new Error('Session expired. Please login again.');
    }
    const text = await response.text().catch(() => '');
    throw new Error(text || 'Request failed.');
  }
  // 204 No Content
  if (response.status === 204) return null;
  return response.json();
}

/** GET /payments — all payments, optional ?status=COMPLETED|PENDING|FAILED|SCHEDULED */
export async function fetchPayments(status) {
  const qs = status ? `?status=${status}` : '';
  return request(`${BASE_URL}/payments${qs}`);
}

/** GET /payments/scheduled — upcoming scheduled payments */
export async function fetchScheduledPayments() {
  return request(`${BASE_URL}/payments/scheduled`);
}

/** GET /payments/stats — { totalPaid, pendingCount, totalPayments } */
export async function fetchPaymentStats() {
  return request(`${BASE_URL}/payments/stats`);
}

/** POST /payments — create a new payment */
export async function createPayment(payment) {
  return request(`${BASE_URL}/payments`, {
    method: 'POST',
    body: JSON.stringify(payment),
  });
}

/** PATCH /payments/:id/complete — mark payment as completed */
export async function completePayment(id) {
  return request(`${BASE_URL}/payments/${id}/complete`, { method: 'PATCH' });
}

/** DELETE /payments/:id */
export async function deletePayment(id) {
  return request(`${BASE_URL}/payments/${id}`, { method: 'DELETE' });
}
