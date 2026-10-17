
import { useEffect, useState } from 'react'
import { Heart, ShoppingCart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { getImageUrl } from '../services/ImageService'
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../services/WishlistService'
import { addCartItem } from '../services/CartService'

function ProductCard({ product }) {
  const isOutOfStock = product.stockQuantity === 0

  const [isWishlisted, setIsWishlisted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cartLoading, setCartLoading] = useState(false)
  const [cartFeedback, setCartFeedback] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    if (!sessionStorage.getItem('shopshere_token')) {

      return () => {
        cancelled = true
      }
    }

    getWishlist()
      .then((items) => {
        if (!cancelled) {
          setIsWishlisted(
            items.some(
              (item) => Number(item.product?.id) === Number(product.id)
            )
          )
        }
      })
      .catch(() => {
        // Keep the product card usable if wishlist loading fails.
      })

    return () => {
      cancelled = true
    }
  }, [product.id])

  const handleWishlistClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (loading) return

    if (!sessionStorage.getItem('shopshere_token')) {
      navigate('/login')
      return
    }

    setError('')
    setLoading(true)

    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id)
        setIsWishlisted(false)
      } else {
        await addToWishlist(product.id)
        setIsWishlisted(true)
      }
    } catch (err) {
      if (err.status === 401) {
        navigate('/login')
      } else {
        setError('Wishlist update failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (cartLoading) return

    if (!sessionStorage.getItem('shopshere_token')) {
      navigate('/login')
      return
    }

    setCartFeedback('')
    setCartLoading(true)

    try {
      await addCartItem(product.id, 1)
      setCartFeedback('Added to cart')
    } catch (cartError) {
      if (cartError.status === 401) {
        navigate('/login')
      } else {
        setCartFeedback(cartError.message || 'Unable to add this item')
      }
    } finally {
      setCartLoading(false)
    }
  }

  return (
    <article
      className="group block overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm shadow-stone-900/[0.04] transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl hover:shadow-stone-900/[0.1]"
    >
      <div className="relative m-2 flex h-56 items-center justify-center overflow-hidden rounded-[1.4rem] bg-[#f5f2ec] sm:m-3 sm:h-64">
        <Link
          to={`/products/${product.id}`}
          className="flex h-full w-full items-center justify-center"
        >
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
          />
        </Link>

        <button
          type="button"
          onClick={handleWishlistClick}
          disabled={loading}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white/95 text-stone-700 shadow-md transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
        >
          <Heart
            size={18}
            strokeWidth={1.8}
            fill={isWishlisted ? 'currentColor' : 'none'}
            className={isWishlisted ? 'text-red-500' : ''}
          />
        </button>
      </div>

      <div className="px-5 pb-5 pt-2 sm:px-6">
        <Link to={`/products/${product.id}`} className="block">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-700">
          {product.brand}
        </p>

        <h3 className="mt-2 truncate text-base font-semibold text-stone-900 sm:text-lg">
          {product.name}
        </h3>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-stone-900">
            ₹{product.price}
          </span>

          {isOutOfStock ? (
            <span className="text-xs font-semibold text-red-500">
              Out of Stock
            </span>
          ) : product.stockQuantity <= 10 ? (
            <span className="text-xs font-semibold text-orange-500">
              Only {product.stockQuantity} left
            </span>
          ) : (
            <span className="text-xs font-semibold text-green-600">
              In Stock
            </span>
          )}
        </div>
        </Link>

        {error && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock || cartLoading}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <ShoppingCart size={18} />
          {isOutOfStock
            ? 'Unavailable'
            : cartLoading
              ? 'Adding...'
              : cartFeedback || 'Add to Cart'}
        </button>
      </div>
    </article>
  )
}

export default ProductCard
