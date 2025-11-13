import { useState } from 'react'
import { Code, Timer, Brain, Bookmark, Sparkles, Target } from 'lucide-react'
import CodePlayground from '@/components/interactive/CodePlayground'
import StudyTimer from '@/components/interactive/StudyTimer'
import LearningPathRecommender from '@/components/ai/LearningPathRecommender'
import NotesBookmarks from '@/components/interactive/NotesBookmarks'
import SpacedRepetition from '@/components/interactive/SpacedRepetition'

type Tool = 'code' | 'timer' | 'path' | 'notes' | 'repetition' | null

const InteractiveLearningHub = () => {
  const [activeTool, setActiveTool] = useState<Tool>(null)
  const [showTimer, setShowTimer] = useState(false)

  const tools = [
    {
      id: 'code' as Tool,
      title: 'Code Playground',
      description: 'Practice coding with instant feedback',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      features: ['Multiple languages', 'Real-time execution', 'Syntax highlighting']
    },
    {
      id: 'timer' as Tool,
      title: 'Study Timer',
      description: 'Pomodoro technique for focused learning',
      icon: Timer,
      color: 'from-red-500 to-pink-500',
      features: ['Customizable intervals', 'Auto-switching', 'Track sessions']
    },
    {
      id: 'path' as Tool,
      title: 'AI Learning Paths',
      description: 'Get personalized course recommendations',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      features: ['AI-powered', 'Personalized', 'Career-focused']
    },
    {
      id: 'notes' as Tool,
      title: 'Notes & Bookmarks',
      description: 'Save and organize your learning',
      icon: Bookmark,
      color: 'from-green-500 to-teal-500',
      features: ['Smart tagging', 'Search', 'Sync across devices']
    },
    {
      id: 'repetition' as Tool,
      title: 'Spaced Repetition',
      description: 'Master concepts with science-based review',
      icon: Brain,
      color: 'from-orange-500 to-red-500',
      features: ['SuperMemo-2 algorithm', 'Track retention', 'Smart scheduling']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Target className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Interactive Learning Hub
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Supercharge your learning with cutting-edge tools designed to help you learn faster and retain more
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTool === null ? (
          <>
            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {tools.map((tool) => {
                const Icon = tool.icon
                return (
                  <div
                    key={tool.id}
                    onClick={() => tool.id === 'timer' ? setShowTimer(true) : setActiveTool(tool.id)}
                    className="group cursor-pointer bg-white rounded-lg border-2 border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all p-6"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.title}</h3>
                    <p className="text-gray-600 mb-4">{tool.description}</p>
                    <ul className="space-y-2">
                      {tool.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-center text-primary-600 font-medium group-hover:gap-2 transition-all">
                      <span>Try it now</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Why Use Interactive Learning Tools?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🚀</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Learn Faster</h3>
                  <p className="text-sm text-gray-600">
                    Active learning techniques help you grasp concepts 2-3x faster than passive reading
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🧠</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Retain More</h3>
                  <p className="text-sm text-gray-600">
                    Spaced repetition and active recall boost long-term retention by up to 200%
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Stay Focused</h3>
                  <p className="text-sm text-gray-600">
                    Structured study sessions with timers and breaks keep you productive and prevent burnout
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Back Button */}
            <button
              onClick={() => setActiveTool(null)}
              className="mb-6 btn btn-outline"
            >
              ← Back to Hub
            </button>

            {/* Active Tool Content */}
            <div className="mb-6">
              {activeTool === 'code' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Playground</h2>
                  <div className="space-y-6">
                    <CodePlayground language="javascript" />
                    <CodePlayground
                      language="html"
                      initialCode="<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Hello, World!</h1>\n  </body>\n</html>"
                    />
                  </div>
                </div>
              )}
              {activeTool === 'path' && (
                <div>
                  <LearningPathRecommender />
                </div>
              )}
              {activeTool === 'notes' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Notes & Bookmarks</h2>
                  <NotesBookmarks
                    courseId="demo-course"
                    currentLessonId="lesson-1"
                    currentLessonTitle="Introduction to Learning Hub"
                  />
                </div>
              )}
              {activeTool === 'repetition' && (
                <div>
                  <SpacedRepetition />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Floating Study Timer */}
      {showTimer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <StudyTimer onClose={() => setShowTimer(false)} />
        </div>
      )}
    </div>
  )
}

export default InteractiveLearningHub
