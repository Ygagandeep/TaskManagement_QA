const Access = require('../models/Access');
const User = require('../models/User');

const accessKeys = [
  'dashboard',
  'employeeManagement',
  'projectManagement',
  'taskManagement',
  'reports',
  'notifications',
  'fileUpload',
  'settings',
  'accessManagement'
];

const adminOnlyKeys = ['employeeManagement', 'accessManagement'];

const defaultAccessForRole = (role) => {
  const isAdmin = role === 'admin';
  return {
    dashboard: true,
    employeeManagement: isAdmin,
    projectManagement: true,
    taskManagement: true,
    reports: true,
    notifications: true,
    fileUpload: true,
    settings: true,
    accessManagement: isAdmin
  };
};

const normalizeAccess = (payload = {}, role = 'user') => {
  const normalized = defaultAccessForRole(role);

  accessKeys.forEach((key) => {
    if (payload[key] === true || payload[key] === 'true') normalized[key] = true;
    if (payload[key] === false || payload[key] === 'false') normalized[key] = false;
  });

  if (role !== 'admin') {
    adminOnlyKeys.forEach((key) => {
      normalized[key] = false;
    });
  }

  if (role === 'admin') {
    accessKeys.forEach((key) => {
      normalized[key] = true;
    });
  }

  return normalized;
};

const ensureAccess = async (user) => {
  const existing = await Access.findOne({ user: user._id });
  const normalized = normalizeAccess(existing || {}, user.role);

  if (!existing) {
    return Access.create({ user: user._id, ...normalized });
  }

  return Access.findOneAndUpdate({ user: user._id }, normalized, { new: true });
};

const listAccess = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  const rows = await Promise.all(users.map(async (user) => ({ user, access: await ensureAccess(user) })));
  res.json(rows);
};

const updateAccess = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const access = await Access.findOneAndUpdate(
    { user: user._id },
    normalizeAccess(req.body, user.role),
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json(access);
};

module.exports = { listAccess, updateAccess };
