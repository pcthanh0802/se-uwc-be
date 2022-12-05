const router = require('express').Router();
const mcpController = require('../controllers/mcp');
const auth = require('../middlewares/authenticateToken');

router.post('/add', mcpController.addMCP);
router.get('/all', mcpController.getAllMCP);
router.get('/current/all', mcpController.getAllMCPCurrent);
router.get('/info/:id', mcpController.getMCPById);
router.post('/info', mcpController.getMCPByCoordinate);
router.put('/updateCurrent', mcpController.updateMCPCurrent);
router.get('/current/:id', mcpController.getMCPCurrent);
router.get('/current/percentage/:id', mcpController.getMCPCurrentPercentage);
router.put('/current/update/:id', mcpController.simulateMCPStatusUpdating);

module.exports = router;