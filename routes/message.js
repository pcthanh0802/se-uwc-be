const router = require('express').Router();
const messageController = require('../controllers/message');

router.post('/add', messageController.addMessage);
router.post('/', messageController.getMessage);

module.exports = router;