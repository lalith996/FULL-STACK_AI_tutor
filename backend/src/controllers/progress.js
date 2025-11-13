const Progress = require('../models/Progress');
const Course = require('../models/Course');

// @desc    Get user progress for a course
// @route   GET /api/progress/:courseId
// @access  Private
exports.getProgress = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({
      user: req.user.id,
      course: req.params.courseId
    });

    if (!progress) {
      // Create progress if doesn't exist
      progress = await Progress.create({
        user: req.user.id,
        course: req.params.courseId
      });
    }

    const statistics = await progress.getStatistics();

    res.status(200).json({
      success: true,
      progress,
      statistics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update progress
// @route   PUT /api/progress/:courseId
// @access  Private
exports.updateProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({
      user: req.user.id,
      course: req.params.courseId
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress not found'
      });
    }

    const { moduleId, lessonId } = req.body;

    if (moduleId && lessonId) {
      await progress.updateLastAccessed(moduleId, lessonId);
    }

    res.status(200).json({
      success: true,
      message: 'Progress updated',
      progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark lesson as complete
// @route   POST /api/progress/:courseId/lessons/:lessonId/complete
// @access  Private
exports.completeLesson = async (req, res, next) => {
  try {
    const { moduleId, timeSpent } = req.body;

    let progress = await Progress.findOne({
      user: req.user.id,
      course: req.params.courseId
    });

    if (!progress) {
      progress = await Progress.create({
        user: req.user.id,
        course: req.params.courseId
      });
    }

    await progress.completeLesson(moduleId, req.params.lessonId, timeSpent);

    res.status(200).json({
      success: true,
      message: 'Lesson marked as complete',
      progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get certificate
// @route   GET /api/progress/:courseId/certificate
// @access  Private
exports.getCertificate = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({
      user: req.user.id,
      course: req.params.courseId
    }).populate('course', 'title');

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress not found'
      });
    }

    if (!progress.certificateIssued) {
      return res.status(400).json({
        success: false,
        message: 'Certificate not yet issued. Complete the course first.'
      });
    }

    res.status(200).json({
      success: true,
      certificate: {
        id: progress.certificateId,
        courseName: progress.course.title,
        studentName: req.user.name,
        issuedAt: progress.certificateIssuedAt
      }
    });
  } catch (error) {
    next(error);
  }
};
