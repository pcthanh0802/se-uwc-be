const router = require('express').Router();
const messageController = require('../controllers/message');
const auth = require('../middlewares/authenticateToken');

router.post('/add', auth, messageController.addMessage);
router.post('/', auth, messageController.getMessage);

module.exports = router;