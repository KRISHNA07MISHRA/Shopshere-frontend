import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { getProducts } from '../services/ProductService'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function ProductGrid() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getProducts()
    .then((data) => {
      setProducts(
        data.filter(
          (product) =>
            product.active === true &&
            product.trending === true
        )
      )
    })
      .catch(() => {
        setError('Unable to load products')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <section className="bg-[#f4f1eb] py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-10 flex items-end justify-between">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
              Handpicked for you
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              Trending right now
            </h2>

            <p className="mt-3 text-stone-600">
              A few favorites we think you’ll love, too.
            </p>
          </div>

          <Link
            to="/products"
            className="hidden items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:gap-3 hover:border-stone-400 hover:shadow-md sm:flex"
          >
            View All Products
            <ArrowRight size={18} />
          </Link>

        </div>

        {loading && (
          <p className="text-gray-500">
            Loading products...
          </p>
        )}

        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-gray-500">
            No products available.
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

export default ProductGrid