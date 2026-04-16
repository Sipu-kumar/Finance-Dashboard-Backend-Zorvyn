const BASE_URL = 'http://localhost:8080';

function getAuthHeaders() {
  const token = localStorage.getItem('jwt_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

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
 * GET /records — fetch all records for the current user
 */
export async function fetchRecords() {
  let response;
  try {
    response = await fetch(`${BASE_URL}/records`, {
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
    throw new Error('Failed to load records.');
  }

  return response.json();
}

/**
 * POST /records — create new record
 * @param {{ amount: number, type: string, category: string, date: string, notes: string }} record
 */
export async function createRecord(record) {
  let response;
  try {
    response = await fetch(`${BASE_URL}/records`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(record),
    });
  } catch (err) {
    throw new Error('Unable to connect to the server. Please make sure the backend is running.');
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      handleSessionExpired();
      throw new Error('Session expired. Please login again.');
    }
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || 'Failed to add record.');
  }

  return response.json();
}

/**
 * DELETE /records/{id} — delete a record by ID (ADMIN only)
 * @param {number} id
 */
export async function deleteRecord(id) {
  let response;
  try {
    response = await fetch(`${BASE_URL}/records/${id}`, {
      method: 'DELETE',
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
    throw new Error('Failed to delete record.');
  }
}
