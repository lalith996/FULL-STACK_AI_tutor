const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedLessons: [{
    moduleId: mongoose.Schema.Types.ObjectId,
    lessonId: mongoose.Schema.Types.ObjectId,
    completedAt: {
      type: Date,
      default: Date.now
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0
    }
  }],
  quizScores: [{
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    score: Number,
    passed: Boolean,
    completedAt: Date
  }],
  assignmentSubmissions: [{
    assignment: mongoose.Schema.Types.ObjectId,
    submittedAt: Date,
    grade: Number,
    feedback: String
  }],
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalTimeSpent: {
    type: Number, // in minutes
    default: 0
  },
  lastAccessedLesson: {
    moduleId: mongoose.Schema.Types.ObjectId,
    lessonId: mongoose.Schema.Types.ObjectId,
    accessedAt: Date
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateIssuedAt: Date,
  certificateId: String
}, {
  timestamps: true
});

// Indexes
progressSchema.index({ user: 1, course: 1 }, { unique: true });
progressSchema.index({ user: 1 });
progressSchema.index({ course: 1 });

// Mark lesson as complete
progressSchema.methods.completeLesson = async function(moduleId, lessonId, timeSpent = 0) {
  const existingProgress = this.completedLessons.find(
    cl => cl.moduleId.toString() === moduleId.toString() &&
          cl.lessonId.toString() === lessonId.toString()
  );

  if (!existingProgress) {
    this.completedLessons.push({
      moduleId,
      lessonId,
      timeSpent
    });

    this.totalTimeSpent += Math.floor(timeSpent / 60);
    await this.calculateProgress();
    await this.save();

    // Update user's course progress
    const User = mongoose.model('User');
    const user = await User.findById(this.user);
    if (user) {
      await user.updateCourseProgress(this.course, this.overallProgress);
      await user.updateStreak();
      await user.addPoints(5); // Award points for lesson completion
    }
  }

  return this;
};

// Calculate overall progress
progressSchema.methods.calculateProgress = async function() {
  const Course = mongoose.model('Course');
  const course = await Course.findById(this.course);

  if (!course) return this;

  let totalLessons = 0;
  course.modules.forEach(module => {
    totalLessons += module.lessons.length;
  });

  if (totalLessons === 0) {
    this.overallProgress = 0;
  } else {
    this.overallProgress = Math.round(
      (this.completedLessons.length / totalLessons) * 100
    );
  }

  // Issue certificate if course is complete
  if (this.overallProgress === 100 && !this.certificateIssued) {
    await this.issueCertificate();
  }

  return this;
};

// Record quiz score
progressSchema.methods.recordQuizScore = async function(quizId, score, passed) {
  this.quizScores.push({
    quiz: quizId,
    score,
    passed,
    completedAt: new Date()
  });

  await this.save();

  // Award points for quiz completion
  if (passed) {
    const User = mongoose.model('User');
    const user = await User.findById(this.user);
    if (user) {
      const points = score === 100 ? 20 : 10; // Bonus for perfect score
      await user.addPoints(points);

      // Check for perfect quiz badge
      if (score === 100) {
        const Badge = mongoose.model('Badge');
        await Badge.checkAndAwardBadge(user._id, 'perfect-quiz', 1);
      }
    }
  }

  return this;
};

// Update last accessed lesson
progressSchema.methods.updateLastAccessed = async function(moduleId, lessonId) {
  this.lastAccessedLesson = {
    moduleId,
    lessonId,
    accessedAt: new Date()
  };
  await this.save();
  return this;
};

// Issue certificate
progressSchema.methods.issueCertificate = async function() {
  if (this.overallProgress === 100 && !this.certificateIssued) {
    this.certificateIssued = true;
    this.certificateIssuedAt = new Date();
    this.certificateId = `CERT-${this.user}-${this.course}-${Date.now()}`;
    await this.save();
  }
  return this;
};

// Get course statistics
progressSchema.methods.getStatistics = async function() {
  const Course = mongoose.model('Course');
  const course = await Course.findById(this.course);

  if (!course) return null;

  let totalLessons = 0;
  course.modules.forEach(module => {
    totalLessons += module.lessons.length;
  });

  const completedQuizzes = this.quizScores.length;
  const passedQuizzes = this.quizScores.filter(qs => qs.passed).length;
  const averageQuizScore = this.quizScores.length > 0
    ? this.quizScores.reduce((sum, qs) => sum + qs.score, 0) / this.quizScores.length
    : 0;

  return {
    totalLessons,
    completedLessons: this.completedLessons.length,
    progress: this.overallProgress,
    totalTimeSpent: this.totalTimeSpent,
    completedQuizzes,
    passedQuizzes,
    averageQuizScore: Math.round(averageQuizScore),
    certificateIssued: this.certificateIssued
  };
};

module.exports = mongoose.model('Progress', progressSchema);
