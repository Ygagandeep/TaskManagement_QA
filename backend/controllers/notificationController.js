const Notification = require('../models/Notification');

const scopeForUser = (req) => (req.user?.role === 'admin' ? {} : { user: req.user._id });

const listNotifications = async (req, res) => {
  const notifications = await Notification.find(scopeForUser(req))
    .populate('user', 'name email username role')
    .sort({ createdAt: -1 });
  res.json(notifications);
};

const unreadCount = async (req, res) => {
  const count = await Notification.countDocuments({ ...scopeForUser(req), isRead: false });
  res.json({ count });
};

const markRead = async (req, res) => {
  const query = { _id: req.params.id, ...scopeForUser(req) };
  const notification = await Notification.findOneAndUpdate(
    query,
    { isRead: true },
    { new: true }
  );
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  res.json(notification);
};

const deleteNotification = async (req, res) => {
  await Notification.deleteOne({ _id: req.params.id, ...scopeForUser(req) });
  res.json({ message: 'Notification deleted' });
};

const clearAll = async (req, res) => {
  await Notification.deleteMany(scopeForUser(req));
  res.json({ message: 'Notifications cleared' });
};

module.exports = { listNotifications, unreadCount, markRead, deleteNotification, clearAll };
