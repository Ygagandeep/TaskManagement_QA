const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Access = require('../models/Access');
const Setting = require('../models/Setting');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'change_this_secret_for_local_project', { expiresIn: '1d' });

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
//Create default permission fro new User
const createDefaultAccess = async (user) => {
  const isAdmin = user.role === 'admin';
  return Access.create({
    user: user._id,
    employeeManagement: isAdmin,
    accessManagement: isAdmin
  });
};

const normalizeAccessForUser = async (user) => {
  let access = await Access.findOne({ user: user._id });
  if (!access) access = await createDefaultAccess(user);

  if (user.role === 'admin') {
    const allAccess = Object.fromEntries(accessKeys.map((key) => [key, true]));
    access = await Access.findOneAndUpdate({ user: user._id }, allAccess, { new: true });
  }

  return access;
};

const register = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    if (!name || !email || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ message: 'Email or username already exists' });

    const userCount = await User.countDocuments();
    const user = await User.create({
      name,
      email,
      username,
      password,
      role: userCount === 0 ? 'admin' : 'user'
    });

    await createDefaultAccess(user);
    await Setting.create({ user: user._id });

    res.status(201).json({ message: 'Registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Your account is inactive' });
    }

    const access = await normalizeAccessForUser(user);
    res.json({
      token: signToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status
      },
      access
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const profile = async (req, res) => {
  const access = await normalizeAccessForUser(req.user);
  res.json({ user: req.user, access });
};

module.exports = { register, login, profile };
