import { Outlet } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BookOpen className="w-16 h-16 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AI E-Learning Platform</h1>
          <p className="text-gray-600 mt-2">Your journey to knowledge starts here</p>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
