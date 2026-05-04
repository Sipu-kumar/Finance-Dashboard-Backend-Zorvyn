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

/**
 * GET /dashboard/performance?months=6|12
 * Returns { balanceTrend, spendingByCategory, monthlyComparison }
 */
export async function fetchPerformanceData(months = 6) {
  let response;
  try {
    response = await fetch(`${BASE_URL}/dashboard/performance?months=${months}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  } catch (err) {
    throw new Error('Unable to connect to the server. Please make sure the backend is running.');
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      handleSessionExpired();
      throw new Error('Session expired. Please login again.');
    }
    throw new Error('Failed to load performance data.');
  }

  return response.json();
}
