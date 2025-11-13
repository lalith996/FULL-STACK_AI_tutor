import { CheckCircle, XCircle, Clock, Trophy } from 'lucide-react'

interface QuizAttempt {
  quizTitle: string
  courseTitle: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  date: string
  passed: boolean
}

interface QuizPerformanceProps {
  attempts: QuizAttempt[]
}

const QuizPerformance = ({ attempts }: QuizPerformanceProps) => {
  if (attempts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Quiz Performance</h3>
        <div className="text-center py-12 text-gray-500">
          No quiz attempts yet
        </div>
      </div>
    )
  }

  const averageScore = Math.round(
    attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
  )

  const passRate = Math.round(
    (attempts.filter(a => a.passed).length / attempts.length) * 100
  )

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-6">Quiz Performance</h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{attempts.length}</div>
          <div className="text-xs text-gray-600 mt-1">Total Attempts</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{averageScore}%</div>
          <div className="text-xs text-gray-600 mt-1">Average Score</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{passRate}%</div>
          <div className="text-xs text-gray-600 mt-1">Pass Rate</div>
        </div>
      </div>

      {/* Recent Attempts */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Attempts</h4>
        {attempts.slice(0, 5).map((attempt, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h5 className="font-semibold text-gray-900">{attempt.quizTitle}</h5>
                <p className="text-sm text-gray-600">{attempt.courseTitle}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreBg(attempt.score)} ${getScoreColor(attempt.score)}`}>
                {attempt.score}%
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  {attempt.passed ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span>{attempt.passed ? 'Passed' : 'Failed'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4" />
                  <span>{attempt.correctAnswers}/{attempt.totalQuestions}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{attempt.timeSpent} min</span>
                </div>
              </div>
              <span className="text-gray-500 text-xs">
                {new Date(attempt.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuizPerformance
