const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProgress,
  updateProgress,
  completeLesson,
  getCertificate
} = require('../controllers/progress');

router.use(protect);

router.get('/:courseId', getProgress);
router.put('/:courseId', updateProgress);
router.post('/:courseId/lessons/:lessonId/complete', completeLesson);
router.get('/:courseId/certificate', getCertificate);

module.exports = router;
