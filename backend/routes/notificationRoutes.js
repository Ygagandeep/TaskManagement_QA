const router = require('express').Router();
const { listNotifications, unreadCount, markRead, deleteNotification, clearAll } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', listNotifications);
router.get('/unread-count', unreadCount);
router.put('/:id/read', markRead);
router.delete('/clear', clearAll);
router.delete('/:id', deleteNotification);

module.exports = router;
