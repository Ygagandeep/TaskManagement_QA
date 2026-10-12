const router = require('express').Router();
const { listUsers, createEmployee, updateRole, updateStatus, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.use(protect);
router.get('/', listUsers);
router.post('/', adminOnly, createEmployee);
router.put('/:id/role', adminOnly, updateRole);
router.put('/:id/status', adminOnly, updateStatus);
router.delete('/:id', adminOnly, deleteUser);

module.exports = router;
