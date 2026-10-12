const router = require('express').Router();
const { listFiles, uploadFile, deleteFile } = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);
router.get('/', listFiles);
router.post('/upload', upload.single('file'), uploadFile);
router.delete('/:id', deleteFile);

module.exports = router;
