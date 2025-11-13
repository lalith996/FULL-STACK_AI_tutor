const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const enrollmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  profile: {
    avatar: {
      type: String,
      default: 'default-avatar.png'
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    level: {
      type: Number,
      default: 1,
      min: 1
    },
    points: {
      type: Number,
      default: 0,
      min: 0
    },
    badges: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge'
    }],
    streak: {
      current: {
        type: Number,
        default: 0
      },
      longest: {
        type: Number,
        default: 0
      },
      lastActivity: Date
    },
    preferences: {
      learningStyle: {
        type: String,
        enum: ['visual', 'auditory', 'kinesthetic', 'reading'],
        default: 'visual'
      },
      notifications: {
        email: {
          type: Boolean,
          default: true
        },
        push: {
          type: Boolean,
          default: true
        }
      },
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'light'
      }
    }
  },
  enrolledCourses: [enrollmentSchema],
  createdCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'profile.points': -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Update streak
userSchema.methods.updateStreak = async function() {
  const now = new Date();
  const lastActivity = this.profile.streak.lastActivity;

  if (!lastActivity) {
    // First activity
    this.profile.streak.current = 1;
    this.profile.streak.longest = 1;
  } else {
    const daysSinceLastActivity = Math.floor(
      (now - lastActivity) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastActivity === 0) {
      // Same day, no change
      return this;
    } else if (daysSinceLastActivity === 1) {
      // Consecutive day
      this.profile.streak.current += 1;
      if (this.profile.streak.current > this.profile.streak.longest) {
        this.profile.streak.longest = this.profile.streak.current;
      }
    } else {
      // Streak broken
      this.profile.streak.current = 1;
    }
  }

  this.profile.streak.lastActivity = now;
  await this.save();

  // Check for streak badges
  const Badge = mongoose.model('Badge');
  await Badge.checkAndAwardBadge(this._id, 'streak-days', this.profile.streak.current);

  return this;
};

// Add points
userSchema.methods.addPoints = async function(points) {
  this.profile.points += points;

  // Level up calculation (100 points per level)
  const newLevel = Math.floor(this.profile.points / 100) + 1;
  if (newLevel > this.profile.level) {
    this.profile.level = newLevel;
  }

  await this.save();

  // Check for point-based badges
  const Badge = mongoose.model('Badge');
  await Badge.checkAndAwardBadge(this._id, 'points', this.profile.points);

  return this;
};

// Award badge
userSchema.methods.awardBadge = async function(badgeId) {
  if (!this.profile.badges.includes(badgeId)) {
    this.profile.badges.push(badgeId);
    await this.save();
  }
  return this;
};

// Enroll in course
userSchema.methods.enrollInCourse = async function(courseId) {
  const existingEnrollment = this.enrolledCourses.find(
    e => e.course.toString() === courseId.toString()
  );

  if (!existingEnrollment) {
    this.enrolledCourses.push({ course: courseId });
    await this.save();

    // Award first course badge if this is the first enrollment
    if (this.enrolledCourses.length === 1) {
      const Badge = mongoose.model('Badge');
      await Badge.checkAndAwardBadge(this._id, 'first-course', 1);
    }
  }

  return this;
};

// Update course progress
userSchema.methods.updateCourseProgress = async function(courseId, progress) {
  const enrollment = this.enrolledCourses.find(
    e => e.course.toString() === courseId.toString()
  );

  if (enrollment) {
    enrollment.progress = progress;
    enrollment.lastAccessedAt = new Date();

    if (progress >= 100 && !enrollment.completed) {
      enrollment.completed = true;
      enrollment.completedAt = new Date();

      // Award points for course completion
      await this.addPoints(50);

      // Check for course completion badges
      const Badge = mongoose.model('Badge');
      const completedCount = this.enrolledCourses.filter(e => e.completed).length;
      await Badge.checkAndAwardBadge(this._id, 'courses-completed', completedCount);
    }

    await this.save();
  }

  return this;
};

// Get enrolled courses with details
userSchema.methods.getEnrolledCoursesWithDetails = async function() {
  await this.populate({
    path: 'enrolledCourses.course',
    select: 'title thumbnail instructor category level rating totalDuration'
  });

  return this.enrolledCourses;
};

module.exports = mongoose.model('User', userSchema);
