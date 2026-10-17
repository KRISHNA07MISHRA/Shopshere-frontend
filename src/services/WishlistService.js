
import { apiRequest } from './api'

export const getWishlist = async () => {
  return apiRequest('/wishlist')
}

export const addToWishlist = async (productId) => {
  return apiRequest(`/wishlist/${productId}`, { method: 'POST' })
}

export const removeFromWishlist = async (productId) => {
  return apiRequest(`/wishlist/${productId}`, { method: 'DELETE' })
}
