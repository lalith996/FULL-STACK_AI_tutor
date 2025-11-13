import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layouts (not lazy loaded for better initial render)
import MainLayout from './components/layout/MainLayout'
import AuthLayout from './components/layout/AuthLayout'

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
)

// Lazy loaded pages for code splitting and better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))
const DashboardPage = lazy(() => import('./pages/student/DashboardPage'))
const CoursesPage = lazy(() => import('./pages/courses/CoursesPage'))
const CourseDetailPage = lazy(() => import('./pages/courses/CourseDetailPage'))
const LearningPage = lazy(() => import('./pages/courses/LearningPage'))
const QuizPage = lazy(() => import('./pages/quiz/QuizPage'))
const QuizResultsPage = lazy(() => import('./pages/quiz/QuizResultsPage'))
const TeacherDashboardPage = lazy(() => import('./pages/teacher/TeacherDashboardPage'))
const CreateCoursePage = lazy(() => import('./pages/teacher/CreateCoursePage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const InteractiveLearningHub = lazy(() => import('./pages/InteractiveLearningHub'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  const { user } = useAuthStore()

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:id" element={<CourseDetailPage />} />
            <Route path="learning-hub" element={<InteractiveLearningHub />} />
          </Route>

          {/* Auth routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
          </Route>

          {/* Protected routes */}
          <Route path="/" element={<MainLayout />}>
            <Route
              path="dashboard"
              element={
                user ? (
                  user.role === 'teacher' ? <TeacherDashboardPage /> : <DashboardPage />
                ) : (
                  <Navigate to="/auth/login" />
                )
              }
            />
            <Route
              path="learn/:courseId"
              element={user ? <LearningPage /> : <Navigate to="/auth/login" />}
            />
            <Route
              path="profile"
              element={user ? <ProfilePage /> : <Navigate to="/auth/login" />}
            />
            <Route
              path="quiz/:id"
              element={user ? <QuizPage /> : <Navigate to="/auth/login" />}
            />
            <Route
              path="quiz/:id/results"
              element={user ? <QuizResultsPage /> : <Navigate to="/auth/login" />}
            />

            {/* Teacher routes */}
            <Route
              path="teacher/create-course"
              element={
                user?.role === 'teacher' ? <CreateCoursePage /> : <Navigate to="/dashboard" />
              }
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
