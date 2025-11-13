import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { BookOpen, Users, PlusCircle } from 'lucide-react'

const TeacherDashboardPage = () => {
  const { user } = useAuthStore()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <Link to="/teacher/create-course" className="btn btn-primary flex items-center space-x-2">
          <PlusCircle className="w-5 h-5" />
          <span>Create New Course</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Courses</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <BookOpen className="w-12 h-12 text-primary-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Students</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <Users className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Rating</p>
              <p className="text-3xl font-bold">0.0</p>
            </div>
            <div className="text-yellow-400 text-3xl">★</div>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
        <p className="text-gray-600">You haven't created any courses yet. Start by creating your first course!</p>
      </div>
    </div>
  )
}

export default TeacherDashboardPage
