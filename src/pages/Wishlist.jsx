import { useEffect, useState } from 'react'
import { Heart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../services/ImageService'
import { getWishlist, removeFromWishlist } from '../services/WishlistService'

function Wishlist() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    getWishlist()
      .then((data) => {
        const entries = Array.isArray(data)
          ? data
          : data?.items || data?.content || []
        const wishlistProducts = entries
          .map((entry) => entry?.product || entry)
          .filter((product) => product?.id != null)

        if (!cancelled) setProducts(wishlistProducts)
      })
      .catch(() => {
        if (!cancelled) {
          setError('Unable to load your wishlist. Please sign in and try again.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleRemove(productId) {
    setError('')
    setRemovingId(productId)

    try {
      await removeFromWishlist(productId)
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId)
      )
    } catch (removeError) {
      setError(
        removeError.status === 401
          ? 'Please sign in again to update your wishlist.'
          : 'Unable to remove this product. Please try again.'
      )
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gray-500">
            <Heart size={16} /> Saved for later
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
            My Wishlist
          </h1>
          <p className="mt-3 text-gray-600">
            Products you have saved for later.
          </p>
        </div>

        {error && (
          <p role="alert" className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p className="py-16 text-center text-gray-500">Loading your wishlist...</p>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center">
            <Heart className="mx-auto text-gray-400" size={32} />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Your wishlist is empty
            </h2>
            <p className="mt-2 text-gray-500">
              Save products with the heart button and they will appear here.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <Link to={`/products/${product.id}`} className="block">
                  <div className="flex h-56 items-center justify-center bg-gray-50 p-5">
                    <img
                      src={getImageUrl(product.imageUrl)}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      {product.brand}
                    </p>
                    <h2 className="mt-2 truncate font-semibold text-gray-900">
                      {product.name}
                    </h2>
                    <p className="mt-3 text-lg font-bold text-gray-900">
                      ₹{product.price}
                    </p>
                  </div>
                </Link>
                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={() => handleRemove(product.id)}
                    disabled={removingId === product.id}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                  >
                    <Trash2 size={17} />
                    {removingId === product.id ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Wishlist
