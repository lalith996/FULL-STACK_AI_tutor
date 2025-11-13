import { useState, useEffect } from 'react'
import { Brain, Calendar, TrendingUp, CheckCircle, XCircle, RotateCcw, Zap } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface FlashCard {
  id: string
  question: string
  answer: string
  courseId: string
  courseName: string
  difficulty: 'easy' | 'medium' | 'hard'
  lastReviewed?: Date
  nextReview: Date
  interval: number // days until next review
  easeFactor: number // determines how easy/hard the card is
  reviewCount: number
  correctCount: number
}

const SpacedRepetition = () => {
  const [cards, setCards] = useState<FlashCard[]>([])
  const [dueCards, setDueCards] = useState<FlashCard[]>([])
  const [currentCard, setCurrentCard] = useState<FlashCard | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    dueToday: 0,
    mastered: 0,
    learning: 0
  })

  // Load cards from localStorage
  useEffect(() => {
    const savedCards = localStorage.getItem('spaced_repetition_cards')
    if (savedCards) {
      const parsedCards: FlashCard[] = JSON.parse(savedCards).map((card: any) => ({
        ...card,
        lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : undefined,
        nextReview: new Date(card.nextReview)
      }))
      setCards(parsedCards)
      updateDueCards(parsedCards)
      updateStats(parsedCards)
    } else {
      // Initialize with sample cards
      initializeSampleCards()
    }
  }, [])

  // Save cards to localStorage
  useEffect(() => {
    if (cards.length > 0) {
      localStorage.setItem('spaced_repetition_cards', JSON.stringify(cards))
    }
  }, [cards])

  const initializeSampleCards = () => {
    const sampleCards: FlashCard[] = [
      {
        id: '1',
        question: 'What is React?',
        answer: 'React is a JavaScript library for building user interfaces, particularly single-page applications.',
        courseId: 'react-101',
        courseName: 'React Fundamentals',
        difficulty: 'easy',
        nextReview: new Date(),
        interval: 1,
        easeFactor: 2.5,
        reviewCount: 0,
        correctCount: 0
      },
      {
        id: '2',
        question: 'What are React Hooks?',
        answer: 'Hooks are functions that let you use state and other React features without writing a class component.',
        courseId: 'react-101',
        courseName: 'React Fundamentals',
        difficulty: 'medium',
        nextReview: new Date(),
        interval: 1,
        easeFactor: 2.5,
        reviewCount: 0,
        correctCount: 0
      },
      {
        id: '3',
        question: 'Explain the Virtual DOM',
        answer: 'The Virtual DOM is a lightweight copy of the actual DOM. React uses it to optimize rendering by comparing changes and updating only what\'s necessary.',
        courseId: 'react-101',
        courseName: 'React Fundamentals',
        difficulty: 'hard',
        nextReview: new Date(),
        interval: 1,
        easeFactor: 2.5,
        reviewCount: 0,
        correctCount: 0
      }
    ]
    setCards(sampleCards)
    updateDueCards(sampleCards)
    updateStats(sampleCards)
  }

  const updateDueCards = (allCards: FlashCard[]) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const due = allCards.filter(card => {
      const reviewDate = new Date(card.nextReview)
      reviewDate.setHours(0, 0, 0, 0)
      return reviewDate <= today
    })

    setDueCards(due)

    if (due.length > 0 && !currentCard) {
      setCurrentCard(due[0])
    }
  }

  const updateStats = (allCards: FlashCard[]) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dueToday = allCards.filter(card => {
      const reviewDate = new Date(card.nextReview)
      reviewDate.setHours(0, 0, 0, 0)
      return reviewDate <= today
    }).length

    const mastered = allCards.filter(card => card.interval >= 21).length
    const learning = allCards.filter(card => card.interval < 21 && card.reviewCount > 0).length

    setStats({
      total: allCards.length,
      dueToday,
      mastered,
      learning
    })
  }

  // SuperMemo 2 algorithm for spaced repetition
  const calculateNextReview = (card: FlashCard, quality: 'again' | 'hard' | 'good' | 'easy'): FlashCard => {
    let { interval, easeFactor, reviewCount, correctCount } = card

    reviewCount += 1

    // Quality mapping: again=1, hard=2, good=3, easy=4
    const qualityMap = { again: 1, hard: 2, good: 3, easy: 4 }
    const q = qualityMap[quality]

    if (q >= 3) {
      correctCount += 1
    }

    // Update ease factor
    easeFactor = easeFactor + (0.1 - (4 - q) * (0.08 + (4 - q) * 0.02))
    if (easeFactor < 1.3) easeFactor = 1.3

    // Calculate new interval
    if (q < 3) {
      // Reset interval for "again" or "hard"
      interval = 1
    } else {
      if (reviewCount === 1) {
        interval = 1
      } else if (reviewCount === 2) {
        interval = 6
      } else {
        interval = Math.round(interval * easeFactor)
      }
    }

    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + interval)

    return {
      ...card,
      lastReviewed: new Date(),
      nextReview,
      interval,
      easeFactor,
      reviewCount,
      correctCount
    }
  }

  const handleReview = (quality: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return

    const updatedCard = calculateNextReview(currentCard, quality)

    // Update cards array
    const updatedCards = cards.map(c => c.id === updatedCard.id ? updatedCard : c)
    setCards(updatedCards)

    // Update due cards
    const remainingDue = dueCards.filter(c => c.id !== currentCard.id)
    setDueCards(remainingDue)
    updateStats(updatedCards)

    // Move to next card
    if (remainingDue.length > 0) {
      setCurrentCard(remainingDue[0])
    } else {
      setCurrentCard(null)
      toast.success('🎉 All cards reviewed for today!')
    }

    setShowAnswer(false)

    // Show feedback
    const feedbackMessages = {
      again: 'Keep practicing! 💪',
      hard: 'You\'ll get it next time! 📚',
      good: 'Nice work! ✨',
      easy: 'Excellent! You\'ve mastered this! 🌟'
    }
    toast.success(feedbackMessages[quality])
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getRetentionRate = () => {
    if (stats.total === 0) return 0
    const totalReviewed = cards.reduce((sum, card) => sum + card.reviewCount, 0)
    const totalCorrect = cards.reduce((sum, card) => sum + card.correctCount, 0)
    return totalReviewed > 0 ? Math.round((totalCorrect / totalReviewed) * 100) : 0
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Spaced Repetition</h2>
              <p className="text-purple-100 text-sm">Master concepts through science-based review</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-xs text-purple-100">Total Cards</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.dueToday}</div>
            <div className="text-xs text-purple-100">Due Today</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.mastered}</div>
            <div className="text-xs text-purple-100">Mastered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{getRetentionRate()}%</div>
            <div className="text-xs text-purple-100">Retention</div>
          </div>
        </div>
      </div>

      {/* Card Review */}
      <div className="p-6">
        {currentCard ? (
          <div className="space-y-6">
            {/* Progress */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Card {dueCards.findIndex(c => c.id === currentCard.id) + 1} of {dueCards.length}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentCard.difficulty)}`}>
                {currentCard.difficulty}
              </span>
            </div>

            {/* Card */}
            <div className="relative">
              <div
                className={`min-h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200 p-8 cursor-pointer transition-all ${
                  !showAnswer ? 'hover:shadow-lg' : ''
                }`}
                onClick={() => !showAnswer && setShowAnswer(true)}
              >
                {!showAnswer ? (
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-4">Question</div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">{currentCard.question}</h3>
                    <p className="text-gray-500 text-sm">Click to reveal answer</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Question</div>
                      <h3 className="text-xl font-semibold text-gray-900">{currentCard.question}</h3>
                    </div>
                    <div className="border-t border-gray-300 pt-4">
                      <div className="text-sm text-gray-500 mb-2">Answer</div>
                      <p className="text-lg text-gray-700">{currentCard.answer}</p>
                    </div>
                  </div>
                )}

                {/* Course Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                    {currentCard.courseName}
                  </span>
                </div>
              </div>

              {/* Review Stats */}
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>Reviews: {currentCard.reviewCount}</span>
                  <span>Correct: {currentCard.correctCount}</span>
                  <span>Next: {currentCard.interval} days</span>
                </div>
              </div>
            </div>

            {/* Review Buttons */}
            {showAnswer && (
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => handleReview('again')}
                  className="p-4 border-2 border-red-300 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <div className="font-semibold mb-1">Again</div>
                  <div className="text-xs">< 1 day</div>
                </button>
                <button
                  onClick={() => handleReview('hard')}
                  className="p-4 border-2 border-orange-300 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <div className="font-semibold mb-1">Hard</div>
                  <div className="text-xs">{Math.max(1, Math.round(currentCard.interval * 0.5))} days</div>
                </button>
                <button
                  onClick={() => handleReview('good')}
                  className="p-4 border-2 border-green-300 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="font-semibold mb-1">Good</div>
                  <div className="text-xs">{Math.round(currentCard.interval * currentCard.easeFactor)} days</div>
                </button>
                <button
                  onClick={() => handleReview('easy')}
                  className="p-4 border-2 border-blue-300 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="font-semibold mb-1">Easy</div>
                  <div className="text-xs">{Math.round(currentCard.interval * currentCard.easeFactor * 1.3)} days</div>
                </button>
              </div>
            )}

            <div className="text-center text-sm text-gray-500">
              💡 Rate how well you remembered this card
            </div>
          </div>
        ) : stats.dueToday === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All Done! 🎉</h3>
            <p className="text-gray-600 mb-4">No cards due for review today</p>
            <p className="text-sm text-gray-500">Come back tomorrow to continue learning!</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <Zap className="w-16 h-16 mx-auto text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Learn?</h3>
            <p className="text-gray-600 mb-4">You have {stats.dueToday} cards to review</p>
            <button
              onClick={() => setCurrentCard(dueCards[0])}
              className="btn btn-primary"
            >
              Start Reviewing
            </button>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
        <div className="flex items-start space-x-2 text-xs text-gray-600">
          <Brain className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
          <p>
            <strong>How it works:</strong> Spaced repetition uses the SuperMemo-2 algorithm to optimize your learning.
            Cards you find difficult will appear more frequently, while mastered cards appear less often.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SpacedRepetition
