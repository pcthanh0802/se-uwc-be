const router = require('express').Router();
const settingController = require('../controllers/setting');
const auth = require('../middlewares/authenticateToken');

router.post('/add', auth, settingController.addSetting);
router.get('/config/:id', auth, settingController.getSettingByUser);
router.put('/config/:id', auth, settingController.updateSetting);

module.exports = router;