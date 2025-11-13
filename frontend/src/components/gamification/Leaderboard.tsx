import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  avatar?: string
  level: number
  points: number
  badges: number
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  currentUserId?: string
  period?: 'week' | 'month' | 'all'
}

const Leaderboard = ({ entries, currentUserId, period = 'all' }: LeaderboardProps) => {
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return null
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300'
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300'
      default:
        return 'bg-white border-gray-200'
    }
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const isCurrentUser = entry.userId === currentUserId
        const medalIcon = getMedalIcon(entry.rank)

        return (
          <div
            key={entry.userId}
            className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all ${
              getRankBg(entry.rank)
            } ${
              isCurrentUser ? 'ring-2 ring-primary-500' : ''
            } hover:shadow-md`}
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-12 text-center">
              {medalIcon || (
                <span className="text-2xl font-bold text-gray-700">
                  #{entry.rank}
                </span>
              )}
            </div>

            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-lg">
                {entry.avatar || entry.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 truncate">
                  {entry.name}
                  {isCurrentUser && (
                    <span className="ml-2 text-xs badge bg-primary-100 text-primary-700">
                      You
                    </span>
                  )}
                </h3>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                <span className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Level {entry.level}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>{entry.badges} badges</span>
                </span>
              </div>
            </div>

            {/* Points */}
            <div className="flex-shrink-0 text-right">
              <div className="text-2xl font-bold text-primary-600">
                {entry.points.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">points</div>
            </div>
          </div>
        )
      })}

      {entries.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">No leaderboard data available yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Start learning to appear on the leaderboard!
          </p>
        </div>
      )}
    </div>
  )
}

export default Leaderboard
