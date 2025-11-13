import { Badge as BadgeType } from '@/types'
import { Award, Lock, Trophy, Star, Flame, Target } from 'lucide-react'

interface BadgeShowcaseProps {
  badges: BadgeType[]
  userBadges?: string[]
}

const BadgeShowcase = ({ badges, userBadges = [] }: BadgeShowcaseProps) => {
  const getBadgeIcon = (category: string) => {
    switch (category) {
      case 'achievement':
        return Trophy
      case 'streak':
        return Flame
      case 'course-completion':
        return Target
      case 'quiz-mastery':
        return Star
      default:
        return Award
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-700 border-gray-300'
      case 'uncommon':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'rare':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'epic':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'legendary':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {badges.map((badge) => {
        const Icon = getBadgeIcon(badge.category)
        const isEarned = userBadges.includes(badge._id)
        const colorClass = getRarityColor(badge.rarity)

        return (
          <div
            key={badge._id}
            className={`relative p-4 rounded-lg border-2 transition-all ${
              isEarned
                ? `${colorClass} hover:shadow-lg transform hover:scale-105`
                : 'bg-gray-50 text-gray-400 border-gray-200 opacity-60'
            }`}
          >
            {!isEarned && (
              <div className="absolute top-2 right-2">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
            )}

            <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
              isEarned ? colorClass : 'bg-gray-200'
            }`}>
              <Icon className={`w-8 h-8 ${isEarned ? '' : 'text-gray-400'}`} />
            </div>

            <h3 className={`text-center font-semibold mb-1 ${
              isEarned ? '' : 'text-gray-500'
            }`}>
              {badge.name}
            </h3>

            <p className={`text-xs text-center mb-2 ${
              isEarned ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {badge.description}
            </p>

            <div className="flex items-center justify-between text-xs">
              <span className={`badge ${
                isEarned ? colorClass : 'bg-gray-200 text-gray-500'
              }`}>
                {badge.rarity}
              </span>
              <span className={`font-semibold ${
                isEarned ? '' : 'text-gray-400'
              }`}>
                +{badge.points} pts
              </span>
            </div>

            {isEarned && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <Trophy className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default BadgeShowcase
