const router = require('express').Router();
const settingController = require('../controllers/setting');
const auth = require('../middlewares/authenticateToken');

router.post('/add', settingController.addSetting);
router.get('/config/:id', settingController.getSettingByUser);
router.put('/config/:id', settingController.updateSetting);

module.exports = router;