const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Badge name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Badge description is required']
  },
  icon: {
    type: String,
    default: 'default-badge.png'
  },
  category: {
    type: String,
    enum: [
      'achievement',
      'streak',
      'course-completion',
      'quiz-mastery',
      'social',
      'special'
    ],
    required: true
  },
  criteria: {
    type: {
      type: String,
      enum: [
        'points',
        'courses-completed',
        'streak-days',
        'perfect-quiz',
        'first-course',
        'helping-others',
        'custom'
      ],
      required: true
    },
    value: {
      type: Number,
      default: 0
    }
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  points: {
    type: Number,
    default: 0
  },
  earnedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
badgeSchema.index({ category: 1, rarity: 1 });
badgeSchema.index({ 'criteria.type': 1 });

// Static method to check if user earned badge
badgeSchema.statics.checkAndAwardBadge = async function(userId, criteriaType, value) {
  const badges = await this.find({
    'criteria.type': criteriaType,
    isActive: true
  });

  const User = mongoose.model('User');
  const user = await User.findById(userId);

  if (!user) return [];

  const earnedBadges = [];

  for (const badge of badges) {
    // Check if user already has this badge
    if (user.profile.badges.includes(badge._id)) {
      continue;
    }

    // Check if criteria is met
    let criteriaMet = false;

    switch (criteriaType) {
      case 'points':
        criteriaMet = user.profile.points >= badge.criteria.value;
        break;
      case 'streak-days':
        criteriaMet = user.profile.streak.current >= badge.criteria.value;
        break;
      case 'courses-completed':
        const completedCourses = user.enrolledCourses.filter(e => e.completed).length;
        criteriaMet = completedCourses >= badge.criteria.value;
        break;
      default:
        criteriaMet = value >= badge.criteria.value;
    }

    if (criteriaMet) {
      await user.awardBadge(badge._id);
      badge.earnedBy.push({ user: userId });
      await badge.save();
      earnedBadges.push(badge);

      // Award bonus points
      if (badge.points > 0) {
        await user.addPoints(badge.points);
      }
    }
  }

  return earnedBadges;
};

// Get badge earn rate
badgeSchema.methods.getEarnRate = function() {
  return this.earnedBy.length;
};

// Check if badge is rare (less than 10% of users have it)
badgeSchema.methods.isRareBadge = async function() {
  const User = mongoose.model('User');
  const totalUsers = await User.countDocuments();
  const earnedCount = this.earnedBy.length;

  return (earnedCount / totalUsers) < 0.1;
};

module.exports = mongoose.model('Badge', badgeSchema);
