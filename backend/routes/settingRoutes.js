const router = require('express').Router();
const { getSettings, updateProfile, changePassword, updateSettings, deleteAccount } = require('../controllers/settingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getSettings);
router.put('/', updateSettings);
router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.delete('/account', deleteAccount);

module.exports = router;
