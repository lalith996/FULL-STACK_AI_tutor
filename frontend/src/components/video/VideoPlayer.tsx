import { useState, useEffect } from 'react'
import { Play, AlertCircle, ExternalLink } from 'lucide-react'

interface VideoPlayerProps {
  url: string
  title?: string
  onProgress?: (progress: number) => void
  onComplete?: () => void
}

const VideoPlayer = ({ url, title, onProgress, onComplete }: VideoPlayerProps) => {
  const [videoType, setVideoType] = useState<'youtube' | 'vimeo' | 'unsupported' | null>(null)
  const [videoId, setVideoId] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const parsed = parseVideoUrl(url)
    setVideoType(parsed.type)
    setVideoId(parsed.id)
  }, [url])

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

  const getEmbedUrl = (): string => {
    if (videoType === 'youtube') {
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`
    } else if (videoType === 'vimeo') {
      return `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`
    }
    return ''
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  if (!videoType || videoType === 'unsupported') {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Unsupported Video Format
        </h3>
        <p className="text-gray-600 mb-4">
          We currently support YouTube and Vimeo videos only.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
        >
          <span>Open video in new tab</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    )
  }

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 z-10">
          <button
            onClick={handlePlay}
            className="group flex flex-col items-center space-y-4"
          >
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center group-hover:bg-primary-700 transition-all transform group-hover:scale-110">
              <Play className="w-10 h-10 text-white ml-1" />
            </div>
            {title && (
              <p className="text-white text-lg font-medium">{title}</p>
            )}
          </button>
        </div>
      )}
      <iframe
        src={isPlaying ? getEmbedUrl() : ''}
        title={title || 'Video Player'}
        className="absolute top-0 left-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

export default VideoPlayer
