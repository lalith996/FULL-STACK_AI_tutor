import api from './api'

export interface Certificate {
  _id: string
  studentId: string
  studentName: string
  courseId: string
  courseName: string
  courseCategory: string
  instructor: string
  completionDate: Date
  certificateId: string
  verificationUrl?: string
}

export const certificateService = {
  // Get all certificates for current user
  getMyCertificates: async (): Promise<Certificate[]> => {
    // Mock data for now - will be replaced with actual API call
    const mockCertificates: Certificate[] = [
      {
        _id: '1',
        studentId: 'user123',
        studentName: 'John Doe',
        courseId: 'course1',
        courseName: 'Complete JavaScript Masterclass 2024',
        courseCategory: 'Web Development',
        instructor: 'Sarah Johnson',
        completionDate: new Date('2024-01-15'),
        certificateId: 'CERT-2024-JS-001234'
      }
    ]

    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCertificates), 500)
    })

    // Real implementation:
    // const response = await api.get('/certificates/my-certificates')
    // return response.data.certificates
  },

  // Get specific certificate
  getCertificate: async (certificateId: string): Promise<Certificate> => {
    // Mock data for now
    const mockCertificate: Certificate = {
      _id: '1',
      studentId: 'user123',
      studentName: 'John Doe',
      courseId: 'course1',
      courseName: 'Complete JavaScript Masterclass 2024',
      courseCategory: 'Web Development',
      instructor: 'Sarah Johnson',
      completionDate: new Date('2024-01-15'),
      certificateId: certificateId
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCertificate), 500)
    })

    // Real implementation:
    // const response = await api.get(`/certificates/${certificateId}`)
    // return response.data.certificate
  },

  // Verify certificate
  verifyCertificate: async (certificateId: string): Promise<{ valid: boolean; certificate?: Certificate }> => {
    // Mock verification
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          valid: true,
          certificate: {
            _id: '1',
            studentId: 'user123',
            studentName: 'John Doe',
            courseId: 'course1',
            courseName: 'Complete JavaScript Masterclass 2024',
            courseCategory: 'Web Development',
            instructor: 'Sarah Johnson',
            completionDate: new Date('2024-01-15'),
            certificateId: certificateId
          }
        })
      }, 500)
    })

    // Real implementation:
    // const response = await api.post('/certificates/verify', { certificateId })
    // return response.data
  },

  // Generate certificate for course completion
  generateCertificate: async (courseId: string): Promise<Certificate> => {
    // Real implementation:
    const response = await api.post('/certificates/generate', { courseId })
    return response.data.certificate
  }
}
