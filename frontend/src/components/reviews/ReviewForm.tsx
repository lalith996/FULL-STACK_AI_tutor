import { useState } from 'react'
import { Star, Send, X } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { courseService } from '@/services/courseService'
import StarRating from './StarRating'

interface ReviewFormProps {
  courseId: string
  onClose: () => void
  existingReview?: {
    rating: number
    comment: string
  }
}

const ReviewForm = ({ courseId, onClose, existingReview }: ReviewFormProps) => {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [comment, setComment] = useState(existingReview?.comment || '')
  const queryClient = useQueryClient()

  const submitReviewMutation = useMutation({
    mutationFn: () => courseService.rateAndReview(courseId, { rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] })
      toast.success(existingReview ? 'Review updated!' : 'Review submitted!')
      onClose()
    },
    onError: () => {
      toast.error('Failed to submit review')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (comment.trim().length < 10) {
      toast.error('Review must be at least 10 characters')
      return
    }

    submitReviewMutation.mutate()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {existingReview ? 'Edit Your Review' : 'Write a Review'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating *
            </label>
            <div className="flex items-center space-x-2">
              <StarRating
                rating={rating}
                interactive
                onRate={setRating}
                size="lg"
              />
              {rating > 0 && (
                <span className="text-sm text-gray-600 ml-2">
                  {rating} {rating === 1 ? 'star' : 'stars'}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              id="comment"
              rows={6}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your learning experience with this course. What did you like? What could be improved?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              {comment.length} characters (minimum 10)
            </p>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Tips for a great review:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be specific about what you learned</li>
              <li>• Mention the instructor's teaching style</li>
              <li>• Discuss course structure and content quality</li>
              <li>• Share how the course helped your goals</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitReviewMutation.isPending}
              className="btn btn-primary flex items-center space-x-2"
            >
              {submitReviewMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>{existingReview ? 'Update Review' : 'Submit Review'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewForm
