import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Edit, Trash2, Eye, Users, Star, BookOpen, Plus, Search, Filter } from 'lucide-react'
import { courseService } from '@/services/courseService'
import { useAuthStore } from '@/store/authStore'
import { Course } from '@/types'

const ManageCoursesPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null)

  // Fetch teacher's courses
  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['teacher-courses', user?._id],
    queryFn: () => courseService.getCourses({ instructor: user?._id }),
    enabled: !!user?._id
  })

  const courses = coursesData?.courses || []

  // Delete course mutation
  const deleteMutation = useMutation({
    mutationFn: (courseId: string) => courseService.deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-courses'] })
      toast.success('Course deleted successfully!')
      setDeletingCourseId(null)
    },
    onError: () => {
      toast.error('Failed to delete course')
      setDeletingCourseId(null)
    }
  })

  // Toggle publish status
  const togglePublishMutation = useMutation({
    mutationFn: ({ courseId, published }: { courseId: string; published: boolean }) =>
      published ? courseService.unpublishCourse(courseId) : courseService.publishCourse(courseId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teacher-courses'] })
      toast.success(variables.published ? 'Course unpublished' : 'Course published!')
    },
    onError: () => {
      toast.error('Failed to update course status')
    }
  })

  const handleDelete = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      setDeletingCourseId(courseId)
      deleteMutation.mutate(courseId)
    }
  }

  const handleEdit = (courseId: string) => {
    navigate(`/teacher/edit-course/${courseId}`)
  }

  const handleTogglePublish = (course: Course) => {
    togglePublishMutation.mutate({ courseId: course._id, published: course.published })
  }

  // Filter courses
  const filteredCourses = courses.filter((course: Course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'published' && course.published) ||
                         (filterStatus === 'draft' && !course.published)
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: courses.length,
    published: courses.filter((c: Course) => c.published).length,
    draft: courses.filter((c: Course) => !c.published).length,
    totalStudents: courses.reduce((sum: number, c: Course) => sum + (c.studentsEnrolled || 0), 0),
    avgRating: courses.length > 0
      ? (courses.reduce((sum: number, c: Course) => sum + (c.rating?.average || 0), 0) / courses.length).toFixed(1)
      : '0.0'
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
          <p className="text-gray-600 mt-1">Edit, publish, and manage your courses</p>
        </div>
        <button
          onClick={() => navigate('/teacher/create-course')}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
            <Eye className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
            </div>
            <Edit className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.avgRating}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by title or category..."
              className="input pl-10 w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="input"
            >
              <option value="all">All Courses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses List */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {courses.length === 0 ? 'No courses yet' : 'No courses found'}
          </h3>
          <p className="text-gray-600 mb-4">
            {courses.length === 0
              ? 'Create your first course to get started'
              : 'Try adjusting your search or filters'}
          </p>
          {courses.length === 0 && (
            <button
              onClick={() => navigate('/teacher/create-course')}
              className="btn btn-primary"
            >
              Create Your First Course
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course: Course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Thumbnail */}
                  <img
                    src={course.thumbnail || 'https://via.placeholder.com/150'}
                    alt={course.title}
                    className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                  />

                  {/* Course Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-900 truncate">
                            {course.title}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              course.published
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {course.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {course.shortDescription}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mt-3">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{course.studentsEnrolled || 0} students</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{course.rating?.average?.toFixed(1) || '0.0'} ({course.rating?.count || 0})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.modules?.length || 0} modules</span>
                      </div>
                      <span className="badge bg-gray-100 text-gray-700">
                        {course.category}
                      </span>
                      <span className="badge bg-primary-100 text-primary-700">
                        ${course.price}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => navigate(`/courses/${course._id}`)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View course"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(course._id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit course"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleTogglePublish(course)}
                      disabled={togglePublishMutation.isPending}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        course.published
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {course.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      disabled={deletingCourseId === course._id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete course"
                    >
                      {deletingCourseId === course._id ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageCoursesPage
