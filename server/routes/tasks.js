const express = require('express');
const router = express.Router();
const controller = require('../controllers/tasks');

router.get('/', controller.getAllTasks);
router.get('/project/:project_id', controller.getAllTasksByProject);
router.get('/:id', controller.getTask);
router.post('/', controller.createTask);
router.patch('/:id', controller.updateTask);
router.delete('/:id', controller.deleteTask);

module.exports = router;