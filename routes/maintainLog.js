const router = require('express').Router();
const logController = require('../controllers/maintainLog');
const auth = require('../middlewares/authenticateToken');

router.post('/add', logController.addMaintainLog);
router.get('/all', logController.getAllMaintainLog);
router.get('/info/:id', logController.getMaintainLogById);
router.get('/vehicle/:id', logController.getMaintainLogByVehicle);

module.exports = router;