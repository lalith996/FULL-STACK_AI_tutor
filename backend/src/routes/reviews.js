const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createReviewValidation, validate } = require('../middleware/validator');
const {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful
} = require('../controllers/reviews');

router.get('/', getReviews);

router.use(protect);

router.post('/', createReviewValidation, validate, createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/helpful', markHelpful);

module.exports = router;
