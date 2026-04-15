const BASE_URL = 'http://localhost:8080';

/**
 * POST /auth/login
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} JWT token
 */
export async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Invalid email or password');
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
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
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
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: fullName, email, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Registration failed. Please try again.');
  }

  return response.json();
}
