const mongoose = require('mongoose');

const accessSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    dashboard: { type: Boolean, default: true },
    projectManagement: { type: Boolean, default: true },
    taskManagement: { type: Boolean, default: true },
    employeeManagement: { type: Boolean, default: false },
    reports: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true },
    fileUpload: { type: Boolean, default: true },
    settings: { type: Boolean, default: true },
    accessManagement: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Access', accessSchema);
