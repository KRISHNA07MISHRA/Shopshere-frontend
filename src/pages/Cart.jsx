import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { getImageUrl } from '../services/ImageService'
import { getCart, removeCartItem, updateCartItem } from '../services/CartService'

const formatPrice = (amount) =>
  `₹${Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

function Cart() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busyItemId, setBusyItemId] = useState(null)
  const [error, setError] = useState('')

  const refreshCart = useCallback(async () => {
    const data = await getCart()
    setCart({ ...data, items: Array.isArray(data?.items) ? data.items : [] })
  }, [])

  useEffect(() => {
    let cancelled = false

    getCart()
      .then((data) => {
        if (!cancelled) {
          setCart({ ...data, items: Array.isArray(data?.items) ? data.items : [] })
        }
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(
            loadError.status === 401
              ? 'Please sign in to view your cart.'
              : 'Unable to load your cart. Please try again.'
          )
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function changeQuantity(item, quantity) {
    if (quantity < 1 || busyItemId !== null) return

    setError('')
    setBusyItemId(item.id)

    try {
      await updateCartItem(item.id, quantity)
      await refreshCart()
    } catch (updateError) {
      setError(
        updateError.status === 401
          ? 'Please sign in again to update your cart.'
          : updateError.message || 'Unable to update this quantity.'
      )
    } finally {
      setBusyItemId(null)
    }
  }

  async function handleRemove(itemId) {
    if (busyItemId !== null) return

    setError('')
    setBusyItemId(itemId)

    try {
      await removeCartItem(itemId)
      await refreshCart()
    } catch (removeError) {
      setError(
        removeError.status === 401
          ? 'Please sign in again to update your cart.'
          : removeError.message || 'Unable to remove this item.'
      )
    } finally {
      setBusyItemId(null)
    }
  }

  const items = cart?.items || []
  const totalItems = cart?.totalItems ?? items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cart?.totalAmount ?? items.reduce((sum, item) => sum + Number(item.subtotal || 0), 0)

  return (
    <main className="min-h-screen bg-[#f4f1eb] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <Link
          to="/products"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-stone-950"
        >
          <ArrowLeft size={17} /> Continue shopping
        </Link>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Your picks</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">Shopping cart</h1>
          </div>
          {!loading && items.length > 0 && (
            <p className="text-sm font-medium text-stone-500">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>

        {error && (
          <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800">
            <span>{error}</span>
            {error.toLowerCase().includes('sign in') && (
              <Link to="/login" className="font-bold underline">Sign in</Link>
            )}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center text-stone-500 shadow-sm">
            Loading your cart...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-stone-200 bg-white px-6 py-16 text-center shadow-sm sm:py-20">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
              <ShoppingBag size={28} />
            </span>
            <h2 className="mt-5 text-2xl font-semibold text-stone-900">Your cart is taking a little break</h2>
            <p className="mt-2 text-stone-500">Add something you love and it’ll show up here.</p>
            <Link
              to="/products"
              className="mt-7 inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-stone-700"
            >
              Explore products
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
            <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
              <ul className="divide-y divide-stone-100">
                {items.map((item) => (
                  <li key={item.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
                    <Link
                      to={`/products/${item.productId}`}
                      className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f5f2ec] p-3 sm:h-28 sm:w-32"
                    >
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.productName}
                        className="h-full w-full object-contain"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link to={`/products/${item.productId}`} className="font-semibold text-stone-900 transition hover:text-amber-800">
                        {item.productName}
                      </Link>
                      <p className="mt-1 text-sm text-stone-500">Unit price: {formatPrice(item.unitPrice)}</p>
                      <p className="mt-2 font-bold text-stone-900 sm:hidden">{formatPrice(item.subtotal)}</p>
                    </div>

                    <div className="flex items-center justify-between gap-5 sm:justify-end">
                      <div className="flex items-center rounded-full border border-stone-200 bg-stone-50 p-1">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.productName}`}
                          onClick={() => changeQuantity(item, item.quantity - 1)}
                          disabled={busyItemId !== null || item.quantity <= 1}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-stone-600 transition hover:bg-white hover:text-stone-950 disabled:opacity-40"
                        >
                          <Minus size={15} />
                        </button>
                        <span className="w-9 text-center text-sm font-semibold text-stone-900">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.productName}`}
                          onClick={() => changeQuantity(item, item.quantity + 1)}
                          disabled={busyItemId !== null}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-stone-600 transition hover:bg-white hover:text-stone-950 disabled:opacity-40"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <p className="hidden w-24 text-right font-bold text-stone-900 sm:block">{formatPrice(item.subtotal)}</p>

                      <button
                        type="button"
                        aria-label={`Remove ${item.productName} from cart`}
                        title="Remove item"
                        onClick={() => handleRemove(item.id)}
                        disabled={busyItemId !== null}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-stone-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <aside className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold text-stone-900">Order summary</h2>
              <div className="mt-6 flex justify-between text-sm text-stone-600">
                <span>Items ({totalItems})</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="mt-4 flex justify-between border-t border-stone-100 pt-4 text-base font-bold text-stone-900">
                <span>Total</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <p className="mt-3 text-xs leading-5 text-stone-500">Shipping and any applicable taxes are calculated at checkout.</p>
              <button
                type="button"
                disabled
                className="mt-6 w-full cursor-not-allowed rounded-full bg-stone-900 px-5 py-3.5 text-sm font-bold text-white opacity-60"
                title="Checkout is not available yet"
              >
                Checkout coming soon
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}

export default Cart
