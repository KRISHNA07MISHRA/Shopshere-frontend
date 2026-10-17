import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories } from '../services/CategoryService'
import { getProducts } from '../services/ProductService'
import { getImageUrl } from '../services/ImageService'

function Categories() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadCategories() {
      const [categoryResult, productResult] = await Promise.allSettled([
        getCategories(),
        getProducts(),
      ])

      if (!isMounted) return

      if (categoryResult.status === 'fulfilled' && Array.isArray(categoryResult.value)) {
        setCategories(
          categoryResult.value.filter(
            (category) => category && category.active !== false
          )
        )
      } else {
        setError('Unable to load categories. Please check that the backend is running.')
      }

      if (productResult.status === 'fulfilled' && Array.isArray(productResult.value)) {
        setProducts(
          productResult.value.filter(
            (product) => product && product.active !== false
          )
        )
      }

      setLoading(false)
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  const categoryWithCount = categories.map((category) => {
    const count = products.filter(
      (product) => product.category === category.name
    ).length

    return {
      ...category,
      count,
    }
  })

  if (loading) {
    return (
      <section id="categories" className="bg-[#fcfbf8] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-gray-500">
            Loading categories...
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="categories"
      className="bg-[#fcfbf8] py-20"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
              Find your fit
          </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              Shop by category
            </h2>

            <p className="mt-3 max-w-xl text-stone-600">
              The things you love, thoughtfully gathered in one place.
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
          {error ? (
            <p className="col-span-full text-center text-gray-500">{error}</p>
          ) : categoryWithCount.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No categories are available yet.
            </p>
          ) : categoryWithCount.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="group block overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm shadow-stone-900/[0.03] transition duration-300 hover:-translate-y-1.5 hover:border-amber-200 hover:shadow-xl hover:shadow-stone-900/[0.08]"
            >

              {/* Image */}
              <div className="m-2 flex h-32 items-center justify-center overflow-hidden rounded-[1.35rem] bg-[#f5f2ec] p-4 sm:m-3 sm:h-40 sm:p-5">

                <img
                  src={getImageUrl(category.imageUrl)}
                  alt={category.name}
                  className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                />

              </div>

              {/* Information */}
              <div className="flex items-center justify-between gap-2 px-4 pb-4 pt-2 sm:px-5 sm:pb-5">

                <h3 className="text-sm font-semibold text-stone-900 sm:text-base">
                  {category.name}
                </h3>

                <p className="shrink-0 text-xs text-stone-500">
                  {category.count} items
                </p>

              </div>

            </Link>
          ))}

        </div>

      </div>
    </section>
  )
}

export default Categories