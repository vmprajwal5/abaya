const Message = require('../models/messageModel');

// @desc    Create a new message
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const newMessage = await Message.create({
      name,
      email,
      message,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update message to read
// @route   PUT /api/messages/:id/read
// @access  Private/Admin
const updateMessageToRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (message) {
      message.isRead = true;
      const updatedMessage = await message.save();
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (message) {
      await Message.deleteOne({ _id: message._id });
      res.json({ message: 'Message removed' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createMessage,
  getMessages,
  updateMessageToRead,
  deleteMessage,
};
