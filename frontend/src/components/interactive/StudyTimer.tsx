import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Settings, X, Coffee, Brain, CheckCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

type TimerMode = 'focus' | 'shortBreak' | 'longBreak'

interface StudyTimerProps {
  onClose?: () => void
}

const StudyTimer = ({ onClose }: StudyTimerProps) => {
  const [mode, setMode] = useState<TimerMode>('focus')
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [showSettings, setShowSettings] = useState(false)
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Default durations (in minutes)
  const [durations, setDurations] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15
  })

  // Auto-switch settings
  const [autoStartBreaks, setAutoStartBreaks] = useState(false)
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(false)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)

    // Play notification sound (you'd add actual audio here)
    playNotificationSound()

    if (mode === 'focus') {
      setPomodorosCompleted(prev => prev + 1)
      const newCount = pomodorosCompleted + 1

      // After 4 pomodoros, take a long break
      if (newCount % 4 === 0) {
        toast.success('🎉 Great work! Time for a long break!')
        switchMode('longBreak', autoStartBreaks)
      } else {
        toast.success('✅ Pomodoro complete! Time for a short break.')
        switchMode('shortBreak', autoStartBreaks)
      }
    } else {
      toast.success('Break over! Ready to focus again?')
      switchMode('focus', autoStartPomodoros)
    }

    // Show browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: mode === 'focus' ? 'Focus session complete!' : 'Break time over!',
        icon: '/favicon.ico'
      })
    }
  }

  const playNotificationSound = () => {
    // In a real app, you'd play an actual audio file
    // const audio = new Audio('/notification.mp3')
    // audio.play()
  }

  const switchMode = (newMode: TimerMode, autoStart: boolean = false) => {
    setMode(newMode)
    setTimeLeft(durations[newMode] * 60)
    setIsRunning(autoStart)
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(durations[mode] * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    const total = durations[mode] * 60
    return ((total - timeLeft) / total) * 100
  }

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  useEffect(() => {
    requestNotificationPermission()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
      {/* Header */}
      <div className={`px-6 py-4 flex items-center justify-between border-b ${
        mode === 'focus' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
        mode === 'shortBreak' ? 'bg-gradient-to-r from-green-500 to-teal-500' :
        'bg-gradient-to-r from-blue-500 to-purple-500'
      } text-white rounded-t-lg`}>
        <div className="flex items-center space-x-2">
          {mode === 'focus' ? <Brain className="w-5 h-5" /> :
           mode === 'shortBreak' ? <Coffee className="w-5 h-5" /> :
           <CheckCircle className="w-5 h-5" />}
          <h3 className="font-semibold">
            {mode === 'focus' ? 'Focus Time' :
             mode === 'shortBreak' ? 'Short Break' :
             'Long Break'}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-6 bg-gray-50 border-b space-y-4">
          <h4 className="font-semibold text-gray-900 mb-3">Timer Settings</h4>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Focus</label>
              <input
                type="number"
                value={durations.focus}
                onChange={(e) => setDurations({ ...durations, focus: parseInt(e.target.value) || 25 })}
                className="input text-sm py-1"
                min="1"
                max="60"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Short Break</label>
              <input
                type="number"
                value={durations.shortBreak}
                onChange={(e) => setDurations({ ...durations, shortBreak: parseInt(e.target.value) || 5 })}
                className="input text-sm py-1"
                min="1"
                max="30"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Long Break</label>
              <input
                type="number"
                value={durations.longBreak}
                onChange={(e) => setDurations({ ...durations, longBreak: parseInt(e.target.value) || 15 })}
                className="input text-sm py-1"
                min="1"
                max="60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={autoStartBreaks}
                onChange={(e) => setAutoStartBreaks(e.target.checked)}
                className="rounded text-primary-600"
              />
              <span>Auto-start breaks</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={autoStartPomodoros}
                onChange={(e) => setAutoStartPomodoros(e.target.checked)}
                className="rounded text-primary-600"
              />
              <span>Auto-start pomodoros</span>
            </label>
          </div>
        </div>
      )}

      {/* Mode Selector */}
      <div className="p-6 pb-0">
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => switchMode('focus')}
            disabled={isRunning}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'focus'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Focus
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            disabled={isRunning}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'shortBreak'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Short Break
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            disabled={isRunning}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'longBreak'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Long Break
          </button>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            {/* Progress Circle */}
            <svg className="w-64 h-64 transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - getProgress() / 100)}`}
                className={`transition-all duration-1000 ${
                  mode === 'focus' ? 'text-red-500' :
                  mode === 'shortBreak' ? 'text-green-500' :
                  'text-blue-500'
                }`}
                strokeLinecap="round"
              />
            </svg>

            {/* Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl font-bold text-gray-900 font-mono">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {pomodorosCompleted} {pomodorosCompleted === 1 ? 'pomodoro' : 'pomodoros'} completed
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 pb-6">
          <button
            onClick={toggleTimer}
            className={`p-4 rounded-full shadow-lg transition-all ${
              isRunning
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-primary-600 hover:bg-primary-700'
            } text-white`}
          >
            {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </button>
          <button
            onClick={resetTimer}
            className="p-4 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
        <p className="text-xs text-gray-600 text-center">
          💡 <strong>Tip:</strong> {
            mode === 'focus'
              ? 'Stay focused! Eliminate distractions and work on one task.'
              : 'Take a real break! Step away from your screen.'
          }
        </p>
      </div>
    </div>
  )
}

export default StudyTimer
