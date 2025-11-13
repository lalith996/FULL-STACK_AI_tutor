import { useAuthStore } from '@/store/authStore'
import { BookOpen, Award, TrendingUp } from 'lucide-react'

const DashboardPage = () => {
  const { user } = useAuthStore()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user?.name}!</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Enrolled Courses</p>
              <p className="text-3xl font-bold">{user?.enrolledCourses.length || 0}</p>
            </div>
            <BookOpen className="w-12 h-12 text-primary-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Points</p>
              <p className="text-3xl font-bold">{user?.profile.points || 0}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Badges Earned</p>
              <p className="text-3xl font-bold">{user?.profile.badges.length || 0}</p>
            </div>
            <Award className="w-12 h-12 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Your Learning Journey</h2>
        <p className="text-gray-600">
          Continue learning and unlock new achievements. Your next course awaits!
        </p>
      </div>
    </div>
  )
}

export default DashboardPage
