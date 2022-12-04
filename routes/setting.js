const router = require('express').Router();
const settingController = require('../controllers/setting');

router.post('/add', settingController.addSetting);
router.get('/config/:id', settingController.getSettingByUser);
router.put('/config/:id', settingController.updateSetting);

module.exports = router;