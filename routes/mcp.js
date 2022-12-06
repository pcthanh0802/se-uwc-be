const router = require('express').Router();
const mcpController = require('../controllers/mcp');
const auth = require('../middlewares/authenticateToken');

router.post('/add', auth, mcpController.addMCP);
router.get('/all', auth, mcpController.getAllMCP);
router.get('/current/all', auth, mcpController.getAllMCPCurrent);
router.get('/info/:id', auth, mcpController.getMCPById);
router.post('/info', auth, mcpController.getMCPByCoordinate);
router.put('/updateCurrent', auth, mcpController.updateMCPCurrent);
router.get('/current/:id', auth, mcpController.getMCPCurrent);
router.get('/current/percentage/:id', auth, mcpController.getMCPCurrentPercentage);
router.put('/current/reset/:id', mcpController.resetMCPCurrent);
router.put('/current/update/:id', mcpController.simulateMCPStatusUpdating);

module.exports = router;