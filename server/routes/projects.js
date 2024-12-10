const express = require('express');
const router = express.Router();
const controller = require('../controllers/projects');

router.get('/', controller.getAllProjects);
router.get('/:id', controller.getProject);

router.post('/', controller.createProject);
router.patch('/:id', controller.updateProject);
router.delete('/:id', controller.deleteProject);

module.exports = router; 