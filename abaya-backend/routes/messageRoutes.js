const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  updateMessageToRead,
  deleteMessage,
} = require('../controllers/messageController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(createMessage).get(protect, admin, getMessages);
router.route('/:id').delete(protect, admin, deleteMessage);
router.route('/:id/read').put(protect, admin, updateMessageToRead);

module.exports = router;
