import { useLocation, useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { quizService } from '@/services/quizService'
import { CheckCircle, XCircle, Trophy, RotateCcw, Home, ChevronRight } from 'lucide-react'

const QuizResultsPage = () => {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const results = location.state?.results

  const { data: quizData } = useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizService.getQuiz(id!),
    enabled: !!id,
  })

  const { data: attemptsData } = useQuery({
    queryKey: ['quiz-attempts', id],
    queryFn: () => quizService.getQuizAttempts(id!),
    enabled: !!id,
  })

  if (!results) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card text-center">
          <p className="text-gray-600 mb-4">No results found</p>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const { result, attempt } = results
  const isPassed = result.passed

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Score Card */}
        <div className={`card mb-8 ${isPassed ? 'border-2 border-green-500' : 'border-2 border-red-500'}`}>
          <div className="text-center">
            <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isPassed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isPassed ? (
                <Trophy className="w-12 h-12 text-green-600" />
              ) : (
                <XCircle className="w-12 h-12 text-red-600" />
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">
              {isPassed ? 'Congratulations!' : 'Keep Trying!'}
            </h1>
            <p className="text-gray-600 mb-6">
              {isPassed
                ? 'You passed the quiz!'
                : `You need ${quizData?.quiz.passingScore}% to pass.`}
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Your Score</p>
                <p className="text-3xl font-bold text-primary-600">{result.score.toFixed(1)}%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Points Earned</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.earnedPoints} / {result.totalPoints}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Correct Answers</p>
                <p className="text-3xl font-bold text-gray-900">
                  {result.results.filter((r: any) => r.isCorrect).length} / {result.results.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="card mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/dashboard" className="btn btn-secondary flex items-center space-x-2">
              <Home className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            {quizData?.canAttempt && !isPassed && (
              <button
                onClick={() => navigate(`/quiz/${id}`)}
                className="btn btn-primary flex items-center space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Retake Quiz</span>
              </button>
            )}
          </div>
        </div>

        {/* Attempt History */}
        {attemptsData && attemptsData.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold mb-4">Your Attempt History</h2>
            <div className="space-y-2">
              {attemptsData.map((att: any, index: number) => (
                <div
                  key={att._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium">
                        Score: <span className={att.passed ? 'text-green-600' : 'text-red-600'}>
                          {att.score.toFixed(1)}%
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(att.completedAt).toLocaleDateString()} at{' '}
                        {new Date(att.completedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {att.passed ? (
                      <span className="badge bg-green-100 text-green-700">Passed</span>
                    ) : (
                      <span className="badge bg-red-100 text-red-700">Failed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Question Review */}
        {quizData?.quiz.showCorrectAnswers && (
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Review Your Answers</h2>
            <div className="space-y-6">
              {result.results.map((questionResult: any, index: number) => (
                <div
                  key={questionResult.questionId}
                  className={`border-2 rounded-lg p-6 ${
                    questionResult.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="flex-shrink-0">
                      {questionResult.isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium">
                          Question {index + 1}: {questionResult.question}
                        </h3>
                        <span className="text-sm">
                          {questionResult.pointsEarned} / {questionResult.pointsPossible} pts
                        </span>
                      </div>

                      <div className="space-y-2 mt-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Your Answer:</p>
                          <p className={`mt-1 ${questionResult.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {questionResult.studentAnswer || 'No answer provided'}
                          </p>
                        </div>

                        {!questionResult.isCorrect && questionResult.correctAnswer && (
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Correct Answer:</p>
                            <p className="text-green-700 mt-1">{questionResult.correctAnswer}</p>
                          </div>
                        )}

                        {questionResult.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Explanation:</p>
                            <p className="text-sm text-blue-800">{questionResult.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizResultsPage
