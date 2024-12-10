const organizations = require('../database/organization-queries.js');
const addErrorReporting = require('../utils/addErrorReporting.js');

async function getAllOrganizations(req, res) {
    const allEntries = await organizations.all();
    return res.send(allEntries);
}

async function getOrganization(req, res) {
    const org = await organizations.get(req.params.id);
    return res.send(org);
}

async function createOrganization(req, res) {
    const created = await organizations.create(req.body);
    return res.send(created);
}

async function updateOrganization(req, res) {
    const patched = await organizations.update(req.params.id, req.body);
    return res.send(patched);
}

async function deleteOrganization(req, res) {
    const deleted = await organizations.delete(req.params.id);
    return res.send(deleted);
}

const toExport = {
    getAllOrganizations: { method: getAllOrganizations, errorMessage: "Could not fetch all organizations" },
    getOrganization: { method: getOrganization, errorMessage: "Could not fetch organization" },
    createOrganization: { method: createOrganization, errorMessage: "Could not create organization" },
    updateOrganization: { method: updateOrganization, errorMessage: "Could not update organization" },
    deleteOrganization: { method: deleteOrganization, errorMessage: "Could not delete organization" }
}

for (let route in toExport) {
    toExport[route] = addErrorReporting(toExport[route].method, toExport[route].errorMessage);
}

module.exports = toExport; 