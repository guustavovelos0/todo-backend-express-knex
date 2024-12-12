const express = require('express');
const router = express.Router();
const controller = require('../controllers/tasks');

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - project_id
 *         - status
 *         - priority
 *         - due_date
 *         - user_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the task
 *         title:
 *           type: string
 *           description: The title of the task
 *         description:
 *           type: string
 *           description: A brief description of the task
 *         project_id:
 *           type: integer
 *           description: The ID of the project the task belongs to
 *         status:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, DONE, BLOCKED]
 *           description: The current status of the task
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *           description: The priority level of the task
 *         due_date:
 *           type: string
 *           format: date
 *           description: The due date of the task
 *         user_id:
 *           type: integer
 *           description: The ID of the user assigned to the task
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when the task was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when the task was last updated
 *       example:
 *         id: 1
 *         title: Example Task
 *         description: This is an example task.
 *         project_id: 1
 *         status: TODO
 *         priority: MEDIUM
 *         due_date: 2023-12-31
 *         user_id: 1
 *         created_at: 2023-10-01T12:00:00Z
 *         updated_at: 2023-10-01T12:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API endpoints for managing tasks
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Retrieve a list of tasks for the user's organization
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get('/', controller.getAllTasks);

/**
 * @swagger
 * /tasks/project/{project_id}:
 *   get:
 *     summary: Retrieve a list of tasks for a specific project
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: project_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The project ID
 *     responses:
 *       200:
 *         description: A list of tasks for the project
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       404:
 *         description: Project not found
 */
router.get('/project/:project_id', controller.getAllTasksByProject);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     responses:
 *       200:
 *         description: The task data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.get('/:id', controller.getTask);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: The created task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 */
router.post('/', controller.createTask);

/**
 * @swagger
 * /tasks/subtask:
 *   post:
 *     summary: Create a new sub task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: The created sub task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 */
router.post('/subtask', controller.createSubTask);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: The updated task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       400:
 *         description: Validation error
 */
router.patch('/:id', controller.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task ID
 *     responses:
 *       200:
 *         description: The deleted task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.delete('/:id', controller.deleteTask);

module.exports = router;