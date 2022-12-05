const router = require('express').Router();
const employeeController = require('../controllers/employee');

router.post('/role', employeeController.getEmployeeByRole);
router.get('/info/:username', employeeController.getEmployeeByUsername);

module.exports = router;