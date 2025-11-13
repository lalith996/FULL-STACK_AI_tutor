const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  chatWithTutor,
  getRecommendations,
  analyzeFeedback
} = require('../controllers/ai');

router.use(protect);

router.post('/chat', chatWithTutor);
router.get('/recommendations', getRecommendations);
router.post('/feedback', analyzeFeedback);

module.exports = router;
