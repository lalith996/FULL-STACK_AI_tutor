import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { courseService } from '@/services/courseService'
import { useAuthStore } from '@/store/authStore'
import {
  Star,
  Users,
  Clock,
  BookOpen,
  CheckCircle,
  PlayCircle,
  Award,
  Globe,
  BarChart,
} from 'lucide-react'

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => courseService.getCourse(id!),
    enabled: !!id,
  })

  const enrollMutation = useMutation({
    mutationFn: () => courseService.enrollCourse(id!),
    onSuccess: () => {
      toast.success('Successfully enrolled in course!')
      navigate(`/learn/${id}`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to enroll')
    },
  })

  const handleEnroll = () => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll')
      navigate('/auth/login')
      return
    }
    enrollMutation.mutate()
  }

  const isEnrolled = user?.enrolledCourses?.some(
    (ec: any) => (typeof ec.course === 'string' ? ec.course : ec.course._id) === id
  )

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-8"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">Course not found</p>
      </div>
    )
  }

  const instructor = typeof course.instructor === 'object' ? course.instructor : null

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="badge bg-white/20 text-white">{course.category}</span>
                <span className="badge bg-white/20 text-white capitalize">{course.level}</span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-primary-100 mb-6">{course.shortDescription}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-300 fill-current" />
                  <span className="font-semibold">{course.rating.average.toFixed(1)}</span>
                  <span className="text-primary-200">({course.rating.count} ratings)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{course.studentsEnrolled} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{Math.floor(course.totalDuration / 60)} hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons</span>
                </div>
              </div>

              {/* Instructor */}
              {instructor && (
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-semibold">
                    {instructor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-primary-200">Created by</p>
                    <p className="font-semibold">{instructor.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Enrollment Card */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-xl p-6 text-gray-900">
                <div className="mb-4">
                  {course.price > 0 ? (
                    <div className="text-3xl font-bold text-primary-600">${course.price}</div>
                  ) : (
                    <div className="text-3xl font-bold text-green-600">Free</div>
                  )}
                </div>

                {isEnrolled ? (
                  <button
                    onClick={() => navigate(`/learn/${id}`)}
                    className="w-full btn btn-primary mb-4 flex items-center justify-center space-x-2"
                  >
                    <PlayCircle className="w-5 h-5" />
                    <span>Continue Learning</span>
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrollMutation.isPending}
                    className="w-full btn btn-primary mb-4"
                  >
                    {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Lifetime access</span>
                  </div>
                  {course.certificateAvailable && (
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span>Certificate of completion</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <span>{course.language}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">About this course</h2>
              <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
            </div>

            {/* Learning Objectives */}
            {course.learningObjectives && course.learningObjectives.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {course.learningObjectives.map((obj, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Content */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Course Content</h2>
              <div className="space-y-4">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module._id} className="border border-gray-200 rounded-lg">
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">
                          Module {moduleIndex + 1}: {module.title}
                        </h3>
                        {module.description && (
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">{module.lessons.length} lessons</span>
                    </div>
                    <div className="divide-y">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson._id} className="px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <PlayCircle className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-700">
                              {lessonIndex + 1}. {lesson.title}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">{lesson.duration} min</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div className="card mb-6">
                <h3 className="font-semibold mb-3">Prerequisites</h3>
                <ul className="space-y-2">
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <div className="card">
                <h3 className="font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, index) => (
                    <span key={index} className="badge bg-gray-100 text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailPage
