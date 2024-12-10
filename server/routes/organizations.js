const express = require('express');
const router = express.Router();
const controller = require('../controllers/organizations');

/**
 * @swagger
 * components:
 *   schemas:
 *     Organization:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the organization
 *         name:
 *           type: string
 *           description: The name of the organization
 *         description:
 *           type: string
 *           description: A brief description of the organization
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when the organization was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when the organization was last updated
 *       example:
 *         id: 1
 *         name: Example Organization
 *         description: This is an example organization.
 *         created_at: 2023-10-01T12:00:00Z
 *         updated_at: 2023-10-01T12:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: API endpoints for managing organizations
 */

/**
 * @swagger
 * /organizations:
 *   get:
 *     summary: Retrieve a list of organizations
 *     tags: [Organizations]
 *     responses:
 *       200:
 *         description: A list of organizations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Organization'
 */
router.get('/', controller.getAllOrganizations);

/**
 * @swagger
 * /organizations/{id}:
 *   get:
 *     summary: Get an organization by ID
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The organization ID
 *     responses:
 *       200:
 *         description: The organization data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Organization not found
 */
router.get('/:id', controller.getOrganization);

/**
 * @swagger
 * /organizations:
 *   post:
 *     summary: Create a new organization
 *     tags: [Organizations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Organization'
 *     responses:
 *       200:
 *         description: The created organization
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       400:
 *         description: Validation error
 */
router.post('/', controller.createOrganization);

/**
 * @swagger
 * /organizations/{id}:
 *   patch:
 *     summary: Update an organization
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The organization ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Organization'
 *     responses:
 *       200:
 *         description: The updated organization
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Organization not found
 *       400:
 *         description: Validation error
 */
router.patch('/:id', controller.updateOrganization);

/**
 * @swagger
 * /organizations/{id}:
 *   delete:
 *     summary: Delete an organization
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The organization ID
 *     responses:
 *       200:
 *         description: The deleted organization
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Organization not found
 */
router.delete('/:id', controller.deleteOrganization);

module.exports = router; 