import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import AIChatbot from '../ai/AIChatbot'
import { useAuthStore } from '@/store/authStore'

const MainLayout = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {isAuthenticated && <AIChatbot />}
    </div>
  )
}

export default MainLayout
