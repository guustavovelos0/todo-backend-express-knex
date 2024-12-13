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
 * /organizations/current:
 *   get:
 *     summary: Get the current organization
 *     tags: [Organizations]
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
router.get('/current', controller.getCurrentOrganization);

/**
 * @swagger
 * /organizations/current:
 *   patch:
 *     summary: Update current organization
 *     tags: [Organizations]
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
router.patch('/current', controller.updateCurrentOrganization);

/**
 * @swagger
 * /organizations/current:
 *   delete:
 *     summary: Delete current organization
 *     tags: [Organizations]
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
router.delete('/current', controller.deleteCurrentOrganization);

module.exports = router;