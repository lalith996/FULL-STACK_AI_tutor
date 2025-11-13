import { useState } from 'react'
import { Sparkles, Target, TrendingUp, Award, ArrowRight, Lightbulb, CheckCircle2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'

interface LearningPath {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  courses: {
    id: string
    title: string
    order: number
    completed?: boolean
  }[]
  skills: string[]
  careerOutcomes: string[]
}

const LearningPathRecommender = () => {
  const [step, setStep] = useState<'goals' | 'results'>('goals')
  const [selectedGoal, setSelectedGoal] = useState<string>('')
  const [customGoal, setCustomGoal] = useState('')
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [timeCommitment, setTimeCommitment] = useState<'partTime' | 'fullTime'>('partTime')
  const [recommendedPaths, setRecommendedPaths] = useState<LearningPath[]>([])

  const predefinedGoals = [
    { id: 'web-dev', label: 'Become a Web Developer', icon: '💻' },
    { id: 'data-science', label: 'Master Data Science', icon: '📊' },
    { id: 'mobile-dev', label: 'Build Mobile Apps', icon: '📱' },
    { id: 'ai-ml', label: 'Learn AI & Machine Learning', icon: '🤖' },
    { id: 'devops', label: 'Become a DevOps Engineer', icon: '⚙️' },
    { id: 'ui-ux', label: 'Master UI/UX Design', icon: '🎨' },
  ]

  const generateRecommendationsMutation = useMutation({
    mutationFn: async () => {
      // Simulate AI recommendation generation
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock data - in real app, this would come from AI backend
      const mockPaths: LearningPath[] = [
        {
          id: '1',
          title: 'Full-Stack Web Development Mastery',
          description: 'A comprehensive path from HTML basics to deploying production-ready applications',
          difficulty: experience,
          duration: timeCommitment === 'fullTime' ? '3-4 months' : '6-8 months',
          courses: [
            { id: 'c1', title: 'HTML & CSS Fundamentals', order: 1, completed: false },
            { id: 'c2', title: 'JavaScript Deep Dive', order: 2, completed: false },
            { id: 'c3', title: 'React.js Complete Course', order: 3, completed: false },
            { id: 'c4', title: 'Node.js & Express Backend', order: 4, completed: false },
            { id: 'c5', title: 'MongoDB Database Mastery', order: 5, completed: false },
            { id: 'c6', title: 'Full-Stack Project Workshop', order: 6, completed: false },
          ],
          skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'RESTful APIs', 'Git'],
          careerOutcomes: [
            'Junior Full-Stack Developer',
            'Frontend Developer',
            'Backend Developer',
            'MERN Stack Developer'
          ]
        },
        {
          id: '2',
          title: 'Frontend Specialization Track',
          description: 'Focus on modern frontend development with React and advanced UI/UX',
          difficulty: experience,
          duration: timeCommitment === 'fullTime' ? '2-3 months' : '4-5 months',
          courses: [
            { id: 'c7', title: 'Modern CSS & Tailwind', order: 1, completed: false },
            { id: 'c8', title: 'Advanced JavaScript', order: 2, completed: false },
            { id: 'c9', title: 'React + TypeScript', order: 3, completed: false },
            { id: 'c10', title: 'State Management (Redux/Zustand)', order: 4, completed: false },
            { id: 'c11', title: 'Frontend Testing', order: 5, completed: false },
          ],
          skills: ['Advanced CSS', 'TypeScript', 'React Hooks', 'State Management', 'Testing'],
          careerOutcomes: [
            'Senior Frontend Developer',
            'React Specialist',
            'UI Engineer'
          ]
        },
        {
          id: '3',
          title: 'Backend & API Development Path',
          description: 'Master server-side development, databases, and API design',
          difficulty: experience,
          duration: timeCommitment === 'fullTime' ? '2-3 months' : '4-6 months',
          courses: [
            { id: 'c12', title: 'Node.js Advanced Patterns', order: 1, completed: false },
            { id: 'c13', title: 'RESTful API Design', order: 2, completed: false },
            { id: 'c14', title: 'Database Design & SQL', order: 3, completed: false },
            { id: 'c15', title: 'Authentication & Security', order: 4, completed: false },
            { id: 'c16', title: 'Microservices Architecture', order: 5, completed: false },
          ],
          skills: ['Node.js', 'API Design', 'SQL & NoSQL', 'Authentication', 'Microservices'],
          careerOutcomes: [
            'Backend Developer',
            'API Developer',
            'Node.js Specialist'
          ]
        }
      ]

      return mockPaths
    },
    onSuccess: (data) => {
      setRecommendedPaths(data)
      setStep('results')
      toast.success('✨ Learning paths generated!')
    },
    onError: () => {
      toast.error('Failed to generate recommendations')
    }
  })

  const handleGenerateRecommendations = () => {
    if (!selectedGoal && !customGoal) {
      toast.error('Please select or enter your learning goal')
      return
    }
    generateRecommendationsMutation.mutate()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {step === 'goals' ? (
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              AI-Powered Learning Path Generator
            </h2>
            <p className="text-gray-600">
              Answer a few questions and let AI create a personalized learning roadmap for you
            </p>
          </div>

          <div className="space-y-6">
            {/* Career Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What's your learning goal?
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {predefinedGoals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => {
                      setSelectedGoal(goal.id)
                      setCustomGoal('')
                    }}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedGoal === goal.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{goal.icon}</span>
                      <span className="font-medium text-gray-900">{goal.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-3">
                <input
                  type="text"
                  value={customGoal}
                  onChange={(e) => {
                    setCustomGoal(e.target.value)
                    setSelectedGoal('')
                  }}
                  placeholder="Or enter your custom goal..."
                  className="input"
                />
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What's your current experience level?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setExperience(level)}
                    className={`p-4 border-2 rounded-lg capitalize transition-all ${
                      experience === level
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{level}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {level === 'beginner' && 'New to this field'}
                      {level === 'intermediate' && 'Some experience'}
                      {level === 'advanced' && 'Significant experience'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Commitment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How much time can you commit?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTimeCommitment('partTime')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    timeCommitment === 'partTime'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">Part-Time</div>
                  <div className="text-xs text-gray-600 mt-1">5-10 hours/week</div>
                </button>
                <button
                  onClick={() => setTimeCommitment('fullTime')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    timeCommitment === 'fullTime'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">Full-Time</div>
                  <div className="text-xs text-gray-600 mt-1">20+ hours/week</div>
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateRecommendations}
              disabled={generateRecommendationsMutation.isPending}
              className="w-full btn btn-primary flex items-center justify-center space-x-2"
            >
              {generateRecommendationsMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Your Path...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate My Learning Path</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your Personalized Learning Paths
            </h2>
            <p className="text-gray-600">
              We've curated {recommendedPaths.length} paths tailored to your goals
            </p>
          </div>

          {/* Learning Paths */}
          <div className="space-y-6">
            {recommendedPaths.map((path, index) => (
              <div
                key={path.id}
                className="border-2 border-gray-200 rounded-lg p-6 hover:border-primary-300 transition-colors"
              >
                {/* Path Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                        Recommended #{index + 1}
                      </span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getDifficultyColor(path.difficulty)}`}>
                        {path.difficulty}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{path.title}</h3>
                    <p className="text-gray-600 text-sm">{path.description}</p>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{path.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>{path.courses.length} courses</span>
                  </div>
                </div>

                {/* Courses */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Course Sequence:</h4>
                  <div className="space-y-2">
                    {path.courses.map((course) => (
                      <div key={course.id} className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {course.order}
                        </div>
                        <div className="flex-1 text-sm text-gray-700">{course.title}</div>
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Skills You'll Learn:</h4>
                  <div className="flex flex-wrap gap-2">
                    {path.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Career Outcomes */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Career Outcomes:</h4>
                  <div className="space-y-1">
                    {path.careerOutcomes.map((outcome, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full btn btn-primary mt-4">
                  Start This Learning Path
                </button>
              </div>
            ))}
          </div>

          {/* Back Button */}
          <button
            onClick={() => setStep('goals')}
            className="w-full mt-6 btn btn-outline"
          >
            Try Different Goals
          </button>
        </div>
      )}
    </div>
  )
}

export default LearningPathRecommender
