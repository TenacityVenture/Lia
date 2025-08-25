const express = require('express');
const router = express.Router();
const {
    chats, // chat history for a user
    getChatMessages, // chat messages in a chat
    getChatById, // get chat by ID
    createChat,
    message, // add a message to a chat
    deleteChat, 
    updateChatTitle,
    updateChatLastUsed,
    listeTemplates
} = require('../controllers/chatController');
const { authenticate, checkPlan } = require('../middlewares/authMiddleware');

// create a new chat
// POST /api/chat/start
router.post('/start', authenticate, checkPlan('standard'), createChat);

// POST /api/chat/:chatId/message
// add a message to a chat
router.post('/:chatId/message', authenticate, checkPlan('standard'), message);

// list all chats for a user
// GET /api/chat
router.get('/history', authenticate, chats)

// list all chats history (messages) in a chats
// GET /api/chat/:chatId/history
router.get('/:chatId/messages', authenticate, getChatMessages) // chat messages in a chat);

// update a chat
// PUT /api/chat/:chatId
router.put('/:chatId', authenticate, updateChatTitle);

// get chat by ID
// GET /api/chat/:chatId
router.get('/:chatId', authenticate, getChatById);

// update chat last updated time
// PUT /api/chat/:chatId/update
router.put('/:chatId/last-used', authenticate, updateChatLastUsed); 

// delete a chat
// DELETE /api/chat/:chatId
router.delete('/:chatId', authenticate, deleteChat);

// chat templating
const { listTemplates } = require('../controllers/chatController')

// list all chat templates
// GET /api/chat/templates
router.get('/templates', authenticate, listTemplates)

module.exports = router;