import { useEffect, useMemo, useState ,useRef} from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../services/ProductService'
import {
  useSearchParams,
  useLocation
} from 'react-router-dom'

function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  
  const [sort, setSort] = useState('default')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()

  const categoryFromUrl = searchParams.get('category')
  const [category, setCategory] = useState(
    categoryFromUrl || 'All'
  )
  const location = useLocation()
  const searchInputRef = useRef(null)

  useEffect(() => {
    if (location.state?.focusSearch) {
      searchInputRef.current?.focus()
    }
  }, [location.state])

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data.filter((product) => product.active))
      })
      .catch(() => {
        setError('Unable to load products')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category)),
    ]

    return ['All', ...uniqueCategories]
  }, [products])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (search.trim()) {
      const searchText = search.toLowerCase()

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchText) ||
          product.brand.toLowerCase().includes(searchText)
      )
    }

    if (category !== 'All') {
      result = result.filter(
        (product) => product.category === category
      )
    }

    if (sort === 'price-low') {
      result.sort((a, b) => a.price - b.price)
    }

    if (sort === 'price-high') {
      result.sort((a, b) => b.price - a.price)
    }

    if (sort === 'name') {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    }

    return result
  }, [products, search, category, sort])

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Shop Collection
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
            All Products
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Discover products from trusted brands and find something
            perfect for you.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={19} />

            <h2 className="font-semibold text-gray-900">
              Filter & Sort
            </h2>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">

            {/* Search */}
            <div className="flex items-center rounded-xl border border-gray-300 bg-white px-4">
              <Search
                size={18}
                className="mr-3 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search products or brands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-3 text-sm outline-none"
                ref = {searchInputRef}
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => {
                const value = e.target.value

                setCategory(value)

                if (value === 'All') {
                  searchParams.delete('category')
                } else {
                  searchParams.set('category', value)
                }

                setSearchParams(searchParams, { replace: true })
              }}
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === 'All'
                    ? 'All Categories'
                    : item}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900"
            >
              <option value="default">
                Sort By
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="name">
                Name: A to Z
              </option>
            </select>

          </div>
        </div>

        {/* Result Count */}
        {!loading && !error && (
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Showing{' '}
              <span className="font-semibold text-gray-900">
                {filteredProducts.length}
              </span>{' '}
              products
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <p className="text-gray-500">
              Loading products...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 p-6 text-center">
            <p className="font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                No products found
              </h2>

              <p className="mt-2 text-gray-500">
                Try changing your search or filters.
              </p>
            </div>
          )}

        {/* Products */}
        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}

      </div>
    </main>
  )
}

export default Products