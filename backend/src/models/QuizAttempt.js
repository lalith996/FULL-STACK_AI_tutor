const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  answer: {
    type: mongoose.Schema.Mixed,
    required: true
  },
  isCorrect: Boolean,
  pointsEarned: {
    type: Number,
    default: 0
  }
}, { _id: false });

const quizAttemptSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [answerSchema],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  earnedPoints: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  attemptNumber: {
    type: Number,
    required: true,
    min: 1
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  startedAt: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  isGraded: {
    type: Boolean,
    default: true
  },
  feedback: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes
quizAttemptSchema.index({ quiz: 1, user: 1 });
quizAttemptSchema.index({ user: 1, completedAt: -1 });

// Get attempt number for user and quiz
quizAttemptSchema.statics.getNextAttemptNumber = async function(userId, quizId) {
  const attempts = await this.find({ user: userId, quiz: quizId });
  return attempts.length + 1;
};

// Get best score for user and quiz
quizAttemptSchema.statics.getBestScore = async function(userId, quizId) {
  const attempts = await this.find({ user: userId, quiz: quizId });
  if (attempts.length === 0) return null;

  return Math.max(...attempts.map(a => a.score));
};

// Get average score for quiz
quizAttemptSchema.statics.getAverageScore = async function(quizId) {
  const attempts = await this.find({ quiz: quizId });
  if (attempts.length === 0) return 0;

  const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
  return totalScore / attempts.length;
};

// Get pass rate for quiz
quizAttemptSchema.statics.getPassRate = async function(quizId) {
  const attempts = await this.find({ quiz: quizId });
  if (attempts.length === 0) return 0;

  const passedAttempts = attempts.filter(a => a.passed).length;
  return (passedAttempts / attempts.length) * 100;
};

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
