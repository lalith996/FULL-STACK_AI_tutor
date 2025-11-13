const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getBadges,
  getBadge,
  createBadge,
  updateBadge,
  deleteBadge,
  getUserBadges
} = require('../controllers/badges');

router.use(protect);

router.get('/', getBadges);
router.get('/user/:userId', getUserBadges);
router.get('/:id', getBadge);

router.post('/', authorize('admin'), createBadge);
router.put('/:id', authorize('admin'), updateBadge);
router.delete('/:id', authorize('admin'), deleteBadge);

module.exports = router;
