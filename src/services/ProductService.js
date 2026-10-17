const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const API_URL = `${API_BASE_URL}/product`

export async function getProducts() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  return response.json()
}

export async function getProductById(id) {
  const response = await fetch(`${API_URL}/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }

  return response.json()
}