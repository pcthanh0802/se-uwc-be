const router = require('express').Router();
const vehicleController = require('../controllers/vehicle');

router.post('/add', vehicleController.addVehicle);
router.get('/info/:id', vehicleController.getVehicleById);

module.exports = router;
