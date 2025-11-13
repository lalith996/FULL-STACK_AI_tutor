import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { BookOpen, Award, TrendingUp, BarChart3, Target, Calendar } from 'lucide-react'
import PerformanceStats from '@/components/analytics/PerformanceStats'
import ProgressChart from '@/components/analytics/ProgressChart'
import QuizPerformance from '@/components/analytics/QuizPerformance'
import CategoryBreakdown from '@/components/analytics/CategoryBreakdown'
import LevelProgress from '@/components/gamification/LevelProgress'
import StreakCalendar from '@/components/gamification/StreakCalendar'

const DashboardPage = () => {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview')

  // Mock data for analytics - in real app, this would come from API
  const performanceStats = {
    coursesEnrolled: user?.enrolledCourses?.length || 0,
    coursesCompleted: 0, // Would come from progress data
    averageQuizScore: 85,
    totalPoints: user?.profile?.points || 0,
    streak: user?.profile?.streak?.current || 0,
    badgesEarned: user?.profile?.badges?.length || 0,
  }

  const progressData = [
    { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), completed: 2, timeSpent: 45 },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), completed: 3, timeSpent: 60 },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), completed: 1, timeSpent: 30 },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), completed: 4, timeSpent: 90 },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), completed: 2, timeSpent: 50 },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), completed: 3, timeSpent: 75 },
    { date: new Date().toISOString(), completed: 5, timeSpent: 120 },
  ]

  const quizAttempts = [
    {
      quizTitle: 'JavaScript Fundamentals Quiz',
      courseTitle: 'Complete JavaScript Course',
      score: 92,
      totalQuestions: 20,
      correctAnswers: 18,
      timeSpent: 25,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      passed: true,
    },
    {
      quizTitle: 'React Basics Quiz',
      courseTitle: 'React Masterclass',
      score: 78,
      totalQuestions: 15,
      correctAnswers: 12,
      timeSpent: 20,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      passed: true,
    },
  ]

  const categoryData = [
    { category: 'Web Development', courses: 3, timeSpent: 45.5, color: '#3b82f6' },
    { category: 'Data Science', courses: 2, timeSpent: 30.2, color: '#8b5cf6' },
    { category: 'Mobile Development', courses: 1, timeSpent: 15.8, color: '#10b981' },
    { category: 'Design', courses: 1, timeSpent: 12.5, color: '#f59e0b' },
  ]

  const currentLevel = Math.floor((user?.profile?.points || 0) / 100) + 1

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Track your progress and continue your learning journey</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Overview</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'analytics'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </div>
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Enrolled Courses</p>
                  <p className="text-3xl font-bold">{user?.enrolledCourses?.length || 0}</p>
                </div>
                <BookOpen className="w-12 h-12 text-primary-600" />
              </div>
            </div>
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Points</p>
                  <p className="text-3xl font-bold">{user?.profile?.points || 0}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Badges Earned</p>
                  <p className="text-3xl font-bold">{user?.profile?.badges?.length || 0}</p>
                </div>
                <Award className="w-12 h-12 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Gamification Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <LevelProgress
              level={currentLevel}
              currentPoints={user?.profile?.points || 0}
              pointsToNextLevel={100}
            />
            <StreakCalendar
              currentStreak={user?.profile?.streak?.current || 0}
              longestStreak={user?.profile?.streak?.longest || 0}
              lastActivity={user?.profile?.lastActivity ? new Date(user.profile.lastActivity) : undefined}
            />
          </div>

          {/* Progress Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <ProgressChart data={progressData} />
            <CategoryBreakdown data={categoryData} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Performance Stats */}
          <PerformanceStats stats={performanceStats} />

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <ProgressChart data={progressData} />
            <QuizPerformance attempts={quizAttempts} />
          </div>

          {/* Category Breakdown */}
          <CategoryBreakdown data={categoryData} />
        </div>
      )}
    </div>
  )
}

export default DashboardPage
