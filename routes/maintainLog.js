const router = require('express').Router();
const logController = require('../controllers/maintainLog');
const auth = require('../middlewares/authenticateToken');

router.post('/add', auth, logController.addMaintainLog);
router.get('/all', auth, logController.getAllMaintainLog);
router.get('/info/:id', auth, logController.getMaintainLogById);
router.get('/vehicle/:id', auth, logController.getMaintainLogByVehicle);

module.exports = router;