const express = require('express');
const router = express.Router();
const routes = require('../controllers/todos'); // Import your route handlers

router.get('/', routes.getAllTodos);
router.get('/:id', routes.getTodo);

router.post('/', routes.postTodo);
router.patch('/:id', routes.patchTodo);

router.delete('/', routes.deleteAllTodos);
router.delete('/:id', routes.deleteTodo);

module.exports = router;