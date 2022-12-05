const router = require('express').Router();
const vehicleController = require('../controllers/vehicle');
const auth = require('../middlewares/authenticateToken');

router.post('/add', auth, vehicleController.addVehicle);
router.get('/all', auth, vehicleController.getAllVehicle);
router.post('/type', auth, vehicleController.getVehicleByType);
router.get('/info/:id', auth, vehicleController.getVehicleById);

module.exports = router;
