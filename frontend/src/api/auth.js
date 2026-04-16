const BASE_URL = 'http://localhost:8080';

/**
 * POST /auth/login
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} JWT token
 */
export async function loginUser(email, password) {
  let response;
  try {
    response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch (err) {
    throw new Error('Unable to connect to the server. Please make sure the backend is running.');
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid email or password.');
    }
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || 'Login failed. Please try again.');
  }

  // Backend returns JWT string (may be wrapped in JSON quotes)
  let token = await response.text();
  // Strip surrounding quotes if present (Spring Boot wraps String returns in JSON quotes)
  token = token.replace(/^"|"$/g, '').trim();
  return token;
}

/**
 * GET /users/me — fetch the current user's profile (name, email, role)
 * @returns {Promise<{ name: string, email: string, role: string }>}
 */
export async function fetchCurrentUser() {
  const token = localStorage.getItem('jwt_token');
  let response;
  try {
    response = await fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw new Error('Unable to connect to the server.');
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('SESSION_EXPIRED');
    }
    throw new Error('Failed to fetch user profile.');
  }

  return response.json();
}

/**
 * POST /users  (signup / register)
 * @param {{ fullName: string, email: string, password: string }} data
 * @returns {Promise<object>} created user
 */
export async function registerUser({ fullName, email, password }) {
  let response;
  try {
    response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: fullName, email, password }),
    });
  } catch (err) {
    throw new Error('Unable to connect to the server. Please make sure the backend is running.');
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || 'Registration failed. Please try again.');
  }

  return response.json();
}
