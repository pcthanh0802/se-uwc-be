const router = require('express').Router();
const taskController = require('../controllers/task');

router.post('/add', taskController.addTask);
router.get('/info/:id', taskController.getTaskById);
router.get('/info/employee/:id', taskController.getTaskByEmployee);
router.delete('/remove/:id', taskController.removeTaskById);

module.exports = router;