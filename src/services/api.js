
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('shopshere_token')

  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const responseBody = await response.text()
    let message = `Request failed with status ${response.status}`

    if (responseBody) {
      try {
        const body = JSON.parse(responseBody)
        message = body.message || body.detail || body.title || message
      } catch {
        message = responseBody
      }
    }

    const error = new Error(message)
    error.status = response.status
    throw error
  }

  if (response.status === 204) {
    return null
  }

  const responseBody = await response.text()
  return responseBody ? JSON.parse(responseBody) : null
}
