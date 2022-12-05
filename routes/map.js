const router = require('express').Router();
const mapController = require('../controllers/map');
const auth = require('../middlewares/authenticateToken');

router.post('/waypoints', mapController.inputWaypoints);
router.get('/currentPosition/:collectorId', mapController.getCurrentPosition);
router.get('/allCurrentPosition', mapController.getAllCurrentPosition);

module.exports = router;