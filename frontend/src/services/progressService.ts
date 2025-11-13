import api from './api'
import { Progress } from '@/types'

export const progressService = {
  async getProgress(courseId: string): Promise<Progress> {
    const response = await api.get(`/progress/${courseId}`)
    return response.data.progress
  },

  async updateProgress(courseId: string, data: { moduleId: string; lessonId: string }): Promise<Progress> {
    const response = await api.put(`/progress/${courseId}`, data)
    return response.data.progress
  },

  async completeLesson(
    courseId: string,
    lessonId: string,
    data: { moduleId: string; timeSpent?: number }
  ): Promise<Progress> {
    const response = await api.post(`/progress/${courseId}/lessons/${lessonId}/complete`, data)
    return response.data.progress
  },

  async getCertificate(courseId: string): Promise<any> {
    const response = await api.get(`/progress/${courseId}/certificate`)
    return response.data.certificate
  },
}
