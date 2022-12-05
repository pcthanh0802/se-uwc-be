const router = require('express').Router();
const vehicleController = require('../controllers/vehicle');
const auth = require('../middlewares/authenticateToken');

router.post('/add', vehicleController.addVehicle);
router.get('/all', vehicleController.getAllVehicle);
router.post('/type', vehicleController.getVehicleByType);
router.get('/info/:id', vehicleController.getVehicleById);

module.exports = router;
