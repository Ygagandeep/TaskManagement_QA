const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

const dashboard = async (req, res) => {
  const [totalProjects, totalTasks, completedTasks, totalEmployees, recentProjects, recentTasks] = await Promise.all([
    Project.countDocuments(),
    Task.countDocuments(),
    Task.countDocuments({ status: 'Completed' }),
    User.countDocuments(),
    Project.find().sort({ createdAt: -1 }).limit(5),
    Task.find().populate('project', 'projectName').populate('assignedTo', 'name').sort({ createdAt: -1 }).limit(5)
  ]);

  const statuses = await Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  const priorities = await Task.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]);
  const projectProgress = await Project.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  const workload = await Task.aggregate([{ $group: { _id: '$assignedTo', count: { $sum: 1 } } }, { $limit: 8 }]);
  const weeklyCompletedTasks = await Task.aggregate([
    { $match: { status: 'Completed' } },
    { $group: { _id: { $dayOfWeek: '$updatedAt' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  const workloadUsers = await User.find({ _id: { $in: workload.map((item) => item._id).filter(Boolean) } }).select('name');
  const namesById = Object.fromEntries(workloadUsers.map((user) => [String(user._id), user.name]));

  res.json({
    totalProjects,
    totalTasks,
    completedTasks,
    totalEmployees,
    taskStatus: statuses,
    priorityDistribution: priorities,
    projectProgress,
    employeeWorkload: workload.map((item) => ({ name: namesById[String(item._id)] || 'Unassigned', count: item.count })),
    weeklyCompletedTasks,
    recentProjects,
    recentTasks
  });
};

module.exports = { dashboard };
