const router = require('express').Router();
const employeeController = require('../controllers/employee');

router.post('/role', employeeController.getEmployeeByRole);

module.exports = router;