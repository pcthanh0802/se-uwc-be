const router = require('express').Router();
const employeeController = require('../controllers/employee');
const auth = require('../middlewares/authenticateToken');

router.post('/role', auth, employeeController.getEmployeeByRole);
router.get('/info/:username', auth, employeeController.getEmployeeByUsername);

module.exports = router;