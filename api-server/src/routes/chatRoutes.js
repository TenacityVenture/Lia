const router = express.Router();
const {
    chats, // chat history for a user
    chatMessages, // chat messages in a chat
    createChat, 
    updateChat, 
    deleteChat 
} = require('../controllers/chatController');
const { authenticate } = require('../middlewares/authMiddleware');

// create a new chat
// POST /api/chat/start
router.post('/start', authenticate, createChat);

// list all chats for a user
// GET /api/chat
router.get('/history', authenticate, chats)

// list all chats history (messages) in a chats
// GET /api/chat/:chatId/history
router.get('/:chatId/messages', authenticate, chatMessages) // chat messages in a chat);

// update a chat
// PUT /api/chat/:chatId
router.put('/:chatId', authenticate, updateChat);

// delete a chat
// DELETE /api/chat/:chatId
router.delete('/:chatId', authenticate, deleteChat);