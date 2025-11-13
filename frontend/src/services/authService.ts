import api from './api'
import { User } from '@/types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role?: 'student' | 'teacher'
}

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  user: User
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async getMe(): Promise<User> {
    const response = await api.get('/auth/me')
    return response.data.user
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/auth/profile', data)
    return response.data.user
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    const response = await api.put('/auth/password', {
      currentPassword,
      newPassword,
    })
    return response.data
  },
}
