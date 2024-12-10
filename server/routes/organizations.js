const express = require('express');
const router = express.Router();
const controller = require('../controllers/organizations');

router.get('/', controller.getAllOrganizations);
router.get('/:id', controller.getOrganization);

router.post('/', controller.createOrganization);
router.patch('/:id', controller.updateOrganization);
router.delete('/:id', controller.deleteOrganization);

module.exports = router; 