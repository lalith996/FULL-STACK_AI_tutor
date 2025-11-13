export interface User {
  _id: string
  name: string
  email: string
  role: 'student' | 'teacher' | 'admin'
  profile: {
    avatar: string
    bio?: string
    level: number
    points: number
    badges: Badge[]
    streak: {
      current: number
      longest: number
      lastActivity?: Date
    }
    preferences: {
      learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
      notifications: {
        email: boolean
        push: boolean
      }
      theme: 'light' | 'dark' | 'auto'
    }
  }
  enrolledCourses: EnrolledCourse[]
  createdAt: string
  updatedAt: string
}

export interface EnrolledCourse {
  course: string | Course
  enrolledAt: Date
  progress: number
  completed: boolean
  completedAt?: Date
  lastAccessedAt: Date
}

export interface Course {
  _id: string
  title: string
  description: string
  shortDescription?: string
  instructor: User | string
  thumbnail: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  price: number
  modules: Module[]
  tags: string[]
  language: string
  prerequisites: string[]
  learningObjectives: string[]
  enrolledStudents: string[]
  rating: {
    average: number
    count: number
  }
  reviews: Review[]
  isPublished: boolean
  publishedAt?: Date
  totalDuration: number
  studentsEnrolled: number
  certificateAvailable: boolean
  totalLessons?: number
  createdAt: string
  updatedAt: string
}

export interface Module {
  _id: string
  title: string
  description?: string
  lessons: Lesson[]
  order: number
}

export interface Lesson {
  _id: string
  title: string
  type: 'video' | 'text' | 'quiz' | 'assignment'
  content: string
  duration: number
  resources: Resource[]
  order: number
}

export interface Resource {
  name: string
  url: string
  type: string
}

export interface Quiz {
  _id: string
  title: string
  description?: string
  course: string | Course
  module?: string
  lesson?: string
  instructor: string | User
  questions: Question[]
  timeLimit?: number
  passingScore: number
  attemptsAllowed: number
  shuffleQuestions: boolean
  showCorrectAnswers: boolean
  isPublished: boolean
  availableFrom?: Date
  availableUntil?: Date
  totalPoints: number
  questionCount?: number
  createdAt: string
  updatedAt: string
}

export interface Question {
  _id: string
  question: string
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay'
  options?: QuestionOption[]
  correctAnswer?: string
  points: number
  explanation?: string
  order: number
}

export interface QuestionOption {
  _id: string
  text: string
  isCorrect?: boolean
}

export interface QuizAttempt {
  _id: string
  quiz: string | Quiz
  user: string | User
  answers: Answer[]
  score: number
  earnedPoints: number
  totalPoints: number
  passed: boolean
  attemptNumber: number
  timeSpent: number
  startedAt: Date
  completedAt: Date
  isGraded: boolean
  feedback?: string
}

export interface Answer {
  questionId: string
  answer: any
  isCorrect?: boolean
  pointsEarned?: number
}

export interface Badge {
  _id: string
  name: string
  description: string
  icon: string
  category: 'achievement' | 'streak' | 'course-completion' | 'quiz-mastery' | 'social' | 'special'
  criteria: {
    type: string
    value: number
  }
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  points: number
  earnedBy: any[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Review {
  _id: string
  course: string | Course
  user: string | User
  rating: number
  title?: string
  comment: string
  helpful: string[]
  helpfulCount: number
  instructorReply?: {
    comment: string
    repliedAt: Date
  }
  isApproved: boolean
  createdAt: string
  updatedAt: string
}

export interface Progress {
  _id: string
  user: string | User
  course: string | Course
  completedLessons: CompletedLesson[]
  quizScores: QuizScore[]
  assignmentSubmissions: any[]
  overallProgress: number
  totalTimeSpent: number
  lastAccessedLesson?: {
    moduleId: string
    lessonId: string
    accessedAt: Date
  }
  certificateIssued: boolean
  certificateIssuedAt?: Date
  certificateId?: string
  createdAt: string
  updatedAt: string
}

export interface CompletedLesson {
  moduleId: string
  lessonId: string
  completedAt: Date
  timeSpent: number
}

export interface QuizScore {
  quiz: string | Quiz
  score: number
  passed: boolean
  completedAt: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  count: number
  total: number
  totalPages: number
  currentPage: number
  data: T[]
}
