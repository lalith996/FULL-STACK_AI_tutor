import { useState, useEffect } from 'react'
import { CheckCircle, Clock, FileText, Download, Bookmark } from 'lucide-react'
import VideoPlayer from './VideoPlayer'
import { toast } from 'react-hot-toast'

interface VideoLessonProps {
  lesson: {
    _id: string
    title: string
    description?: string
    videoUrl?: string
    duration?: number
    resources?: Array<{
      title: string
      url: string
      type: string
    }>
    transcript?: string
  }
  isCompleted?: boolean
  onComplete?: () => void
  onProgress?: (progress: number) => void
}

const VideoLesson = ({ lesson, isCompleted = false, onComplete, onProgress }: VideoLessonProps) => {
  const [showTranscript, setShowTranscript] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    // Check if lesson is bookmarked
    const bookmarks = JSON.parse(localStorage.getItem('lesson-bookmarks') || '[]')
    setIsBookmarked(bookmarks.includes(lesson._id))
  }, [lesson._id])

  const handleVideoComplete = () => {
    if (!isCompleted && onComplete) {
      onComplete()
      toast.success('Lesson completed!')
    }
  }

  const handleVideoProgress = (progress: number) => {
    if (onProgress) {
      onProgress(progress)
    }

    // Auto-complete when video reaches 90%
    if (progress >= 90 && !isCompleted && onComplete) {
      onComplete()
    }
  }

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('lesson-bookmarks') || '[]')

    if (isBookmarked) {
      const updated = bookmarks.filter((id: string) => id !== lesson._id)
      localStorage.setItem('lesson-bookmarks', JSON.stringify(updated))
      setIsBookmarked(false)
      toast.success('Bookmark removed')
    } else {
      bookmarks.push(lesson._id)
      localStorage.setItem('lesson-bookmarks', JSON.stringify(bookmarks))
      setIsBookmarked(true)
      toast.success('Lesson bookmarked!')
    }
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{lesson.title}</h2>
            {isCompleted && (
              <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>
          {lesson.description && (
            <p className="text-gray-600">{lesson.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked
                ? 'bg-primary-100 text-primary-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Lesson Stats */}
      <div className="flex items-center space-x-6 text-sm text-gray-600">
        {lesson.duration && (
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(lesson.duration)}</span>
          </div>
        )}
        {lesson.resources && lesson.resources.length > 0 && (
          <div className="flex items-center space-x-1">
            <FileText className="w-4 h-4" />
            <span>{lesson.resources.length} Resources</span>
          </div>
        )}
      </div>

      {/* Video Player */}
      {lesson.videoUrl ? (
        <VideoPlayer
          url={lesson.videoUrl}
          title={lesson.title}
          onProgress={handleVideoProgress}
          onComplete={handleVideoComplete}
        />
      ) : (
        <div className="bg-gray-100 rounded-lg p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No video available for this lesson</p>
        </div>
      )}

      {/* Resources */}
      {lesson.resources && lesson.resources.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Lesson Resources</h3>
          <div className="space-y-2">
            {lesson.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Download className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{resource.title}</p>
                    <p className="text-sm text-gray-500">{resource.type}</p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Transcript */}
      {lesson.transcript && (
        <div className="card">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full flex items-center justify-between"
          >
            <h3 className="text-lg font-semibold">Video Transcript</h3>
            <span className="text-sm text-primary-600">
              {showTranscript ? 'Hide' : 'Show'}
            </span>
          </button>
          {showTranscript && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {lesson.transcript}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mark as Complete Button */}
      {!isCompleted && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleVideoComplete}
            className="btn btn-primary flex items-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Mark as Complete</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default VideoLesson
