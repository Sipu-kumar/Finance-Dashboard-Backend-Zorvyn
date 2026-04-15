const BASE_URL = 'http://localhost:8080';

function getAuthHeaders() {
  const token = localStorage.getItem('jwt_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

/**
 * GET /records — fetch all records for the current user
 */
export async function fetchRecords() {
  const response = await fetch(`${BASE_URL}/records`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Unauthorized. Please login again.');
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
  const response = await fetch(`${BASE_URL}/records`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('You do not have permission to add records.');
    }
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to add record.');
  }

  return response.json();
}

/**
 * DELETE /records/{id} — delete a record by ID (ADMIN only)
 * @param {number} id
 */
export async function deleteRecord(id) {
  const response = await fetch(`${BASE_URL}/records/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('You do not have permission to delete records.');
    }
    throw new Error('Failed to delete record.');
  }
}
