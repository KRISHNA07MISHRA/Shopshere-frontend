
import { apiRequest } from './api'

export async function login(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  if (!data.token) {
    throw new Error('Login response did not contain a token')
  }

  // Save token across tabs and browser restarts
  localStorage.setItem('shopshere_token', data.token)

  return data
}

export async function register(name, email, password) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

export function logout() {
  localStorage.removeItem('shopshere_token')
}

export function getToken() {
  return localStorage.getItem('shopshere_token')
}

export async function getCurrentUser() {
  return apiRequest('/auth/me')
}
