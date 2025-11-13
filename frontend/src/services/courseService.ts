import api from './api'
import { Course } from '@/types'

export interface GetCoursesParams {
  category?: string
  level?: string
  search?: string
  sort?: string
  page?: number
  limit?: number
}

export interface CoursesResponse {
  success: boolean
  count: number
  total: number
  totalPages: number
  currentPage: number
  courses: Course[]
}

export const courseService = {
  async getCourses(params?: GetCoursesParams): Promise<CoursesResponse> {
    const response = await api.get('/courses', { params })
    return response.data
  },

  async getCourse(id: string): Promise<Course> {
    const response = await api.get(`/courses/${id}`)
    return response.data.course
  },

  async createCourse(data: Partial<Course>): Promise<Course> {
    const response = await api.post('/courses', data)
    return response.data.course
  },

  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    const response = await api.put(`/courses/${id}`, data)
    return response.data.course
  },

  async deleteCourse(id: string): Promise<void> {
    await api.delete(`/courses/${id}`)
  },

  async enrollCourse(id: string): Promise<Course> {
    const response = await api.post(`/courses/${id}/enroll`)
    return response.data.course
  },

  async unenrollCourse(id: string): Promise<void> {
    await api.delete(`/courses/${id}/enroll`)
  },

  async publishCourse(id: string): Promise<Course> {
    const response = await api.post(`/courses/${id}/publish`)
    return response.data.course
  },

  async unpublishCourse(id: string): Promise<Course> {
    const response = await api.post(`/courses/${id}/unpublish`)
    return response.data.course
  },

  async rateAndReview(id: string, data: { rating: number; comment: string }): Promise<Course> {
    const response = await api.post(`/courses/${id}/rate`, data)
    return response.data.course
  },
}
