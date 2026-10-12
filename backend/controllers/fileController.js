const fs = require('fs');
const path = require('path');
const File = require('../models/File');

const listFiles = async (req, res) => {
  const { search = '', type = 'all' } = req.query;
  const query = {};
  if (search) query.originalName = new RegExp(search, 'i');
  if (type !== 'all') query.fileType = new RegExp(type, 'i');
  const files = await File.find(query).populate('uploadedBy', 'name email').populate('project', 'projectName').sort({ createdAt: -1 });
  res.json(files);
};

const uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File is required' });
  const file = await File.create({
    fileName: req.file.filename,
    originalName: req.file.originalname,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    filePath: `/uploads/${req.file.filename}`,
    uploadedBy: req.user._id,
    project: req.body.project || undefined
  });
  res.status(201).json(file);
};

const deleteFile = async (req, res) => {
  const file = await File.findById(req.params.id);
  if (file) {
    const diskPath = path.join(__dirname, '..', file.filePath.replace(/^\/+/, ''));
    if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);
    await file.deleteOne();
  }
  res.json({ message: 'File deleted' });
};

module.exports = { listFiles, uploadFile, deleteFile };
