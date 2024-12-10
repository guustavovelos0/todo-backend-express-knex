const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');

router.get('/', controller.getAllUsers);
router.get('/:id', controller.getUser);

router.post('/', controller.createUser);
router.patch('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

module.exports = router;