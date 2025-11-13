import { useState } from 'react'
import { ThumbsUp, ThumbsDown, MessageCircle, Flag, Edit2, Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { Review } from '@/types'
import StarRating from './StarRating'
import { useAuthStore } from '@/store/authStore'

interface ReviewListProps {
  reviews: Review[]
  courseId: string
  onEditReview?: (review: Review) => void
}

const ReviewList = ({ reviews, courseId, onEditReview }: ReviewListProps) => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  // Sort reviews by date (newest first)
  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const voteReviewMutation = useMutation({
    mutationFn: async ({ reviewId, helpful }: { reviewId: string; helpful: boolean }) => {
      // API call would go here
      return { reviewId, helpful }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] })
    }
  })

  const submitReplyMutation = useMutation({
    mutationFn: async ({ reviewId, reply }: { reviewId: string; reply: string }) => {
      // API call would go here
      return { reviewId, reply }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', courseId] })
      setShowReplyForm(null)
      setReplyText('')
      toast.success('Reply posted!')
    }
  })

  const handleVote = (reviewId: string, helpful: boolean) => {
    voteReviewMutation.mutate({ reviewId, helpful })
  }

  const handleReply = (reviewId: string) => {
    if (replyText.trim().length < 5) {
      toast.error('Reply must be at least 5 characters')
      return
    }
    submitReplyMutation.mutate({ reviewId, reply: replyText })
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600 text-lg mb-2">No reviews yet</p>
        <p className="text-sm text-gray-500">Be the first to review this course!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sortedReviews.map((review) => {
        const isOwnReview = user?._id === review.userId
        const isInstructor = user?.role === 'teacher'

        return (
          <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-lg flex-shrink-0">
                  {review.userName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{review.userName || 'Anonymous'}</h4>
                    {isOwnReview && (
                      <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 mt-1">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {isOwnReview && onEditReview && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditReview(review)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit review"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Review Content */}
            <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

            {/* Instructor Reply */}
            {review.instructorReply && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">Instructor Response</span>
                </div>
                <p className="text-sm text-gray-700">{review.instructorReply}</p>
              </div>
            )}

            {/* Reply Form (for instructors) */}
            {isInstructor && !review.instructorReply && showReplyForm === review._id && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your response..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
                <div className="flex items-center justify-end space-x-2 mt-2">
                  <button
                    onClick={() => {
                      setShowReplyForm(null)
                      setReplyText('')
                    }}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReply(review._id)}
                    disabled={submitReplyMutation.isPending}
                    className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {submitReplyMutation.isPending ? 'Posting...' : 'Post Reply'}
                  </button>
                </div>
              </div>
            )}

            {/* Review Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                {/* Helpful votes */}
                <button
                  onClick={() => handleVote(review._id, true)}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful ({review.helpfulCount || 0})</span>
                </button>

                {/* Not helpful votes */}
                <button
                  onClick={() => handleVote(review._id, false)}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>

                {/* Instructor reply button */}
                {isInstructor && !review.instructorReply && (
                  <button
                    onClick={() => setShowReplyForm(showReplyForm === review._id ? null : review._id)}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                )}
              </div>

              {/* Report button */}
              {!isOwnReview && (
                <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition-colors">
                  <Flag className="w-4 h-4" />
                  <span>Report</span>
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ReviewList
