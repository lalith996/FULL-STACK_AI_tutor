const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createQuizValidation, validate, validateObjectId } = require('../middleware/validator');
const {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizAttempts,
  getQuizStatistics
} = require('../controllers/quizzes');

router.use(protect);

router.get('/', getQuizzes);
router.get('/:id', validateObjectId('id'), validate, getQuiz);
router.post('/:id/submit', validateObjectId('id'), validate, submitQuiz);
router.get('/:id/attempts', validateObjectId('id'), validate, getQuizAttempts);

// Teacher/Admin routes
router.post('/', authorize('teacher', 'admin'), createQuizValidation, validate, createQuiz);
router.put('/:id', authorize('teacher', 'admin'), validateObjectId('id'), validate, updateQuiz);
router.delete('/:id', authorize('teacher', 'admin'), validateObjectId('id'), validate, deleteQuiz);
router.get('/:id/statistics', authorize('teacher', 'admin'), validateObjectId('id'), validate, getQuizStatistics);

module.exports = router;
