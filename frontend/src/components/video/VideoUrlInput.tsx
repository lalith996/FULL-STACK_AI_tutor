import { useState, useEffect } from 'react'
import { Youtube, Video, ExternalLink, Check, X, AlertCircle } from 'lucide-react'

interface VideoUrlInputProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  error?: string
}

const VideoUrlInput = ({
  value,
  onChange,
  label = 'Video URL',
  placeholder = 'Enter YouTube or Vimeo URL...',
  error
}: VideoUrlInputProps) => {
  const [videoType, setVideoType] = useState<'youtube' | 'vimeo' | 'unsupported' | null>(null)
  const [videoId, setVideoId] = useState<string>('')
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (value) {
      const parsed = parseVideoUrl(value)
      setVideoType(parsed.type)
      setVideoId(parsed.id)
    } else {
      setVideoType(null)
      setVideoId('')
    }
  }, [value])

  const parseVideoUrl = (url: string): { type: 'youtube' | 'vimeo' | 'unsupported'; id: string } => {
    // YouTube patterns
    const youtubePatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
    ]

    for (const pattern of youtubePatterns) {
      const match = url.match(pattern)
      if (match) {
        return { type: 'youtube', id: match[1] }
      }
    }

    // Vimeo patterns
    const vimeoPatterns = [
      /vimeo\.com\/(\d+)/,
      /player\.vimeo\.com\/video\/(\d+)/
    ]

    for (const pattern of vimeoPatterns) {
      const match = url.match(pattern)
      if (match) {
        return { type: 'vimeo', id: match[1] }
      }
    }

    return { type: 'unsupported', id: '' }
  }

  const getThumbnail = (): string => {
    if (videoType === 'youtube' && videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    } else if (videoType === 'vimeo' && videoId) {
      // Vimeo doesn't provide direct thumbnail URLs, so we'll use a placeholder
      return ''
    }
    return ''
  }

  const getVideoUrl = (): string => {
    if (videoType === 'youtube' && videoId) {
      return `https://www.youtube.com/watch?v=${videoId}`
    } else if (videoType === 'vimeo' && videoId) {
      return `https://vimeo.com/${videoId}`
    }
    return ''
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Input Field */}
      <div className="relative">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`input pr-10 ${error ? 'border-red-300' : ''}`}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {value && (
            <>
              {videoType === 'youtube' && (
                <Youtube className="w-5 h-5 text-red-600" />
              )}
              {videoType === 'vimeo' && (
                <Video className="w-5 h-5 text-blue-600" />
              )}
              {videoType === 'unsupported' && (
                <X className="w-5 h-5 text-red-500" />
              )}
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Validation Status */}
      {value && !error && (
        <div className="space-y-2">
          {videoType === 'youtube' || videoType === 'vimeo' ? (
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <Check className="w-4 h-4" />
              <span>Valid {videoType === 'youtube' ? 'YouTube' : 'Vimeo'} URL detected</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>Please enter a valid YouTube or Vimeo URL</span>
            </div>
          )}

          {/* Preview Toggle */}
          {(videoType === 'youtube' || videoType === 'vimeo') && (
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          )}
        </div>
      )}

      {/* Video Preview */}
      {showPreview && (videoType === 'youtube' || videoType === 'vimeo') && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {videoType === 'youtube' && getThumbnail() && (
            <div className="relative">
              <img
                src={getThumbnail()}
                alt="Video thumbnail"
                className="w-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <a
                  href={getVideoUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm font-medium">Open in YouTube</span>
                </a>
              </div>
            </div>
          )}
          {videoType === 'vimeo' && (
            <div className="p-6 bg-gray-50 text-center">
              <Video className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-700 mb-3">Vimeo Video ID: {videoId}</p>
              <a
                href={getVideoUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-medium">Open in Vimeo</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500">
        <p className="mb-1">Supported formats:</p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li>YouTube: https://www.youtube.com/watch?v=VIDEO_ID</li>
          <li>YouTube Short: https://youtu.be/VIDEO_ID</li>
          <li>Vimeo: https://vimeo.com/VIDEO_ID</li>
        </ul>
      </div>
    </div>
  )
}

export default VideoUrlInput
