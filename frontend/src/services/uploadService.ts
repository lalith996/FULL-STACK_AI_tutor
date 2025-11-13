import api from './api'

export const uploadService = {
  // Upload a single file
  uploadFile: async (file: File, type: 'course' | 'profile' | 'resource' = 'resource'): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    // Mock implementation - returns a placeholder URL
    // In production, this would make an actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUrl = `https://example.com/uploads/${type}/${Date.now()}-${file.name}`
        resolve(mockUrl)
      }, 1500)
    })

    // Real implementation:
    // const response = await api.post('/upload/file', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // })
    // return response.data.url
  },

  // Upload multiple files
  uploadFiles: async (files: File[], type: 'course' | 'profile' | 'resource' = 'resource'): Promise<string[]> => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    formData.append('type', type)

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUrls = files.map(file =>
          `https://example.com/uploads/${type}/${Date.now()}-${file.name}`
        )
        resolve(mockUrls)
      }, 2000)
    })

    // Real implementation:
    // const response = await api.post('/upload/files', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // })
    // return response.data.urls
  },

  // Upload image (with optimization)
  uploadImage: async (file: File, type: 'thumbnail' | 'avatar' | 'banner' = 'thumbnail'): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('type', type)

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUrl = `https://example.com/images/${type}/${Date.now()}-${file.name}`
        resolve(mockUrl)
      }, 1500)
    })

    // Real implementation:
    // const response = await api.post('/upload/image', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // })
    // return response.data.url
  },

  // Delete file
  deleteFile: async (fileUrl: string): Promise<void> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 500)
    })

    // Real implementation:
    // await api.delete('/upload/file', { data: { fileUrl } })
  }
}
