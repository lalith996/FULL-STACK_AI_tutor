import { useRef, useState } from 'react'
import { Camera, X, Loader } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ImageUploadProps {
  currentImage?: string
  onUpload: (file: File) => Promise<string> // Returns URL of uploaded image
  onImageChange?: (url: string) => void
  maxSize?: number // in MB
  aspectRatio?: string // e.g., "16/9", "1/1", "4/3"
  label?: string
  width?: string
  height?: string
}

const ImageUpload = ({
  currentImage,
  onUpload,
  onImageChange,
  maxSize = 5,
  aspectRatio,
  label = 'Upload Image',
  width = 'w-full',
  height = 'h-64'
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      toast.error(`Image size must be less than ${maxSize}MB`)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setUploading(true)
    try {
      const url = await onUpload(file)
      if (onImageChange) {
        onImageChange(url)
      }
      toast.success('Image uploaded successfully!')
    } catch (error) {
      toast.error('Failed to upload image')
      setPreview(currentImage || null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (onImageChange) {
      onImageChange('')
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div className={`relative ${width} ${height} bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 group`}>
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
              style={aspectRatio ? { aspectRatio } : undefined}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Change
                </button>
                <button
                  onClick={handleRemove}
                  disabled={uploading}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                <Loader className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
            )}
          </>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full h-full flex flex-col items-center justify-center text-gray-500 hover:text-primary-600 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader className="w-12 h-12 mb-2 animate-spin" />
                <span className="text-sm">Uploading...</span>
              </>
            ) : (
              <>
                <Camera className="w-12 h-12 mb-2" />
                <span className="text-sm font-medium">Click to upload image</span>
                <span className="text-xs mt-1">Max size: {maxSize}MB</span>
              </>
            )}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>

      <p className="text-xs text-gray-500">
        Recommended: JPG, PNG, or GIF. Max {maxSize}MB.
        {aspectRatio && ` Aspect ratio: ${aspectRatio}`}
      </p>
    </div>
  )
}

export default ImageUpload
