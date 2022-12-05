const router = require('express').Router();
const taskController = require('../controllers/task');
const auth = require('../middlewares/authenticateToken');

router.post('/add', auth, taskController.addTask);
router.get('/info/:id', auth, taskController.getTaskById);
router.get('/info/employee/:id', auth, taskController.getTaskByEmployee);
router.delete('/remove/:id', auth, taskController.removeTaskById);

module.exports = router;