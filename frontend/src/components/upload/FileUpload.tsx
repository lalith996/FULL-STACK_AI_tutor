import { useRef, useState } from 'react'
import { Upload, File, X, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface UploadedFile {
  name: string
  size: number
  type: string
  url?: string
  uploadProgress?: number
}

interface FileUploadProps {
  accept?: string
  maxSize?: number // in MB
  maxFiles?: number
  onUpload: (files: File[]) => Promise<string[]> // Returns URLs of uploaded files
  onFilesChange?: (files: UploadedFile[]) => void
  label?: string
  helpText?: string
  multiple?: boolean
}

const FileUpload = ({
  accept = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip',
  maxSize = 10, // 10 MB default
  maxFiles = 5,
  onUpload,
  onFilesChange,
  label = 'Upload Files',
  helpText = 'Drag and drop files here or click to browse',
  multiple = true
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      return `File size exceeds ${maxSize}MB limit`
    }

    // Check file type if accept is specified
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim())
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      const mimeType = file.type

      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type
        }
        return mimeType.match(new RegExp(type.replace('*', '.*')))
      })

      if (!isAccepted) {
        return `File type not accepted. Allowed: ${accept}`
      }
    }

    return null
  }

  const handleFiles = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return

    const fileArray = Array.from(selectedFiles)

    // Check max files limit
    if (files.length + fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Validate files
    const validFiles: File[] = []
    for (const file of fileArray) {
      const error = validateFile(file)
      if (error) {
        toast.error(`${file.name}: ${error}`)
      } else {
        validFiles.push(file)
      }
    }

    if (validFiles.length === 0) return

    // Convert to UploadedFile format
    const newFiles: UploadedFile[] = validFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0
    }))

    setFiles(prev => [...prev, ...newFiles])
    setUploading(true)

    try {
      // Upload files
      const urls = await onUpload(validFiles)

      // Update files with URLs
      const updatedFiles = newFiles.map((file, index) => ({
        ...file,
        url: urls[index],
        uploadProgress: 100
      }))

      setFiles(prev => {
        const updated = [...prev.slice(0, -newFiles.length), ...updatedFiles]
        if (onFilesChange) {
          onFilesChange(updated)
        }
        return updated
      })

      toast.success(`${validFiles.length} file(s) uploaded successfully!`)
    } catch (error) {
      toast.error('Failed to upload files')
      // Remove failed uploads
      setFiles(prev => prev.slice(0, -newFiles.length))
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => {
      const updated = prev.filter((_, i) => i !== index)
      if (onFilesChange) {
        onFilesChange(updated)
      }
      return updated
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const getFileIcon = (file: UploadedFile) => {
    if (file.uploadProgress && file.uploadProgress < 100) {
      return <Loader className="w-5 h-5 text-primary-600 animate-spin" />
    }
    if (file.url) {
      return <CheckCircle className="w-5 h-5 text-green-600" />
    }
    return <File className="w-5 h-5 text-gray-400" />
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-primary-600 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 bg-gray-50'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={uploading || files.length >= maxFiles}
        />

        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-primary-600' : 'text-gray-400'}`} />
        <p className="text-gray-700 font-medium mb-1">{helpText}</p>
        <p className="text-sm text-gray-500">
          Max file size: {maxSize}MB | Max files: {maxFiles}
        </p>
        {accept && (
          <p className="text-xs text-gray-400 mt-2">
            Accepted formats: {accept}
          </p>
        )}
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Uploaded Files ({files.length}/{maxFiles})
          </p>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                    {file.uploadProgress !== undefined && file.uploadProgress < 100 && (
                      <span className="ml-2">• Uploading {file.uploadProgress}%</span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
                disabled={uploading}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error/Warning Messages */}
      {files.length >= maxFiles && (
        <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            Maximum file limit reached. Remove files to upload more.
          </p>
        </div>
      )}
    </div>
  )
}

export default FileUpload
