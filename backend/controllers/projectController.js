const Project = require('../models/Project');
const Task = require('../models/Task');
const Notification = require('../models/Notification');

const listProjects = async (req, res) => {
  const projects = await Project.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
  res.json(projects);
};

const createProject = async (req, res) => {
  const { projectName, description, status } = req.body;
  const project = await Project.create({ projectName, description, status, createdBy: req.user._id });
  await Notification.create({ user: req.user._id, message: `Project created: ${project.projectName}`, type: 'project' });
  res.status(201).json(await project.populate('createdBy', 'name email'));
};

const deleteProject = async (req, res) => {
  await Task.deleteMany({ project: req.params.id });
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: 'Project and related tasks deleted' });
};

const updateProjectStatus = async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ['Not Started', 'In Progress', 'Completed'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid project status' });
  }

  const project = await Project.findByIdAndUpdate(req.params.id, { status }, { new: true })
    .populate('createdBy', 'name email');
  if (!project) return res.status(404).json({ message: 'Project not found' });

  res.json(project);
};

module.exports = { listProjects, createProject, deleteProject, updateProjectStatus };
