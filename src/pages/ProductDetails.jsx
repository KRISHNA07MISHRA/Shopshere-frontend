import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
} from 'lucide-react'
import { getImageUrl } from '../services/ImageService'


import {
  //useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'

import { getProductById } from '../services/ProductService'
import { addCartItem } from '../services/CartService'

function ProductDetails() {
  const { id } = useParams()

  //const location = useLocation()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [cartLoading, setCartLoading] = useState(false)
  const [cartFeedback, setCartFeedback] = useState('')

  // const from = location.state?.from || '/'

  useEffect(() => {
    getProductById(id)
      .then((data) => {
        setProduct(data)
      })
      .catch(() => {
        setError('Unable to load product')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  async function handleAddToCart() {
    const requestedQuantity = Number(quantity)

    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      setCartFeedback('Enter a quantity of at least 1.')
      return
    }

    if (!sessionStorage.getItem('shopshere_token')) {
      navigate('/login')
      return
    }

    setCartFeedback('')
    setCartLoading(true)

    try {
      await addCartItem(product.id, requestedQuantity)
      setCartFeedback('Added to your cart.')
    } catch (cartError) {
      if (cartError.status === 401) {
        navigate('/login')
      } else {
        setCartFeedback(cartError.message || 'Unable to add this product to your cart.')
      }
    } finally {
      setCartLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Loading product...
        </p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Product not found
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
        >
          Back to Home
        </button>
      </div>
    )
  }

  const isOutOfStock = product.stockQuantity === 0

  return (
    <main className="min-h-screen bg-gray-50 py-12">

      <div className="mx-auto max-w-7xl px-6">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex w-fit items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid overflow-hidden rounded-3xl bg-white shadow-sm md:grid-cols-2">

          {/* Image */}
          <div className="flex min-h-[500px] items-center justify-center bg-gray-50 p-10">

            <img
              src={getImageUrl(product.imageUrl)}
              alt={product.name}
              className="max-h-[450px] w-full object-contain"
            />

          </div>

          {/* Details */}
          <div className="flex flex-col justify-center p-8 md:p-12">

            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              {product.brand}
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <p className="mt-5 text-3xl font-bold text-gray-900">
              ₹{product.price}
            </p>

            <p className="mt-6 leading-7 text-gray-600">
              {product.description}
            </p>

            {/* Category */}
            <div className="mt-5">
              <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                {product.category}
              </span>
            </div>

            {/* Stock */}
            <div className="mt-6">

              {isOutOfStock ? (
                <span className="font-semibold text-red-500">
                  Out of Stock
                </span>
              ) : product.stockQuantity <= 10 ? (
                <span className="font-semibold text-orange-500">
                  Only {product.stockQuantity} left
                </span>
              ) : (
                <span className="font-semibold text-green-600">
                  In Stock
                </span>
              )}

            </div>

            {/* Quantity */}
            <div className="mt-8">

              <label className="text-sm font-semibold text-gray-900">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                max={product.stockQuantity}
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                disabled={isOutOfStock}
                className="mt-2 block w-24 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900 disabled:bg-gray-100"
              />

            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3">

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || cartLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 py-4 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >

                <ShoppingCart size={20} />

                {isOutOfStock
                  ? 'Unavailable'
                  : cartLoading
                    ? 'Adding...'
                    : 'Add to Cart'}

              </button>

              <button
                className="flex h-14 w-14 items-center justify-center rounded-xl border border-gray-300 transition hover:bg-gray-100"
                title="Add to wishlist"
              >
                <Heart
                  size={21}
                  strokeWidth={1.8}
                />
              </button>

            </div>

            {cartFeedback && (
              <p role="status" className="mt-4 text-sm font-medium text-stone-600">
                {cartFeedback}
              </p>
            )}

          </div>

        </div>

      </div>

    </main>
  )
}

export default ProductDetails