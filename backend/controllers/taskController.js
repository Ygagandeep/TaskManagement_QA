const Task = require('../models/Task');
const Notification = require('../models/Notification');

const statusRank = { Pending: 1, 'In Progress': 2, Completed: 3 };

const requiredTaskFields = [
  ['taskTitle', 'Task title is required.'],
  ['description', 'Description is required.'],
  ['project', 'Please select project.'],
  ['assignedTo', 'Please select employee.'],
  ['assignedDate', 'Assigned date is required.'],
  ['startDate', 'Start date is required.'],
  ['dueDate', 'Due date is required.']
];

const validateTaskPayload = (body) => {
  const missing = requiredTaskFields.find(([field]) => !String(body[field] || '').trim());
  return missing ? missing[1] : '';
};

const sendTaskError = (res, error) => {
  if (error.name === 'ValidationError') {
    const firstError = Object.values(error.errors || {})[0];
    return res.status(400).json({ message: firstError?.message || 'Please fill all required task fields.' });
  }
  return res.status(500).json({ message: error.message || 'Task request failed.' });
};

const listTasks = async (req, res) => {
  try {
    const { search = '', status, priority, assignedTo } = req.query;
    const query = {};
    if (search) query.taskTitle = new RegExp(search, 'i');
    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;
    if (assignedTo && assignedTo !== 'All') query.assignedTo = assignedTo;
    const tasks = await Task.find(query)
      .populate('project', 'projectName status')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    sendTaskError(res, error);
  }
};

const createTask = async (req, res) => {
  try {
    const validationMessage = validateTaskPayload(req.body);
    if (validationMessage) return res.status(400).json({ message: validationMessage });

    const task = await Task.create({ ...req.body, createdBy: req.user._id });
    await Notification.create({ user: task.assignedTo, message: `New task assigned: ${task.taskTitle}`, type: 'task' });
    res.status(201).json(await task.populate(['project', 'assignedTo', 'createdBy']));
  } catch (error) {
    sendTaskError(res, error);
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('project', 'projectName status')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    sendTaskError(res, error);
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status, reason = '' } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!statusRank[status]) return res.status(400).json({ message: 'Invalid task status.' });

    const isBackward = statusRank[status] < statusRank[task.status];
    if (isBackward && !reason.trim()) {
      return res.status(400).json({ message: 'Reason is required when moving task backward' });
    }

    task.status = status;
    task.backtrackReason = isBackward ? reason : task.backtrackReason;
    await task.save();
    await Notification.create({ user: task.assignedTo, message: `Task status changed to ${status}: ${task.taskTitle}`, type: 'task' });
    res.json(await task.populate(['project', 'assignedTo', 'createdBy']));
  } catch (error) {
    sendTaskError(res, error);
  }
};

const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    sendTaskError(res, error);
  }
};

module.exports = { listTasks, createTask, updateTask, updateTaskStatus, deleteTask };
