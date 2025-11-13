import api from './api'
import { Course } from '@/types'

export interface ChatMessage {
  message: string
  courseId?: string
  context?: string
}

export interface ChatResponse {
  success: boolean
  response: string
}

export interface RecommendationsResponse {
  success: boolean
  count: number
  recommendations: Course[]
}

export interface FeedbackRequest {
  answer: string
  question: string
  correctAnswer?: string
}

export interface FeedbackResponse {
  success: boolean
  feedback: string
}

export const aiService = {
  async chat(data: ChatMessage): Promise<ChatResponse> {
    const response = await api.post('/ai/chat', data)
    return response.data
  },

  async getRecommendations(): Promise<RecommendationsResponse> {
    const response = await api.get('/ai/recommendations')
    return response.data
  },

  async getFeedback(data: FeedbackRequest): Promise<FeedbackResponse> {
    const response = await api.post('/ai/feedback', data)
    return response.data
  },
}
