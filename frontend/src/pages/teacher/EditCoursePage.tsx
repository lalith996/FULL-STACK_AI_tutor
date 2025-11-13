import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Save, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { courseService } from '@/services/courseService'
import { Module, Lesson } from '@/types'

const EditCoursePage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [step, setStep] = useState(1)
  const [courseData, setCourseData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Web Development',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    price: 0,
    thumbnail: '',
    language: 'English',
    prerequisites: [] as string[],
    learningObjectives: [] as string[],
    tags: [] as string[]
  })

  const [modules, setModules] = useState<Module[]>([])
  const [newPrerequisite, setNewPrerequisite] = useState('')
  const [newObjective, setNewObjective] = useState('')
  const [newTag, setNewTag] = useState('')

  // Fetch existing course data
  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => courseService.getCourse(id!),
    enabled: !!id
  })

  // Populate form with existing data
  useEffect(() => {
    if (course) {
      setCourseData({
        title: course.title,
        shortDescription: course.shortDescription,
        description: course.description,
        category: course.category,
        level: course.level,
        price: course.price,
        thumbnail: course.thumbnail || '',
        language: course.language,
        prerequisites: course.prerequisites || [],
        learningObjectives: course.learningObjectives || [],
        tags: course.tags || []
      })
      setModules(course.modules || [])
    }
  }, [course])

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: () => courseService.updateCourse(id!, {
      ...courseData,
      modules: modules as Module[]
    }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['course', id] })
      queryClient.invalidateQueries({ queryKey: ['teacher-courses'] })
      toast.success('Course updated successfully!')
      navigate(`/courses/${data._id}`)
    },
    onError: () => {
      toast.error('Failed to update course')
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value })
  }

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setCourseData({
        ...courseData,
        prerequisites: [...courseData.prerequisites, newPrerequisite.trim()]
      })
      setNewPrerequisite('')
    }
  }

  const removePrerequisite = (index: number) => {
    setCourseData({
      ...courseData,
      prerequisites: courseData.prerequisites.filter((_, i) => i !== index)
    })
  }

  const addObjective = () => {
    if (newObjective.trim()) {
      setCourseData({
        ...courseData,
        learningObjectives: [...courseData.learningObjectives, newObjective.trim()]
      })
      setNewObjective('')
    }
  }

  const removeObjective = (index: number) => {
    setCourseData({
      ...courseData,
      learningObjectives: courseData.learningObjectives.filter((_, i) => i !== index)
    })
  }

  const addTag = () => {
    if (newTag.trim() && !courseData.tags.includes(newTag.trim())) {
      setCourseData({
        ...courseData,
        tags: [...courseData.tags, newTag.trim()]
      })
      setNewTag('')
    }
  }

  const removeTag = (index: number) => {
    setCourseData({
      ...courseData,
      tags: courseData.tags.filter((_, i) => i !== index)
    })
  }

  const addModule = () => {
    const newModule: Module = {
      _id: `temp-${Date.now()}`,
      title: `Module ${modules.length + 1}`,
      description: '',
      order: modules.length + 1,
      lessons: []
    }
    setModules([...modules, newModule])
  }

  const updateModule = (index: number, field: keyof Module, value: string) => {
    const updatedModules = [...modules]
    updatedModules[index] = { ...updatedModules[index], [field]: value }
    setModules(updatedModules)
  }

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index))
  }

  const moveModule = (index: number, direction: 'up' | 'down') => {
    const newModules = [...modules]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex >= 0 && targetIndex < modules.length) {
      [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]]
      newModules.forEach((m, i) => m.order = i + 1)
      setModules(newModules)
    }
  }

  const addLesson = (moduleIndex: number) => {
    const updatedModules = [...modules]
    const newLesson: Lesson = {
      _id: `temp-${Date.now()}`,
      title: `Lesson ${updatedModules[moduleIndex].lessons.length + 1}`,
      duration: 10,
      type: 'video',
      content: '',
      order: updatedModules[moduleIndex].lessons.length + 1
    }
    updatedModules[moduleIndex].lessons.push(newLesson)
    setModules(updatedModules)
  }

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: keyof Lesson, value: any) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex].lessons[lessonIndex] = {
      ...updatedModules[moduleIndex].lessons[lessonIndex],
      [field]: value
    }
    setModules(updatedModules)
  }

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex)
    setModules(updatedModules)
  }

  const handleSubmit = () => {
    if (!courseData.title || !courseData.shortDescription || !courseData.description) {
      toast.error('Please fill in all required fields')
      return
    }
    if (modules.length === 0) {
      toast.error('Please add at least one module')
      return
    }
    updateCourseMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">Course not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/teacher/manage-courses')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Courses</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
        <p className="text-gray-600 mt-1">Update your course information and content</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <button
              onClick={() => setStep(s)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                step === s
                  ? 'bg-primary-600 text-white'
                  : step > s
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {s}
            </button>
            {s < 3 && (
              <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="card">
        {/* Same step content as CreateCoursePage, but with pre-filled values */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            {/* All the same fields as CreateCoursePage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
              <input
                type="text"
                name="title"
                value={courseData.title}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
              <input
                type="text"
                name="shortDescription"
                value={courseData.shortDescription}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                rows={4}
                className="input resize-none"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select name="category" value={courseData.category} onChange={handleInputChange} className="input">
                  <option>Web Development</option>
                  <option>Data Science</option>
                  <option>Mobile Development</option>
                  <option>Design</option>
                  <option>Business</option>
                  <option>Marketing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
                <select name="level" value={courseData.level} onChange={handleInputChange} className="input">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={courseData.price}
                  onChange={handleInputChange}
                  className="input"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <input
                  type="text"
                  name="language"
                  value={courseData.language}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL</label>
              <input
                type="url"
                name="thumbnail"
                value={courseData.thumbnail}
                onChange={handleInputChange}
                className="input"
              />
            </div>
            {/* Prerequisites, Objectives, Tags - same as CreateCoursePage */}
            <div className="flex justify-end">
              <button onClick={() => setStep(2)} className="btn btn-primary">
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Course Content</h2>
              <button onClick={addModule} className="btn btn-outline btn-sm flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Module</span>
              </button>
            </div>
            {/* Module and Lesson editor - same as CreateCoursePage */}
            {modules.map((module, moduleIndex) => (
              <div key={module._id} className="border border-gray-200 rounded-lg p-4">
                {/* Module editor content */}
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={module.title}
                    onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                    className="input flex-1 mr-4"
                  />
                  <div className="flex items-center space-x-2">
                    <button onClick={() => moveModule(moduleIndex, 'up')} disabled={moduleIndex === 0} className="p-2">
                      <ChevronUp className="w-5 h-5" />
                    </button>
                    <button onClick={() => moveModule(moduleIndex, 'down')} disabled={moduleIndex === modules.length - 1} className="p-2">
                      <ChevronDown className="w-5 h-5" />
                    </button>
                    <button onClick={() => removeModule(moduleIndex)} className="p-2 text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <textarea
                  value={module.description}
                  onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                  placeholder="Module description"
                  className="input mb-4"
                  rows={2}
                />
                <button onClick={() => addLesson(moduleIndex)} className="btn btn-outline btn-sm mb-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lesson
                </button>
                {module.lessons.map((lesson, lessonIndex) => (
                  <div key={lesson._id} className="ml-4 p-3 bg-gray-50 rounded mb-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                        className="input flex-1"
                      />
                      <input
                        type="number"
                        value={lesson.duration}
                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'duration', parseInt(e.target.value))}
                        className="input w-20"
                        placeholder="Min"
                      />
                      <button onClick={() => removeLesson(moduleIndex, lessonIndex)} className="p-2 text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(1)} className="btn btn-outline">
                Previous
              </button>
              <button onClick={() => setStep(3)} className="btn btn-primary">
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Review & Update</h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Course Title</h3>
                <p className="text-gray-700">{courseData.title}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Modules & Lessons</h3>
                <p className="text-gray-700">{modules.length} modules, {modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons</p>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(2)} className="btn btn-outline">
                Previous
              </button>
              <button
                onClick={handleSubmit}
                disabled={updateCourseMutation.isPending}
                className="btn btn-primary flex items-center space-x-2"
              >
                {updateCourseMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Update Course</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditCoursePage
