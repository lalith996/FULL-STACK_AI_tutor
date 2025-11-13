import { Flame, Calendar } from 'lucide-react'

interface StreakCalendarProps {
  currentStreak: number
  longestStreak: number
  lastActivity?: Date
}

const StreakCalendar = ({ currentStreak, longestStreak, lastActivity }: StreakCalendarProps) => {
  // Generate last 7 days
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push(date)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isActive = (date: Date) => {
    if (!lastActivity) return false
    const last = new Date(lastActivity)
    const daysDiff = Math.floor((new Date().getTime() - last.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff <= 6 - days.findIndex((d) => d.getTime() === date.getTime())
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border-2 border-orange-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Flame className="w-6 h-6 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Learning Streak</h3>
        </div>
        <Calendar className="w-5 h-5 text-gray-400" />
      </div>

      {/* Current Streak Display */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center space-x-2 bg-white rounded-full px-6 py-3 shadow-md">
          <Flame className="w-8 h-8 text-orange-500" />
          <div className="text-left">
            <div className="text-3xl font-bold text-orange-600">{currentStreak}</div>
            <div className="text-xs text-gray-600">day{currentStreak !== 1 ? 's' : ''} streak</div>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {days.map((date, index) => {
          const active = isActive(date)
          const today = isToday(date)

          return (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-600 mb-1">
                {date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
              </div>
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${
                  active
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white text-gray-300 border border-gray-200'
                } ${today ? 'ring-2 ring-orange-300' : ''}`}
              >
                {date.getDate()}
              </div>
            </div>
          )
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-orange-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{currentStreak}</div>
          <div className="text-xs text-gray-600">Current</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{longestStreak}</div>
          <div className="text-xs text-gray-600">Best</div>
        </div>
      </div>

      {/* Motivation */}
      {currentStreak === 0 ? (
        <p className="text-center text-sm text-gray-600 mt-4">
          Start learning today to begin your streak! 🔥
        </p>
      ) : (
        <p className="text-center text-sm text-gray-600 mt-4">
          {currentStreak >= longestStreak
            ? "You're on fire! Keep it up! 🔥"
            : `${longestStreak - currentStreak} more day${
                longestStreak - currentStreak !== 1 ? 's' : ''
              } to beat your record!`}
        </p>
      )}
    </div>
  )
}

export default StreakCalendar
