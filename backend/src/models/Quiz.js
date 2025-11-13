const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'],
    required: true
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: {
    type: String,
    required: function() {
      return this.type === 'short-answer' || this.type === 'true-false';
    }
  },
  points: {
    type: Number,
    default: 1,
    min: 1
  },
  explanation: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    required: true
  }
}, { _id: true });

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  module: {
    type: mongoose.Schema.Types.ObjectId
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [questionSchema],
  timeLimit: {
    type: Number, // in minutes
    default: null
  },
  passingScore: {
    type: Number,
    default: 70,
    min: 0,
    max: 100
  },
  attemptsAllowed: {
    type: Number,
    default: 3,
    min: 1
  },
  shuffleQuestions: {
    type: Boolean,
    default: false
  },
  showCorrectAnswers: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  availableFrom: Date,
  availableUntil: Date,
  totalPoints: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
quizSchema.index({ course: 1, module: 1 });
quizSchema.index({ instructor: 1 });

// Calculate total points before saving
quizSchema.pre('save', function(next) {
  if (this.isModified('questions')) {
    this.totalPoints = this.questions.reduce((sum, q) => sum + q.points, 0);
  }
  next();
});

// Virtual for number of questions
quizSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});

// Check if quiz is available
quizSchema.methods.isAvailable = function() {
  const now = new Date();

  if (this.availableFrom && now < this.availableFrom) {
    return false;
  }

  if (this.availableUntil && now > this.availableUntil) {
    return false;
  }

  return this.isPublished;
};

// Get quiz for student (hide correct answers if configured)
quizSchema.methods.getForStudent = function() {
  const quiz = this.toObject();

  // Remove correct answers from questions
  quiz.questions = quiz.questions.map(q => {
    const question = { ...q };

    if (q.type === 'multiple-choice') {
      question.options = q.options.map(opt => ({
        text: opt.text,
        _id: opt._id
      }));
    }

    delete question.correctAnswer;
    delete question.explanation;

    return question;
  });

  // Shuffle questions if enabled
  if (this.shuffleQuestions) {
    quiz.questions = this.shuffleArray(quiz.questions);
  }

  return quiz;
};

// Shuffle array helper
quizSchema.methods.shuffleArray = function(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Grade quiz submission
quizSchema.methods.gradeSubmission = function(answers) {
  let totalScore = 0;
  let earnedPoints = 0;
  const results = [];

  this.questions.forEach(question => {
    const studentAnswer = answers[question._id.toString()];
    let isCorrect = false;
    let pointsEarned = 0;

    if (question.type === 'multiple-choice') {
      const correctOption = question.options.find(opt => opt.isCorrect);
      isCorrect = correctOption && correctOption._id.toString() === studentAnswer;
    } else if (question.type === 'true-false') {
      isCorrect = question.correctAnswer.toLowerCase() === studentAnswer.toLowerCase();
    } else if (question.type === 'short-answer') {
      // Case-insensitive comparison, trim whitespace
      isCorrect = question.correctAnswer.toLowerCase().trim() ===
                  studentAnswer.toLowerCase().trim();
    }
    // Note: essay questions require manual grading

    if (isCorrect) {
      pointsEarned = question.points;
      earnedPoints += pointsEarned;
    }

    results.push({
      questionId: question._id,
      question: question.question,
      studentAnswer,
      isCorrect,
      pointsEarned,
      pointsPossible: question.points,
      correctAnswer: this.showCorrectAnswers ?
        (question.correctAnswer || question.options.find(o => o.isCorrect)?.text) :
        null,
      explanation: this.showCorrectAnswers ? question.explanation : null
    });
  });

  totalScore = (earnedPoints / this.totalPoints) * 100;

  return {
    score: totalScore,
    earnedPoints,
    totalPoints: this.totalPoints,
    passed: totalScore >= this.passingScore,
    results
  };
};

module.exports = mongoose.model('Quiz', quizSchema);
