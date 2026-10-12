const router = require('express').Router();
const { listAccess, updateAccess } = require('../controllers/accessController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.use(protect, adminOnly);
router.get('/', listAccess);
router.put('/:userId', updateAccess);

module.exports = router;
