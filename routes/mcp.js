const router = require('express').Router();
const mcpController = require('../controllers/mcp');

router.post('/add', mcpController.addMCP);
router.get('/info/:id', mcpController.getMCPById);
router.post('/info', mcpController.getMCPByCoordinate);
router.put('/updateCurrent', mcpController.updateMCPCurrent);
router.get('/current/:id', mcpController.getMCPCurrent);
router.get('/current/percentage/:id', mcpController.getMCPCurrentPercentage);
router.put('/current/update/:id', mcpController.simulateMCPStatusUpdating);

module.exports = router;