const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!req.user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account is inactive'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Check course ownership or enrollment
exports.checkCourseAccess = async (req, res, next) => {
  try {
    const Course = require('../models/Course');
    const course = await Course.findById(req.params.id || req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Teachers can access their own courses
    if (req.user.role === 'teacher' && course.instructor.toString() === req.user._id.toString()) {
      req.course = course;
      return next();
    }

    // Admins can access all courses
    if (req.user.role === 'admin') {
      req.course = course;
      return next();
    }

    // Students can access enrolled courses
    if (req.user.role === 'student' && course.enrolledStudents.includes(req.user._id)) {
      req.course = course;
      return next();
    }

    // Public courses can be viewed by anyone
    if (course.isPublished && req.method === 'GET') {
      req.course = course;
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this course'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
