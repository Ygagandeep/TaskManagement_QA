const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Setting = require('../models/Setting');

const getSettings = async (req, res) => {
  const setting = await Setting.findOneAndUpdate({ user: req.user._id }, {}, { new: true, upsert: true });
  res.json(setting);
};

const updateProfile = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, { name: req.body.name, email: req.body.email }, { new: true }).select('-password');
  res.json(user);
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!(await user.matchPassword(currentPassword))) return res.status(400).json({ message: 'Current password is wrong' });
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password changed' });
};

const updateSettings = async (req, res) => {
  const setting = await Setting.findOneAndUpdate({ user: req.user._id }, req.body, { new: true, upsert: true });
  res.json(setting);
};

const deleteAccount = async (req, res) => {
  const user = await User.findById(req.user._id);
  const ok = await bcrypt.compare(req.body.password || '', user.password);
  if (!ok) return res.status(400).json({ message: 'Password confirmation failed' });
  await Setting.deleteOne({ user: req.user._id });
  await user.deleteOne();
  res.json({ message: 'Account deleted' });
};

module.exports = { getSettings, updateProfile, changePassword, updateSettings, deleteAccount };
