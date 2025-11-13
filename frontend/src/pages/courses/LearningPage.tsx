import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { courseService } from '@/services/courseService'
import { progressService } from '@/services/progressService'
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  PlayCircle,
  FileText,
  Download,
  Menu,
  X,
} from 'lucide-react'

const LearningPage = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const queryClient = useQueryClient()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [startTime, setStartTime] = useState(Date.now())

  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseService.getCourse(courseId!),
    enabled: !!courseId,
  })

  const { data: progress } = useQuery({
    queryKey: ['progress', courseId],
    queryFn: () => progressService.getProgress(courseId!),
    enabled: !!courseId,
  })

  const completeLessonMutation = useMutation({
    mutationFn: (data: { lessonId: string; moduleId: string; timeSpent: number }) =>
      progressService.completeLesson(courseId!, data.lessonId, {
        moduleId: data.moduleId,
        timeSpent: data.timeSpent,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', courseId] })
      toast.success('Lesson completed!')
    },
  })

  useEffect(() => {
    if (course && progress) {
      // Update last accessed lesson
      const currentModule = course.modules[currentModuleIndex]
      const currentLesson = currentModule?.lessons[currentLessonIndex]

      if (currentModule && currentLesson) {
        progressService.updateProgress(courseId!, {
          moduleId: currentModule._id,
          lessonId: currentLesson._id,
        })
      }
    }
  }, [currentModuleIndex, currentLessonIndex, courseId, course, progress])

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading course...</p>
      </div>
    )
  }

  const currentModule = course.modules[currentModuleIndex]
  const currentLesson = currentModule?.lessons[currentLessonIndex]

  if (!currentModule || !currentLesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No lessons available</p>
      </div>
    )
  }

  const isLessonCompleted = progress?.completedLessons?.some(
    (cl) => cl.lessonId === currentLesson._id && cl.moduleId === currentModule._id
  )

  const handleCompleteLesson = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    completeLessonMutation.mutate({
      lessonId: currentLesson._id,
      moduleId: currentModule._id,
      timeSpent,
    })
    setStartTime(Date.now())
  }

  const goToNextLesson = () => {
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
    } else if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1)
      setCurrentLessonIndex(0)
    }
    setStartTime(Date.now())
  }

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1)
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1)
      const prevModule = course.modules[currentModuleIndex - 1]
      setCurrentLessonIndex(prevModule.lessons.length - 1)
    }
    setStartTime(Date.now())
  }

  const hasNextLesson =
    currentLessonIndex < currentModule.lessons.length - 1 ||
    currentModuleIndex < course.modules.length - 1

  const hasPreviousLesson = currentLessonIndex > 0 || currentModuleIndex > 0

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 bg-white overflow-y-auto flex-shrink-0`}
      >
        {sidebarOpen && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Course Content</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-semibold text-primary-600">{progress?.overallProgress || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress?.overallProgress || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Modules and Lessons */}
            <div className="space-y-2">
              {course.modules.map((module, moduleIdx) => (
                <div key={module._id} className="border border-gray-200 rounded-lg">
                  <div className="bg-gray-50 px-3 py-2">
                    <h3 className="font-medium text-sm text-gray-900">
                      {moduleIdx + 1}. {module.title}
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {module.lessons.map((lesson, lessonIdx) => {
                      const completed = progress?.completedLessons?.some(
                        (cl) => cl.lessonId === lesson._id && cl.moduleId === module._id
                      )
                      const isCurrent = moduleIdx === currentModuleIndex && lessonIdx === currentLessonIndex

                      return (
                        <button
                          key={lesson._id}
                          onClick={() => {
                            setCurrentModuleIndex(moduleIdx)
                            setCurrentLessonIndex(lessonIdx)
                            setStartTime(Date.now())
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition flex items-center space-x-2 ${
                            isCurrent ? 'bg-primary-50 border-l-2 border-primary-600' : ''
                          }`}
                        >
                          {completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                          )}
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            {lesson.type === 'video' ? (
                              <PlayCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                            <span className="text-sm text-gray-700 truncate">{lesson.title}</span>
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0">{lesson.duration}m</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="hover:text-primary-400">
                <Menu className="w-6 h-6" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-semibold">{currentLesson.title}</h1>
              <p className="text-sm text-gray-400">
                Module {currentModuleIndex + 1}, Lesson {currentLessonIndex + 1}
              </p>
            </div>
          </div>
          {!isLessonCompleted && (
            <button onClick={handleCompleteLesson} className="btn btn-primary">
              Mark as Complete
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-900">
          <div className="max-w-5xl mx-auto p-6">
            {/* Video/Content Display */}
            {currentLesson.type === 'video' ? (
              <div className="bg-black rounded-lg mb-6 aspect-video flex items-center justify-center">
                <div className="text-center text-white">
                  <PlayCircle className="w-16 h-16 mx-auto mb-4 text-primary-400" />
                  <p className="text-lg mb-2">Video Player</p>
                  <p className="text-sm text-gray-400">
                    Video URL: {currentLesson.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    (Video player integration coming soon)
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 mb-6">
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                </div>
              </div>
            )}

            {/* Resources */}
            {currentLesson.resources && currentLesson.resources.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Lesson Resources</span>
                </h3>
                <div className="space-y-2">
                  {currentLesson.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                    >
                      <FileText className="w-5 h-5 text-primary-400" />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{resource.name}</p>
                        <p className="text-gray-400 text-xs">{resource.type}</p>
                      </div>
                      <Download className="w-4 h-4 text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousLesson}
                disabled={!hasPreviousLesson}
                className="btn btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>

              <button
                onClick={goToNextLesson}
                disabled={!hasNextLesson}
                className="btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next Lesson</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LearningPage
