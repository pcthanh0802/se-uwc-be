const router = require('express').Router();
const messageController = require('../controllers/message');
const auth = require('../middlewares/authenticateToken');

router.post('/add', messageController.addMessage);
router.post('/', messageController.getMessage);

module.exports = router;