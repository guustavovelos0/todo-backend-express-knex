const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');
const ownerRoleMiddleware = require('../middleware/owner-role.middleware.js');
const sameUserRoleMiddleware = require('../middleware/same-user-role.middleware.js');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: The role of the user
 *         organization_id:
 *           type: string
 *           description: The ID of the organization the user belongs to
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was last updated
 *         deleted_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was deleted
 *       example:
 *         id: 1
 *         name: John Doe
 *         email: john.doe@example.com
 *         password: password123
 *         role: user
 *         organization_id: 1
 *         created_at: 2023-10-01T12:00:00Z
 *         updated_at: 2023-10-01T12:00:00Z
 *         deleted_at: null
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', controller.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get('/:id', controller.getUser);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user fields
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the user
 *               password:
 *                 type: string
 *                 description: The new password of the user
 *             example:
 *               name: John Smith
 *               password: newpassword123
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       400:
 *         description: Validation error
 */
router.patch('/:id', sameUserRoleMiddleware, controller.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The deleted user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.delete('/:id', ownerRoleMiddleware, controller.deleteUser);

module.exports = router;