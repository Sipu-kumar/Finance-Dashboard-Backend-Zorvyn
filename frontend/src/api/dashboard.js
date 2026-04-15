const BASE_URL = 'http://localhost:8080';

/**
 * GET /dashboard/summary
 * Requires JWT token in Authorization header
 * @returns {Promise<{ totalIncome: number, totalExpense: number, balance: number }>}
 */
export async function fetchDashboardSummary() {
  const token = localStorage.getItem('jwt_token');

  const response = await fetch(`${BASE_URL}/dashboard/summary`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Token expired or invalid — clear and redirect
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_email');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    throw new Error('Failed to load dashboard data.');
  }

  return response.json();
}
