const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Review title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  helpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  helpfulCount: {
    type: Number,
    default: 0
  },
  instructorReply: {
    comment: String,
    repliedAt: Date
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ course: 1, user: 1 }, { unique: true });
reviewSchema.index({ course: 1, rating: -1 });
reviewSchema.index({ createdAt: -1 });

// Update course rating after review is saved
reviewSchema.post('save', async function() {
  const Course = mongoose.model('Course');
  const course = await Course.findById(this.course);
  if (course) {
    await course.updateRating();
  }
});

// Update course rating after review is deleted
reviewSchema.post('remove', async function() {
  const Course = mongoose.model('Course');
  const course = await Course.findById(this.course);
  if (course) {
    await course.updateRating();
  }
});

// Mark review as helpful
reviewSchema.methods.markHelpful = async function(userId) {
  if (!this.helpful.includes(userId)) {
    this.helpful.push(userId);
    this.helpfulCount = this.helpful.length;
    await this.save();
  }
  return this;
};

// Remove helpful mark
reviewSchema.methods.removeHelpful = async function(userId) {
  const index = this.helpful.indexOf(userId);
  if (index > -1) {
    this.helpful.splice(index, 1);
    this.helpfulCount = this.helpful.length;
    await this.save();
  }
  return this;
};

// Add instructor reply
reviewSchema.methods.addReply = async function(reply) {
  this.instructorReply = {
    comment: reply,
    repliedAt: new Date()
  };
  await this.save();
  return this;
};

module.exports = mongoose.model('Review', reviewSchema);
