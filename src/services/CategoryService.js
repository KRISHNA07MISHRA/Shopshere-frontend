const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const API_URL = `${API_BASE_URL}/category`

export async function getCategories() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }

  return response.json()
}