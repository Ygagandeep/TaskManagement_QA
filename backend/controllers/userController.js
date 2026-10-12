const User = require('../models/User');
const Access = require('../models/Access');
const Notification = require('../models/Notification');

const listUsers = async (req, res) => {
  const { search = '', role, status } = req.query;
  const query = {};
  if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
  if (role && role !== 'all') query.role = role;
  if (status && status !== 'all') query.status = status;
  const users = await User.find(query).select('-password').sort({ createdAt: -1 });
  res.json(users);  
};

const createEmployee = async (req, res) => {
  const { name, email, username, password, role = 'user' } = req.body;
  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) return res.status(409).json({ message: 'Email or username already exists' });
  const user = await User.create({ name, email, username, password, role });
  await Access.create({
    user: user._id,
    employeeManagement: role === 'admin',
    accessManagement: role === 'admin'
  });
  res.status(201).json(await User.findById(user._id).select('-password'));
};

const updateRole = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  await Access.findOneAndUpdate(
    { user: user._id },
    { employeeManagement: user.role === 'admin', accessManagement: user.role === 'admin' },
    { upsert: true }
  );
  res.json(user);
};

const updateStatus = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  await Notification.create({ user: user._id, message: `Your account status is now ${user.status}`, type: 'employee' });
  res.json(user);
};

const deleteUser = async (req, res) => {
  await Access.deleteOne({ user: req.params.id });
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Employee deleted' });
};

module.exports = { listUsers, createEmployee, updateRole, updateStatus, deleteUser };
