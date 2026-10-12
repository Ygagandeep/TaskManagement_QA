const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    taskTitle: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedDate: { type: Date, required: true },
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    backtrackReason: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
