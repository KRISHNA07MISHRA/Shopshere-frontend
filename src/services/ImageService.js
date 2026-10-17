const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const BACKEND_URL = API_BASE_URL.startsWith('http') ? API_BASE_URL : '/backend'

export function getImageUrl(imageUrl) {
  if (!imageUrl) {
    return '/placeholder-product.png'
  }

  if (imageUrl.startsWith('http')) {
    return imageUrl
  }

  return `${BACKEND_URL}${imageUrl}`
}