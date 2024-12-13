const organizations = require('../database/organization-queries.js');
const addErrorReporting = require('../utils/addErrorReporting.js');
const { z } = require('zod');

async function getCurrentOrganization(req, res) {
    console.log('user', req.user);
    const org = await organizations.get(req.user.organization_id);
    return res.send(org);
}

async function updateCurrentOrganization(req, res) {
    const schema = z.object({
        name: z.string().min(3)
    });
    const result = schema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).send({
            error: "Invalid user data",
            details: result.error.issues
        });
    }

    const patched = await organizations.update(req.user.organization_id, result.data);
    return res.send(patched);
}

async function deleteCurrentOrganization(req, res) {
    const deleted = await organizations.delete(req.user.organization_id);
    return res.send(deleted);
}

const toExport = {
    getCurrentOrganization: { method: getCurrentOrganization, errorMessage: "Could not fetch organization" },
    updateCurrentOrganization: { method: updateCurrentOrganization, errorMessage: "Could not update organization" },
    deleteCurrentOrganization: { method: deleteCurrentOrganization, errorMessage: "Could not delete organization" }
}

for (let route in toExport) {
    toExport[route] = addErrorReporting(toExport[route].method, toExport[route].errorMessage);
}

module.exports = toExport; 