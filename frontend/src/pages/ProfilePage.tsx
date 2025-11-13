import { useAuthStore } from '@/store/authStore'

const ProfilePage = () => {
  const { user } = useAuthStore()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-white text-3xl font-semibold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500 capitalize">Role: {user?.role}</p>
          </div>
        </div>
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Stats</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Level</p>
              <p className="text-2xl font-bold">{user?.profile.level}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Points</p>
              <p className="text-2xl font-bold">{user?.profile.points}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Badges</p>
              <p className="text-2xl font-bold">{user?.profile.badges.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
