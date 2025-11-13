import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient, useQuery } from '@tantml:react-query'
import { toast } from 'react-hot-toast'
import {
  Plus, Trash2, Save, ArrowLeft, GripVertical, Copy, CheckCircle
} from 'lucide-react'
import { courseService } from '@/services/courseService'

interface Question {
  id: string
  question: string
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay'
  options: string[]
  correctAnswer: string
  points: number
  explanation: string
}

interface QuizData {
  title: string
  description: string
  courseId: string
  passingScore: number
  timeLimit: number
  shuffleQuestions: boolean
  showCorrectAnswers: boolean
  allowRetake: boolean
  questions: Question[]
}

const QuizBuilderPage = () => {
  const { courseId } = useParams<{ courseId?: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [quizData, setQuizData] = useState<QuizData>({
    title: '',
    description: '',
    courseId: courseId || '',
    passingScore: 70,
    timeLimit: 30,
    shuffleQuestions: false,
    showCorrectAnswers: true,
    allowRetake: true,
    questions: []
  })

  // Fetch teacher's courses for selection
  const { data: coursesData } = useQuery({
    queryKey: ['teacher-courses'],
    queryFn: () => courseService.getCourses()
  })

  const courses = coursesData?.courses || []

  // Create quiz mutation
  const createQuizMutation = useMutation({
    mutationFn: async (data: QuizData) => {
      // API call would go here
      return { success: true, quiz: data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] })
      toast.success('Quiz created successfully!')
      navigate('/teacher/manage-courses')
    },
    onError: () => {
      toast.error('Failed to create quiz')
    }
  })

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      question: '',
      type,
      options: type === 'multiple-choice' ? ['Option A', 'Option B', 'Option C', 'Option D'] :
               type === 'true-false' ? ['True', 'False'] : [],
      correctAnswer: '',
      points: 10,
      explanation: ''
    }
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, newQuestion]
    })
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...quizData.questions]
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    }
    setQuizData({ ...quizData, questions: updatedQuestions })
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...quizData.questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setQuizData({ ...quizData, questions: updatedQuestions })
  }

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...quizData.questions]
    updatedQuestions[questionIndex].options.push(`Option ${updatedQuestions[questionIndex].options.length + 1}`)
    setQuizData({ ...quizData, questions: updatedQuestions })
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...quizData.questions]
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex)
    setQuizData({ ...quizData, questions: updatedQuestions })
  }

  const removeQuestion = (index: number) => {
    setQuizData({
      ...quizData,
      questions: quizData.questions.filter((_, i) => i !== index)
    })
  }

  const duplicateQuestion = (index: number) => {
    const questionToDuplicate = { ...quizData.questions[index], id: `q-${Date.now()}` }
    const updatedQuestions = [...quizData.questions]
    updatedQuestions.splice(index + 1, 0, questionToDuplicate)
    setQuizData({ ...quizData, questions: updatedQuestions })
  }

  const handleSubmit = () => {
    if (!quizData.title || !quizData.courseId) {
      toast.error('Please fill in all required fields')
      return
    }
    if (quizData.questions.length === 0) {
      toast.error('Please add at least one question')
      return
    }

    // Validate all questions have correct answers
    const invalidQuestions = quizData.questions.filter(q => !q.question || !q.correctAnswer)
    if (invalidQuestions.length > 0) {
      toast.error('Please complete all questions and set correct answers')
      return
    }

    createQuizMutation.mutate(quizData)
  }

  const totalPoints = quizData.questions.reduce((sum, q) => sum + q.points, 0)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Quiz Builder</h1>
        <p className="text-gray-600 mt-1">Create engaging quizzes for your courses</p>
      </div>

      {/* Quiz Settings */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Quiz Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title *</label>
            <input
              type="text"
              value={quizData.title}
              onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
              placeholder="e.g., JavaScript Fundamentals Quiz"
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={quizData.description}
              onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
              placeholder="Brief description of the quiz..."
              rows={3}
              className="input resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Course *</label>
            <select
              value={quizData.courseId}
              onChange={(e) => setQuizData({ ...quizData, courseId: e.target.value })}
              className="input"
              required
            >
              <option value="">Select a course...</option>
              {courses.map((course: any) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passing Score (%)
              </label>
              <input
                type="number"
                value={quizData.passingScore}
                onChange={(e) => setQuizData({ ...quizData, passingScore: parseInt(e.target.value) || 0 })}
                min="0"
                max="100"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                value={quizData.timeLimit}
                onChange={(e) => setQuizData({ ...quizData, timeLimit: parseInt(e.target.value) || 0 })}
                min="0"
                className="input"
              />
            </div>
            <div className="flex items-end">
              <div className="text-sm">
                <div className="font-medium text-gray-700">Total Points</div>
                <div className="text-2xl font-bold text-primary-600">{totalPoints}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={quizData.shuffleQuestions}
                onChange={(e) => setQuizData({ ...quizData, shuffleQuestions: e.target.checked })}
                className="rounded text-primary-600"
              />
              <span className="text-sm text-gray-700">Shuffle questions</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={quizData.showCorrectAnswers}
                onChange={(e) => setQuizData({ ...quizData, showCorrectAnswers: e.target.checked })}
                className="rounded text-primary-600"
              />
              <span className="text-sm text-gray-700">Show correct answers after submission</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={quizData.allowRetake}
                onChange={(e) => setQuizData({ ...quizData, allowRetake: e.target.checked })}
                className="rounded text-primary-600"
              />
              <span className="text-sm text-gray-700">Allow retakes</span>
            </label>
          </div>
        </div>
      </div>

      {/* Add Question Buttons */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-3">Add Question Type</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => addQuestion('multiple-choice')}
            className="btn btn-outline flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Multiple Choice</span>
          </button>
          <button
            onClick={() => addQuestion('true-false')}
            className="btn btn-outline flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>True/False</span>
          </button>
          <button
            onClick={() => addQuestion('short-answer')}
            className="btn btn-outline flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Short Answer</span>
          </button>
          <button
            onClick={() => addQuestion('essay')}
            className="btn btn-outline flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Essay</span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      {quizData.questions.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No questions yet. Add your first question above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quizData.questions.map((question, index) => (
            <div key={question.id} className="card">
              <div className="flex items-start space-x-3">
                <div className="flex items-center space-x-2 pt-2">
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                  <span className="font-semibold text-gray-700">Q{index + 1}</span>
                </div>

                <div className="flex-1 space-y-4">
                  {/* Question Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                        {question.type.replace('-', ' ')}
                      </span>
                      <input
                        type="number"
                        value={question.points}
                        onChange={(e) => updateQuestion(index, 'points', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        min="0"
                      />
                      <span className="text-sm text-gray-600">points</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => duplicateQuestion(index)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeQuestion(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                    <textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                      placeholder="Enter your question..."
                      rows={2}
                      className="input resize-none"
                    />
                  </div>

                  {/* Options */}
                  {(question.type === 'multiple-choice' || question.type === 'true-false') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correctAnswer === option}
                              onChange={() => updateQuestion(index, 'correctAnswer', option)}
                              className="text-green-600"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                              className="input flex-1"
                            />
                            {question.type === 'multiple-choice' && question.options.length > 2 && (
                              <button
                                onClick={() => removeOption(index, optionIndex)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                            {question.correctAnswer === option && (
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                      {question.type === 'multiple-choice' && (
                        <button
                          onClick={() => addOption(index)}
                          className="mt-2 btn btn-outline btn-sm"
                        >
                          Add Option
                        </button>
                      )}
                    </div>
                  )}

                  {/* Correct Answer for short-answer/essay */}
                  {(question.type === 'short-answer' || question.type === 'essay') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sample/Expected Answer
                      </label>
                      <textarea
                        value={question.correctAnswer}
                        onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                        placeholder="Enter the expected answer or key points..."
                        rows={question.type === 'essay' ? 4 : 2}
                        className="input resize-none"
                      />
                    </div>
                  )}

                  {/* Explanation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Explanation (Optional)
                    </label>
                    <textarea
                      value={question.explanation}
                      onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                      placeholder="Explain why this is the correct answer..."
                      rows={2}
                      className="input resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-8 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          {quizData.questions.length} {quizData.questions.length === 1 ? 'question' : 'questions'} · {totalPoints} total points
        </div>
        <button
          onClick={handleSubmit}
          disabled={createQuizMutation.isPending || quizData.questions.length === 0}
          className="btn btn-primary flex items-center space-x-2"
        >
          {createQuizMutation.isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Create Quiz</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default QuizBuilderPage
