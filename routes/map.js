const router = require('express').Router();
const mapController = require('../controllers/map');
const auth = require('../middlewares/authenticateToken');

router.post('/waypoints', auth, mapController.inputWaypoints);
router.get('/currentPosition/:collectorId', auth, mapController.getCurrentPosition);
router.get('/allCurrentPosition', auth, mapController.getAllCurrentPosition);

module.exports = router;