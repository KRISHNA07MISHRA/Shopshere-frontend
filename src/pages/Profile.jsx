import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-gray-500">Loading your profile...</p>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900">Please sign in</h1>
        <p className="mt-2 text-gray-500">
          You need to log in to view your profile.
        </p>
        <button
          onClick={() => navigate('/login', { replace: true })}
          className="mt-5 rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-700"
        >
          Go to Login
        </button>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-2 text-gray-500">
          Manage your ShopShere account.
        </p>

        <div className="mt-8 space-y-5">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="mt-1 font-medium text-gray-900">
              {user.name || 'Name not available'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="mt-1 break-all font-medium text-gray-900">
              {user.email || user.username || 'Email not available'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </main>
  )
}

export default Profile