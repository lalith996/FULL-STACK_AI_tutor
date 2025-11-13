import { Award, Target, TrendingUp, Zap } from 'lucide-react'

interface PerformanceStatsProps {
  stats: {
    coursesEnrolled: number
    coursesCompleted: number
    averageQuizScore: number
    totalPoints: number
    streak: number
    badgesEarned: number
  }
}

const PerformanceStats = ({ stats }: PerformanceStatsProps) => {
  const completionRate = stats.coursesEnrolled > 0
    ? Math.round((stats.coursesCompleted / stats.coursesEnrolled) * 100)
    : 0

  const statCards = [
    {
      label: 'Courses Enrolled',
      value: stats.coursesEnrolled,
      icon: Target,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      label: 'Courses Completed',
      value: stats.coursesCompleted,
      icon: Award,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      label: 'Avg Quiz Score',
      value: `${stats.averageQuizScore}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      label: 'Total Points',
      value: stats.totalPoints,
      icon: Zap,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.lightColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Completion Rate */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Completion Rate</h3>
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold text-primary-600">{completionRate}%</span>
            </div>
            <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200">
              <div
                style={{ width: `${completionRate}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600 transition-all duration-500"
              ></div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            {stats.coursesCompleted} of {stats.coursesEnrolled} courses completed
          </p>
        </div>

        {/* Current Streak */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border-2 border-orange-200 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Current Streak</h3>
          <div className="flex items-center space-x-3">
            <div className="text-5xl">🔥</div>
            <div>
              <div className="text-3xl font-bold text-orange-600">{stats.streak}</div>
              <div className="text-xs text-gray-600">days in a row</div>
            </div>
          </div>
        </div>

        {/* Badges Earned */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Badges Earned</h3>
          <div className="flex items-center space-x-3">
            <Award className="w-12 h-12 text-purple-600" />
            <div>
              <div className="text-3xl font-bold text-purple-600">{stats.badgesEarned}</div>
              <div className="text-xs text-gray-600">achievements unlocked</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceStats
