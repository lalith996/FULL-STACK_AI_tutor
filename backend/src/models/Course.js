const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['video', 'text', 'quiz', 'assignment'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  resources: [{
    name: String,
    url: String,
    type: String
  }],
  order: {
    type: Number,
    required: true
  }
}, { _id: true });

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Module title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  lessons: [lessonSchema],
  order: {
    type: Number,
    required: true
  }
}, { _id: true });

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thumbnail: {
    type: String,
    default: 'default-course.png'
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: [
      'Programming',
      'Data Science',
      'Business',
      'Design',
      'Marketing',
      'Languages',
      'Mathematics',
      'Science',
      'Arts',
      'Personal Development',
      'Other'
    ]
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  price: {
    type: Number,
    default: 0
  },
  modules: [moduleSchema],
  tags: [String],
  language: {
    type: String,
    default: 'English'
  },
  prerequisites: [String],
  learningObjectives: [String],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  totalDuration: {
    type: Number, // in minutes
    default: 0
  },
  studentsEnrolled: {
    type: Number,
    default: 0
  },
  certificateAvailable: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ 'rating.average': -1 });
courseSchema.index({ studentsEnrolled: -1 });
courseSchema.index({ instructor: 1 });

// Virtual for total lessons
courseSchema.virtual('totalLessons').get(function() {
  return this.modules.reduce((total, module) => total + module.lessons.length, 0);
});

// Calculate total duration before saving
courseSchema.pre('save', function(next) {
  if (this.isModified('modules')) {
    let totalDuration = 0;
    this.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        totalDuration += lesson.duration || 0;
      });
    });
    this.totalDuration = totalDuration;
  }
  next();
});

// Update students enrolled count
courseSchema.methods.updateEnrollmentCount = async function() {
  this.studentsEnrolled = this.enrolledStudents.length;
  await this.save();
};

// Add student to course
courseSchema.methods.enrollStudent = async function(studentId) {
  if (!this.enrolledStudents.includes(studentId)) {
    this.enrolledStudents.push(studentId);
    this.studentsEnrolled += 1;
    await this.save();
  }
  return this;
};

// Remove student from course
courseSchema.methods.unenrollStudent = async function(studentId) {
  const index = this.enrolledStudents.indexOf(studentId);
  if (index > -1) {
    this.enrolledStudents.splice(index, 1);
    this.studentsEnrolled -= 1;
    await this.save();
  }
  return this;
};

// Update rating
courseSchema.methods.updateRating = async function() {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ course: this._id });

  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = totalRating / reviews.length;
    this.rating.count = reviews.length;
  } else {
    this.rating.average = 0;
    this.rating.count = 0;
  }

  await this.save();
  return this;
};

// Publish course
courseSchema.methods.publish = async function() {
  this.isPublished = true;
  this.publishedAt = new Date();
  await this.save();
  return this;
};

// Unpublish course
courseSchema.methods.unpublish = async function() {
  this.isPublished = false;
  await this.save();
  return this;
};

// Get course completion rate
courseSchema.methods.getCompletionRate = async function() {
  const User = mongoose.model('User');
  const enrolledUsers = await User.find({
    'enrolledCourses.course': this._id
  });

  if (enrolledUsers.length === 0) return 0;

  const completedCount = enrolledUsers.filter(user => {
    const enrollment = user.enrolledCourses.find(
      e => e.course.toString() === this._id.toString()
    );
    return enrollment && enrollment.completed;
  }).length;

  return (completedCount / enrolledUsers.length) * 100;
};

// Add module to course
courseSchema.methods.addModule = async function(moduleData) {
  const maxOrder = this.modules.length > 0
    ? Math.max(...this.modules.map(m => m.order))
    : 0;

  moduleData.order = maxOrder + 1;
  this.modules.push(moduleData);
  await this.save();
  return this.modules[this.modules.length - 1];
};

// Add lesson to module
courseSchema.methods.addLesson = async function(moduleId, lessonData) {
  const module = this.modules.id(moduleId);
  if (!module) {
    throw new Error('Module not found');
  }

  const maxOrder = module.lessons.length > 0
    ? Math.max(...module.lessons.map(l => l.order))
    : 0;

  lessonData.order = maxOrder + 1;
  module.lessons.push(lessonData);
  await this.save();
  return module.lessons[module.lessons.length - 1];
};

module.exports = mongoose.model('Course', courseSchema);
