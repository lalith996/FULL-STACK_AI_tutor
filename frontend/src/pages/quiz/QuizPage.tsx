import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { quizService } from '@/services/quizService'
import { Question } from '@/types'
import { Clock, AlertCircle, CheckCircle } from 'lucide-react'

const QuizPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [startTime] = useState(Date.now())
  const [hasStarted, setHasStarted] = useState(false)

  const { data: quizData, isLoading } = useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizService.getQuiz(id!),
    enabled: !!id,
  })

  const submitMutation = useMutation({
    mutationFn: () =>
      quizService.submitQuiz(id!, {
        answers,
        timeSpent: Math.floor((Date.now() - startTime) / 1000),
        startedAt: new Date(startTime),
      }),
    onSuccess: (data) => {
      navigate(`/quiz/${id}/results`, { state: { results: data } })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit quiz')
    },
  })

  useEffect(() => {
    if (quizData?.quiz?.timeLimit && hasStarted) {
      setTimeRemaining(quizData.quiz.timeLimit * 60) // Convert minutes to seconds

      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timer)
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [quizData, hasStarted])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading quiz...</p>
      </div>
    )
  }

  if (!quizData || !quizData.quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Quiz not found</p>
      </div>
    )
  }

  const { quiz, canAttempt, attempts, attemptsAllowed, bestScore } = quizData

  if (!canAttempt) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="card text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-2xl font-bold mb-2">Maximum Attempts Reached</h2>
          <p className="text-gray-600 mb-4">
            You have used all {attemptsAllowed} attempts for this quiz.
          </p>
          {bestScore !== null && (
            <p className="text-lg">
              Your best score: <span className="font-bold text-primary-600">{bestScore}%</span>
            </p>
          )}
          <button onClick={() => navigate(-1)} className="btn btn-primary mt-6">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!hasStarted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="card">
          <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
          {quiz.description && <p className="text-gray-600 mb-6">{quiz.description}</p>}

          <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Questions:</span>
              <span className="font-semibold">{quiz.questions.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total Points:</span>
              <span className="font-semibold">{quiz.totalPoints}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Passing Score:</span>
              <span className="font-semibold">{quiz.passingScore}%</span>
            </div>
            {quiz.timeLimit && (
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Time Limit:</span>
                <span className="font-semibold">{quiz.timeLimit} minutes</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Attempts:</span>
              <span className="font-semibold">
                {attempts} / {attemptsAllowed}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Once you start the quiz, you cannot pause or leave the page. Make
              sure you have enough time to complete it.
            </p>
          </div>

          <button onClick={() => setHasStarted(true)} className="btn btn-primary w-full">
            Start Quiz
          </button>
        </div>
      </div>
    )
  }

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleSubmit = () => {
    const unanswered = quiz.questions.filter((q) => !answers[q._id])

    if (unanswered.length > 0) {
      if (!window.confirm(`You have ${unanswered.length} unanswered questions. Submit anyway?`)) {
        return
      }
    }

    submitMutation.mutate()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            {timeRemaining !== null && (
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Progress: {answeredCount} / {quiz.questions.length}
            </span>
            <div className="w-48 bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{ width: `${(answeredCount / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-6">
          {quiz.questions.map((question: Question, index: number) => (
            <div key={question._id} className="card">
              <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{question.question}</h3>
                    <span className="text-sm text-gray-500 ml-2">{question.points} pts</span>
                  </div>

                  {/* Multiple Choice */}
                  {question.type === 'multiple-choice' && question.options && (
                    <div className="space-y-2 mt-4">
                      {question.options.map((option) => (
                        <label
                          key={option._id}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                            answers[question._id] === option._id
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={question._id}
                            value={option._id}
                            checked={answers[question._id] === option._id}
                            onChange={() => handleAnswerChange(question._id, option._id)}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="flex-1">{option.text}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* True/False */}
                  {question.type === 'true-false' && (
                    <div className="space-y-2 mt-4">
                      {['true', 'false'].map((value) => (
                        <label
                          key={value}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                            answers[question._id] === value
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={question._id}
                            value={value}
                            checked={answers[question._id] === value}
                            onChange={() => handleAnswerChange(question._id, value)}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="flex-1 capitalize">{value}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Short Answer */}
                  {question.type === 'short-answer' && (
                    <input
                      type="text"
                      value={answers[question._id] || ''}
                      onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                      placeholder="Type your answer..."
                      className="input mt-4"
                    />
                  )}

                  {/* Essay */}
                  {question.type === 'essay' && (
                    <textarea
                      value={answers[question._id] || ''}
                      onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                      placeholder="Write your essay answer..."
                      rows={6}
                      className="input mt-4"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">
                {answeredCount} of {quiz.questions.length} questions answered
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Make sure to review your answers before submitting
              </p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="btn btn-primary"
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizPage
