const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const QuizAttempt = require('../models/QuizAttempt');

// @desc    Get student analytics
// @route   GET /api/analytics/student/:id
// @access  Private
exports.getStudentAnalytics = async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this user\'s analytics'
      });
    }

    const user = await User.findById(req.params.id)
      .populate('enrolledCourses.course', 'title category');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const progressRecords = await Progress.find({ user: req.params.id })
      .populate('course', 'title');

    const quizAttempts = await QuizAttempt.find({ user: req.params.id })
      .populate('quiz', 'title course');

    const analytics = {
      profile: {
        level: user.profile.level,
        points: user.profile.points,
        badges: user.profile.badges.length,
        streak: user.profile.streak
      },
      courses: {
        enrolled: user.enrolledCourses.length,
        completed: user.enrolledCourses.filter(e => e.completed).length,
        inProgress: user.enrolledCourses.filter(e => !e.completed).length
      },
      progress: {
        totalTimeSpent: progressRecords.reduce((sum, p) => sum + p.totalTimeSpent, 0),
        averageProgress: progressRecords.length > 0
          ? Math.round(progressRecords.reduce((sum, p) => sum + p.overallProgress, 0) / progressRecords.length)
          : 0,
        certificatesEarned: progressRecords.filter(p => p.certificateIssued).length
      },
      quizzes: {
        totalAttempts: quizAttempts.length,
        averageScore: quizAttempts.length > 0
          ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length)
          : 0,
        passed: quizAttempts.filter(a => a.passed).length
      },
      recentActivity: progressRecords
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, 5)
        .map(p => ({
          course: p.course.title,
          progress: p.overallProgress,
          lastAccessed: p.updatedAt
        }))
    };

    res.status(200).json({
      success: true,
      analytics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course analytics
// @route   GET /api/analytics/course/:id
// @access  Private/Teacher
exports.getCourseAnalytics = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view course analytics'
      });
    }

    const progressRecords = await Progress.find({ course: req.params.id });

    const completionRate = await course.getCompletionRate();

    const analytics = {
      overview: {
        enrolledStudents: course.studentsEnrolled,
        completionRate: Math.round(completionRate),
        rating: course.rating.average,
        totalReviews: course.rating.count
      },
      engagement: {
        totalTimeSpent: progressRecords.reduce((sum, p) => sum + p.totalTimeSpent, 0),
        averageProgress: progressRecords.length > 0
          ? Math.round(progressRecords.reduce((sum, p) => sum + p.overallProgress, 0) / progressRecords.length)
          : 0,
        certificatesIssued: progressRecords.filter(p => p.certificateIssued).length
      },
      students: progressRecords
        .sort((a, b) => b.overallProgress - a.overallProgress)
        .slice(0, 10)
        .map(p => ({
          userId: p.user,
          progress: p.overallProgress,
          timeSpent: p.totalTimeSpent,
          completed: p.overallProgress === 100
        }))
    };

    res.status(200).json({
      success: true,
      analytics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard
// @route   GET /api/analytics/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { period = 'all', limit = 10 } = req.query;

    let dateFilter = {};

    if (period === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      dateFilter = { 'profile.streak.lastActivity': { $gte: oneWeekAgo } };
    } else if (period === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      dateFilter = { 'profile.streak.lastActivity': { $gte: oneMonthAgo } };
    }

    const leaderboard = await User.find({ role: 'student', ...dateFilter })
      .select('name profile.avatar profile.level profile.points profile.badges')
      .sort('-profile.points')
      .limit(parseInt(limit));

    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      name: user.name,
      avatar: user.profile.avatar,
      level: user.profile.level,
      points: user.profile.points,
      badges: user.profile.badges.length
    }));

    res.status(200).json({
      success: true,
      period,
      count: rankedLeaderboard.length,
      leaderboard: rankedLeaderboard
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher dashboard
// @route   GET /api/analytics/teacher/dashboard
// @access  Private/Teacher
exports.getTeacherDashboard = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });

    const totalStudents = courses.reduce((sum, c) => sum + c.studentsEnrolled, 0);
    const totalRevenue = courses.reduce((sum, c) => sum + (c.price * c.studentsEnrolled), 0);

    const averageRating = courses.length > 0
      ? courses.reduce((sum, c) => sum + c.rating.average, 0) / courses.length
      : 0;

    const dashboard = {
      overview: {
        totalCourses: courses.length,
        publishedCourses: courses.filter(c => c.isPublished).length,
        totalStudents,
        totalRevenue,
        averageRating: parseFloat(averageRating.toFixed(2))
      },
      courses: courses.map(c => ({
        id: c._id,
        title: c.title,
        students: c.studentsEnrolled,
        rating: c.rating.average,
        isPublished: c.isPublished
      }))
    };

    res.status(200).json({
      success: true,
      dashboard
    });
  } catch (error) {
    next(error);
  }
};
