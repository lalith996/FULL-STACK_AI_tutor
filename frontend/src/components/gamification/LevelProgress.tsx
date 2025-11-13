import { TrendingUp, Star, Zap } from 'lucide-react'

interface LevelProgressProps {
  level: number
  currentPoints: number
  pointsToNextLevel?: number
}

const LevelProgress = ({ level, currentPoints, pointsToNextLevel = 100 }: LevelProgressProps) => {
  const pointsForCurrentLevel = (level - 1) * 100
  const pointsInLevel = currentPoints - pointsForCurrentLevel
  const progressPercentage = (pointsInLevel / 100) * 100

  return (
    <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg p-6 border-2 border-primary-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Your Level</h3>
        </div>
        <Zap className="w-5 h-5 text-yellow-500" />
      </div>

      {/* Level Badge */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg">
            <div className="text-center text-white">
              <div className="text-3xl font-bold">{level}</div>
              <div className="text-xs uppercase tracking-wide">Level</div>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
            <Star className="w-5 h-5 text-yellow-800 fill-current" />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Progress to Level {level + 1}</span>
          <span className="font-semibold text-primary-600">
            {pointsInLevel} / 100 pts
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-primary-600">{currentPoints}</div>
          <div className="text-xs text-gray-600">Total Points</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-purple-600">{pointsInLevel}</div>
          <div className="text-xs text-gray-600">This Level</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-green-600">{100 - pointsInLevel}</div>
          <div className="text-xs text-gray-600">To Next</div>
        </div>
      </div>

      {/* Encouragement */}
      <p className="text-center text-sm text-gray-600 mt-4">
        {pointsInLevel >= 75
          ? "Almost there! Keep going! 🚀"
          : pointsInLevel >= 50
          ? "You're halfway to the next level! 💪"
          : "Keep learning to level up! 📚"}
      </p>
    </div>
  )
}

export default LevelProgress
