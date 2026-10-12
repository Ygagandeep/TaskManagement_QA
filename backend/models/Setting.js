const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    language: { type: String, default: 'English' },
    timeZone: { type: String, default: 'Asia/Kolkata' },
    dateFormat: { type: String, default: 'DD/MM/YYYY' },
    emailNotifications: { type: Boolean, default: true },
    browserNotifications: { type: Boolean, default: true },
    taskReminders: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
