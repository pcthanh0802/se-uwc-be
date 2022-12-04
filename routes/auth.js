const router = require('express').Router();
const authController = require('../controllers/auth')

router.post('/createAccount', authController.createAccount);
router.post('/login', authController.login);
router.post('/token', authController.regrantToken);
router.delete('/logout', authController.logout);

module.exports = router;