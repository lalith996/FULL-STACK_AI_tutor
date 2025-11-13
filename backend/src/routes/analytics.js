const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getStudentAnalytics,
  getCourseAnalytics,
  getLeaderboard,
  getTeacherDashboard
} = require('../controllers/analytics');

router.use(protect);

router.get('/student/:id', getStudentAnalytics);
router.get('/course/:id', authorize('teacher', 'admin'), getCourseAnalytics);
router.get('/leaderboard', getLeaderboard);
router.get('/teacher/dashboard', authorize('teacher', 'admin'), getTeacherDashboard);

module.exports = router;
