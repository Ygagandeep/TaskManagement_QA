const router = require('express').Router();
const { listProjects, createProject, deleteProject, updateProjectStatus } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', listProjects);
router.post('/', createProject);
router.put('/:id/status', updateProjectStatus);
router.delete('/:id', deleteProject);

module.exports = router;
