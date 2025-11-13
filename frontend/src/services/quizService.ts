import api from './api'
import { Quiz, QuizAttempt } from '@/types'

export interface SubmitQuizData {
  answers: Record<string, any>
  timeSpent: number
  startedAt: Date
}

export interface QuizResponse {
  success: boolean
  quiz: Quiz
  attempts: number
  attemptsAllowed: number
  canAttempt: boolean
  bestScore: number | null
}

export interface QuizSubmitResponse {
  success: boolean
  message: string
  result: {
    score: number
    earnedPoints: number
    totalPoints: number
    passed: boolean
    results: any[]
  }
  attempt: QuizAttempt
}

export const quizService = {
  async getQuizzes(courseId: string): Promise<Quiz[]> {
    const response = await api.get('/quizzes', { params: { courseId } })
    return response.data.quizzes
  },

  async getQuiz(id: string): Promise<QuizResponse> {
    const response = await api.get(`/quizzes/${id}`)
    return response.data
  },

  async createQuiz(data: Partial<Quiz>): Promise<Quiz> {
    const response = await api.post('/quizzes', data)
    return response.data.quiz
  },

  async updateQuiz(id: string, data: Partial<Quiz>): Promise<Quiz> {
    const response = await api.put(`/quizzes/${id}`, data)
    return response.data.quiz
  },

  async deleteQuiz(id: string): Promise<void> {
    await api.delete(`/quizzes/${id}`)
  },

  async submitQuiz(id: string, data: SubmitQuizData): Promise<QuizSubmitResponse> {
    const response = await api.post(`/quizzes/${id}/submit`, data)
    return response.data
  },

  async getQuizAttempts(id: string): Promise<QuizAttempt[]> {
    const response = await api.get(`/quizzes/${id}/attempts`)
    return response.data.attempts
  },

  async getQuizStatistics(id: string): Promise<any> {
    const response = await api.get(`/quizzes/${id}/statistics`)
    return response.data.statistics
  },
}
