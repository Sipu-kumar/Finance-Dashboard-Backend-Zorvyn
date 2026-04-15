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
