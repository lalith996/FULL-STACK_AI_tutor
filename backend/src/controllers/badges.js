const Badge = require('../models/Badge');
const User = require('../models/User');

// @desc    Get all badges
// @route   GET /api/badges
// @access  Private
exports.getBadges = async (req, res, next) => {
  try {
    const { category, rarity } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (rarity) query.rarity = rarity;

    const badges = await Badge.find(query).sort('category rarity');

    res.status(200).json({
      success: true,
      count: badges.length,
      badges
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single badge
// @route   GET /api/badges/:id
// @access  Private
exports.getBadge = async (req, res, next) => {
  try {
    const badge = await Badge.findById(req.params.id);

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found'
      });
    }

    res.status(200).json({
      success: true,
      badge
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create badge
// @route   POST /api/badges
// @access  Private/Admin
exports.createBadge = async (req, res, next) => {
  try {
    const badge = await Badge.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Badge created successfully',
      badge
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update badge
// @route   PUT /api/badges/:id
// @access  Private/Admin
exports.updateBadge = async (req, res, next) => {
  try {
    const badge = await Badge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Badge updated successfully',
      badge
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete badge
// @route   DELETE /api/badges/:id
// @access  Private/Admin
exports.deleteBadge = async (req, res, next) => {
  try {
    const badge = await Badge.findById(req.params.id);

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found'
      });
    }

    await badge.remove();

    res.status(200).json({
      success: true,
      message: 'Badge deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user badges
// @route   GET /api/badges/user/:userId
// @access  Private
exports.getUserBadges = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('profile.badges');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      count: user.profile.badges.length,
      badges: user.profile.badges
    });
  } catch (error) {
    next(error);
  }
};
