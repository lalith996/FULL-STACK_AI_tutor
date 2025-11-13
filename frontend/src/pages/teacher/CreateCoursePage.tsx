import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { courseService } from '@/services/courseService'
import { Module, Lesson } from '@/types'
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  Eye,
  BookOpen,
  PlayCircle,
  FileText,
} from 'lucide-react'

const CreateCoursePage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [courseData, setCourseData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Programming',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    price: 0,
    language: 'English',
    prerequisites: [] as string[],
    learningObjectives: [] as string[],
    tags: [] as string[],
  })

  const [modules, setModules] = useState<Partial<Module>[]>([
    {
      title: '',
      description: '',
      lessons: [],
      order: 1,
    },
  ])

  const [newPrereq, setNewPrereq] = useState('')
  const [newObjective, setNewObjective] = useState('')
  const [newTag, setNewTag] = useState('')

  const createCourseMutation = useMutation({
    mutationFn: () =>
      courseService.createCourse({
        ...courseData,
        modules: modules as Module[],
      }),
    onSuccess: (data) => {
      toast.success('Course created successfully!')
      navigate(`/courses/${data._id}`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create course')
    },
  })

  const handleCourseDataChange = (field: string, value: any) => {
    setCourseData((prev) => ({ ...prev, [field]: value }))
  }

  const addArrayItem = (field: 'prerequisites' | 'learningObjectives' | 'tags', value: string) => {
    if (value.trim()) {
      setCourseData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }))

      if (field === 'prerequisites') setNewPrereq('')
      if (field === 'learningObjectives') setNewObjective('')
      if (field === 'tags') setNewTag('')
    }
  }

  const removeArrayItem = (field: 'prerequisites' | 'learningObjectives' | 'tags', index: number) => {
    setCourseData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const addModule = () => {
    setModules((prev) => [
      ...prev,
      {
        title: '',
        description: '',
        lessons: [],
        order: prev.length + 1,
      },
    ])
  }

  const removeModule = (index: number) => {
    setModules((prev) => prev.filter((_, i) => i !== index).map((m, i) => ({ ...m, order: i + 1 })))
  }

  const updateModule = (index: number, field: string, value: any) => {
    setModules((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    )
  }

  const moveModule = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === modules.length - 1)
    ) {
      return
    }

    const newModules = [...modules]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]]
    setModules(newModules.map((m, i) => ({ ...m, order: i + 1 })))
  }

  const addLesson = (moduleIndex: number) => {
    const newLesson: Partial<Lesson> = {
      title: '',
      type: 'video',
      content: '',
      duration: 0,
      resources: [],
      order: (modules[moduleIndex].lessons?.length || 0) + 1,
    }

    setModules((prev) =>
      prev.map((m, i) =>
        i === moduleIndex ? { ...m, lessons: [...(m.lessons || []), newLesson] } : m
      )
    )
  }

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    setModules((prev) =>
      prev.map((m, i) =>
        i === moduleIndex
          ? {
              ...m,
              lessons: m.lessons
                ?.filter((_, li) => li !== lessonIndex)
                .map((l, li) => ({ ...l, order: li + 1 })),
            }
          : m
      )
    )
  }

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: string, value: any) => {
    setModules((prev) =>
      prev.map((m, i) =>
        i === moduleIndex
          ? {
              ...m,
              lessons: m.lessons?.map((l, li) =>
                li === lessonIndex ? { ...l, [field]: value } : l
              ),
            }
          : m
      )
    )
  }

  const handleSubmit = () => {
    // Validation
    if (!courseData.title || !courseData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    if (modules.length === 0 || !modules[0].title) {
      toast.error('Please add at least one module')
      return
    }

    createCourseMutation.mutate()
  }

  const categories = [
    'Programming',
    'Data Science',
    'Business',
    'Design',
    'Marketing',
    'Languages',
    'Mathematics',
    'Science',
    'Arts',
    'Personal Development',
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
        <p className="text-gray-600">Build your course step by step</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {[
            { num: 1, label: 'Basic Info' },
            { num: 2, label: 'Content' },
            { num: 3, label: 'Review' },
          ].map((s, index) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s.num
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s.num}
                </div>
                <span className="text-sm mt-2">{s.label}</span>
              </div>
              {index < 2 && (
                <div
                  className={`h-1 flex-1 mx-4 ${
                    step > s.num ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Course Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={courseData.title}
                  onChange={(e) => handleCourseDataChange('title', e.target.value)}
                  className="input"
                  placeholder="e.g., Complete Web Development Bootcamp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={courseData.shortDescription}
                  onChange={(e) => handleCourseDataChange('shortDescription', e.target.value)}
                  className="input"
                  placeholder="A brief one-liner about your course"
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Description *
                </label>
                <textarea
                  value={courseData.description}
                  onChange={(e) => handleCourseDataChange('description', e.target.value)}
                  className="input"
                  rows={6}
                  placeholder="Detailed description of what students will learn..."
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={courseData.category}
                    onChange={(e) => handleCourseDataChange('category', e.target.value)}
                    className="input"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level *
                  </label>
                  <select
                    value={courseData.level}
                    onChange={(e) => handleCourseDataChange('level', e.target.value)}
                    className="input"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={courseData.price}
                    onChange={(e) => handleCourseDataChange('price', Number(e.target.value))}
                    className="input"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prerequisites
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newPrereq}
                    onChange={(e) => setNewPrereq(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), addArrayItem('prerequisites', newPrereq))
                    }
                    className="input flex-1"
                    placeholder="Add a prerequisite"
                  />
                  <button
                    onClick={() => addArrayItem('prerequisites', newPrereq)}
                    className="btn btn-secondary"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {courseData.prerequisites.map((prereq, index) => (
                    <span key={index} className="badge bg-gray-200 text-gray-700 flex items-center space-x-1">
                      <span>{prereq}</span>
                      <button onClick={() => removeArrayItem('prerequisites', index)}>
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Learning Objectives
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), addArrayItem('learningObjectives', newObjective))
                    }
                    className="input flex-1"
                    placeholder="What will students learn?"
                  />
                  <button
                    onClick={() => addArrayItem('learningObjectives', newObjective)}
                    className="btn btn-secondary"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {courseData.learningObjectives.map((obj, index) => (
                    <span key={index} className="badge bg-primary-100 text-primary-700 flex items-center space-x-1">
                      <span>{obj}</span>
                      <button onClick={() => removeArrayItem('learningObjectives', index)}>
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), addArrayItem('tags', newTag))
                    }
                    className="input flex-1"
                    placeholder="Add tags for better discoverability"
                  />
                  <button
                    onClick={() => addArrayItem('tags', newTag)}
                    className="btn btn-secondary"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {courseData.tags.map((tag, index) => (
                    <span key={index} className="badge bg-gray-200 text-gray-700 flex items-center space-x-1">
                      <span>{tag}</span>
                      <button onClick={() => removeArrayItem('tags', index)}>
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={() => setStep(2)} className="btn btn-primary">
              Next: Add Content
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Content (Modules & Lessons) */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Course Content</h2>
              <button onClick={addModule} className="btn btn-primary flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add Module</span>
              </button>
            </div>

            {modules.length === 0 ? (
              <p className="text-center text-gray-600 py-8">
                No modules yet. Click "Add Module" to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                          className="input font-semibold"
                          placeholder="Module title"
                        />
                        <textarea
                          value={module.description}
                          onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                          className="input"
                          rows={2}
                          placeholder="Module description (optional)"
                        />
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => moveModule(moduleIndex, 'up')}
                          disabled={moduleIndex === 0}
                          className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                        >
                          <ChevronUp className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => moveModule(moduleIndex, 'down')}
                          disabled={moduleIndex === modules.length - 1}
                          className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => removeModule(moduleIndex)}
                          className="p-2 hover:bg-red-100 rounded text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Lessons */}
                    <div className="ml-6 space-y-3">
                      {module.lessons?.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="bg-gray-50 rounded p-3">
                          <div className="flex items-start space-x-3">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center space-x-2">
                                <select
                                  value={lesson.type}
                                  onChange={(e) =>
                                    updateLesson(moduleIndex, lessonIndex, 'type', e.target.value)
                                  }
                                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                                >
                                  <option value="video">Video</option>
                                  <option value="text">Text</option>
                                  <option value="quiz">Quiz</option>
                                </select>
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) =>
                                    updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)
                                  }
                                  className="input text-sm flex-1"
                                  placeholder="Lesson title"
                                />
                                <input
                                  type="number"
                                  value={lesson.duration}
                                  onChange={(e) =>
                                    updateLesson(
                                      moduleIndex,
                                      lessonIndex,
                                      'duration',
                                      Number(e.target.value)
                                    )
                                  }
                                  className="input text-sm w-20"
                                  placeholder="Min"
                                  min="0"
                                />
                                <button
                                  onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                  className="p-1 hover:bg-red-100 rounded text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <input
                                type="text"
                                value={lesson.content}
                                onChange={(e) =>
                                  updateLesson(moduleIndex, lessonIndex, 'content', e.target.value)
                                }
                                className="input text-sm"
                                placeholder={
                                  lesson.type === 'video'
                                    ? 'Video URL or content'
                                    : 'Lesson content or description'
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => addLesson(moduleIndex)}
                        className="btn btn-secondary btn-sm flex items-center space-x-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Lesson</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="btn btn-secondary">
              Back
            </button>
            <button onClick={() => setStep(3)} className="btn btn-primary">
              Next: Review
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Review Your Course</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{courseData.title}</h3>
                <p className="text-gray-600 mb-4">{courseData.description}</p>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Category:</span>{' '}
                    <span className="font-medium">{courseData.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Level:</span>{' '}
                    <span className="font-medium capitalize">{courseData.level}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Price:</span>{' '}
                    <span className="font-medium">
                      {courseData.price > 0 ? `$${courseData.price}` : 'Free'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Modules:</span>{' '}
                    <span className="font-medium">{modules.length}</span>
                  </div>
                </div>
              </div>

              {modules.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Course Outline</h4>
                  <div className="space-y-2">
                    {modules.map((module, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="font-medium mb-2">
                          {index + 1}. {module.title}
                        </div>
                        <div className="ml-4 space-y-1">
                          {module.lessons?.map((lesson, li) => (
                            <div key={li} className="text-sm text-gray-600 flex items-center space-x-2">
                              {lesson.type === 'video' ? (
                                <PlayCircle className="w-4 h-4" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                              <span>
                                {li + 1}. {lesson.title} ({lesson.duration} min)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="btn btn-secondary">
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={createCourseMutation.isPending}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{createCourseMutation.isPending ? 'Creating...' : 'Create Course'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateCoursePage
