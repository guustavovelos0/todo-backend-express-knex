const projects = require('../database/project-queries.js');
const addErrorReporting = require('../utils/addErrorReporting.js');
const projectSchema = require('../schemas/project.schema.js');

async function getAllProjects(req, res) {
    const allEntries = await projects.all();
    return res.send(allEntries);
}

async function getProject(req, res) {

    const project = await projects.get(req.params.id);
    if (!project) {
        return res.status(404).send({ error: "Project not found" });
    }
    return res.send(project);
}

async function createProject(req, res) {
    const result = projectSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).send({
            error: "Invalid project data",
            details: result.error.issues
        });
    }
    const created = await projects.create(result.data);
    return res.send(created);
}

async function updateProject(req, res) {
    const result = projectSchema.pick({ name: true }).strict().safeParse(req.body);
    if (!result.success) {
        return res.status(400).send({
            error: "Invalid project data",
            details: result.error.issues
        });
    }
    const patched = await projects.update(req.params.id, result.data);
    if (!patched) {
        return res.status(404).send({ error: "Project not found" });
    }
    return res.send(patched);
}

async function deleteProject(req, res) {
    const deleted = await projects.delete(req.params.id);
    if (!deleted) {
        return res.status(404).send({ error: "Project not found" });
    }
    return res.send(deleted);
}

const toExport = {
    getAllProjects: { method: getAllProjects, errorMessage: "Could not fetch all projects" },
    getProject: { method: getProject, errorMessage: "Could not fetch project" },
    createProject: { method: createProject, errorMessage: "Could not create project" },
    updateProject: { method: updateProject, errorMessage: "Could not update project" },
    deleteProject: { method: deleteProject, errorMessage: "Could not delete project" }
}

for (let route in toExport) {
    toExport[route] = addErrorReporting(toExport[route].method, toExport[route].errorMessage);
}

module.exports = toExport; 