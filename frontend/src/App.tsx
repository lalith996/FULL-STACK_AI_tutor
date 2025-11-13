import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layouts
import MainLayout from './components/layout/MainLayout'
import AuthLayout from './components/layout/AuthLayout'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/student/DashboardPage'
import CoursesPage from './pages/courses/CoursesPage'
import CourseDetailPage from './pages/courses/CourseDetailPage'
import LearningPage from './pages/courses/LearningPage'
import QuizPage from './pages/quiz/QuizPage'
import QuizResultsPage from './pages/quiz/QuizResultsPage'
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage'
import CreateCoursePage from './pages/teacher/CreateCoursePage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const { user } = useAuthStore()

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:id" element={<CourseDetailPage />} />
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
    </Router>
  )
}

export default App
