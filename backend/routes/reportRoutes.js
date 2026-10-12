const router = require('express').Router();
const { dashboard } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, dashboard);

module.exports = router;
