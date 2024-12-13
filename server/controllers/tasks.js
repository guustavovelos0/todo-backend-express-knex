const tasks = require('../database/task-queries.js');
const addErrorReporting = require('../utils/addErrorReporting.js');
const taskSchema = require('../schemas/task.schema.js');

async function getAllTasks(req, res) {
    const allEntries = await tasks.all();
    return res.send(allEntries);
}

async function getAllTasksByProject(req, res) {
    const allEntries = await tasks.all({ 'project_id': req.params.project_id });
    if (!allEntries) {
        return res.status(404).send({ error: 'Project not found' });
    }
    return res.send(allEntries);
}

async function getTask(req, res) {
    const task = await tasks.get(req.params.id);
    if (!task) {
        return res.status(404).send({ error: 'Task not found' });
    }
    return res.send(task);
}

async function createTask(req, res) {
    const validated = taskSchema.parse(req.body);
    if (!validated) {
        return res.status(400).send({ error: 'Invalid task data' });
    }
    const created = await tasks.create(req.body);
    return res.send(created);
}

async function createSubTask(req, res) {
    const validated = taskSchema.required({ parent_task_id: z.string().uuid() }).parse(req.body);
    if (!validated) {
        return res.status(400).send({ error: 'Invalid task data' });
    }
    const created = await tasks.create(req.body);
    return res.send(created);
}

async function updateTask(req, res) {
    const validated = taskSchema.partial().parse(req.body);
    if (!validated) {
        return res.status(400).send({ error: 'Invalid task data' });
    }
    const patched = await tasks.update(req.params.id, req.body);
    if (!patched) {
        return res.status(404).send({ error: 'Task not found' });
    }
    return res.send(patched);
}

async function deleteTask(req, res) {
    const deleted = await tasks.delete(req.params.id);
    if (!deleted) {
        return res.status(404).send({ error: 'Task not found' });
    }
    return res.send(deleted);
}

const toExport = {
    getAllTasks: { method: getAllTasks, errorMessage: "Could not fetch all tasks" },
    getAllTasksByProject: { method: getAllTasksByProject, errorMessage: "Could not fetch all tasks by project" },
    getTask: { method: getTask, errorMessage: "Could not fetch task" },
    createTask: { method: createTask, errorMessage: "Could not create task" },
    createSubTask: { method: createSubTask, errorMessage: "Could not create sub task" },
    updateTask: { method: updateTask, errorMessage: "Could not update task" },
    deleteTask: { method: deleteTask, errorMessage: "Could not delete task" }
}

for (let route in toExport) {
    toExport[route] = addErrorReporting(toExport[route].method, toExport[route].errorMessage);
}

module.exports = toExport;