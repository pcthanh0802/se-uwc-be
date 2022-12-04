const router = require('express').Router();
const mapController = require('../controllers/map');

router.post('/waypoints', mapController.inputWaypoints);
router.get('/currentPosition/:collectorId', mapController.getCurrentPosition);
router.get('/allCurrentPosition', mapController.getAllCurrentPosition);

module.exports = router;