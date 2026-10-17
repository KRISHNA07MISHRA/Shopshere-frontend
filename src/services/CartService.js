import { apiRequest } from './api'

export function getCart() {
  return apiRequest('/cart')
}

export function getCartItems() {
  return apiRequest('/cart/items')
}

export function addCartItem(productId, quantity = 1) {
  return apiRequest('/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  })
}

export function updateCartItem(itemId, quantity) {
  return apiRequest(`/cart/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  })
}

export function removeCartItem(itemId) {
  return apiRequest(`/cart/items/${itemId}`, { method: 'DELETE' })
}
