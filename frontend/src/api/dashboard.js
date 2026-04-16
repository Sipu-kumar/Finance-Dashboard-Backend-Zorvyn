const BASE_URL = 'http://localhost:8080';

/**
 * Handle session expiry — clear storage and redirect to login
 */
function handleSessionExpired() {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_name');
  window.location.href = '/login?session=expired';
}

/**
 * GET /dashboard/summary
 * Requires JWT token in Authorization header
 * @returns {Promise<{ totalIncome: number, totalExpense: number, balance: number }>}
 */
export async function fetchDashboardSummary() {
  const token = localStorage.getItem('jwt_token');

  let response;
  try {
    response = await fetch(`${BASE_URL}/dashboard/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw new Error('Unable to connect to the server. Please make sure the backend is running.');
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      handleSessionExpired();
      throw new Error('Session expired. Please login again.');
    }
    throw new Error('Failed to load dashboard data.');
  }

  return response.json();
}
