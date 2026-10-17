import {
  Search,
  Heart,
  ShoppingCart,
  ShoppingBag,
  UserRound,
} from 'lucide-react'

import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  // Home navigation
  const goHome = () => {
    if (location.pathname !== '/home') {
      navigate('/home', { replace: true })
    }
  }

  // Products navigation
  const goProducts = () => {
    if (location.pathname !== '/products') {
      navigate('/products', { replace: true })
    }
  }

  // Categories / Deals navigation
  const goToSection = (sectionId) => {
    if (location.pathname !== '/home') {
      navigate('/home', {
        replace: true,
        state: { scrollTo: sectionId },
      })
      return
    }

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#fcfbf8]/90 shadow-sm shadow-stone-900/[0.02] backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6">

        {/* Logo */}
        <button
          onClick={goHome}
          className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-stone-900 sm:text-2xl"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-900 text-amber-200 shadow-lg shadow-stone-900/15">
            <ShoppingBag size={20} strokeWidth={1.8} />
          </span>
          <span>Shop<span className="text-amber-700">Shere</span></span>
        </button>

        {/* Navigation */}
        <div className="hidden items-center gap-1 rounded-full bg-stone-100/80 p-1 md:flex">
          <button
            onClick={goHome}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              location.pathname === '/home'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Home
          </button>

          <button
            onClick={goProducts}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              location.pathname === '/products'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Products
          </button>

          <button
            onClick={() => goToSection('categories')}
            className="rounded-full px-4 py-2 text-sm font-semibold text-stone-500 transition hover:text-stone-900"
          >
            Categories
          </button>

          <button
            onClick={() => goToSection('deals')}
            className="rounded-full px-4 py-2 text-sm font-semibold text-stone-500 transition hover:text-stone-900"
          >
            Deals
          </button>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() =>
              navigate('/products', {
                replace: true,
                state: { focusSearch: true },
              })
            }
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 transition hover:border-stone-300 hover:bg-stone-100 hover:text-stone-950"
            title="Search"
            aria-label="Search products"
          >
            <Search size={19} strokeWidth={1.8} />
          </button>

          <button
            onClick={() => navigate(user ? '/wishlist' : '/login')}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-60"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart size={19} strokeWidth={1.8} />
          </button>

          <button
            onClick={() => navigate(user ? '/cart' : '/login')}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 transition hover:border-stone-300 hover:bg-stone-100 hover:text-stone-950"
            title="Cart"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={19} strokeWidth={1.8} />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                if (loading) return

                if (user) {
                  navigate('/profile')
                } else {
                  navigate('/login')
                }
              }}
              disabled={loading}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 transition hover:border-stone-300 hover:bg-stone-100 hover:text-stone-950 disabled:opacity-60"
              title={user ? 'My Profile' : 'Login / Register'}
              aria-label={user ? 'My Profile' : 'Login or register'}
            >
              <UserRound size={19} strokeWidth={1.8} />
            </button>

            {/* {user && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
                <p className="font-semibold text-gray-900">
                  {user.name || 'My Account'}
                </p>

                <p className="mt-1 break-all text-sm text-gray-500">
                  {user.email || user.username}
                </p>

                <button
                  onClick={() => {
                    logout()
                    navigate('/home', { replace: true })
                  }}
                  className="mt-4 w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar