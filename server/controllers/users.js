const _ = require('lodash');
const users = require('../database/user-queries.js');
const addErrorReporting = require('../utils/addErrorReporting.js');
const userSchema = require('../schemas/user.schema.js');

async function getAllUsers(req, res) {
    const allEntries = await users.all();
    return res.send(allEntries);
}

async function getUser(req, res) {
    const user = await users.get(req.params.id);
    return res.send(user);
}

async function updateUser(req, res) {
    const result = userSchema.partial().safeParse(req.body);
    if (result.data.password) {
        result.data.password = await bcrypt.hash(result.data.password, 10);
    }
    if (!result.success) {
        return res.status(400).send({
            error: "Invalid user data",
            details: result.error.issues
        });
    }

    const patched = await users.update(req.params.id, result.data);
    if (!patched) {
        return res.status(404).send({ error: "User not found" });
    }
    return res.send(patched);
}

async function deleteUser(req, res) {
    const deleted = await users.delete(req.params.id);
    if (!deleted) {
        return res.status(404).send({ error: "User not found" });
    }
    return res.send(deleted);
}

const toExport = {
    getAllUsers: { method: getAllUsers, errorMessage: "Could not fetch all users" },
    getUser: { method: getUser, errorMessage: "Could not fetch user" },
    updateUser: { method: updateUser, errorMessage: "Could not update user" },
    deleteUser: { method: deleteUser, errorMessage: "Could not delete user" }
}

for (let route in toExport) {
    toExport[route] = addErrorReporting(toExport[route].method, toExport[route].errorMessage);
}

module.exports = toExport;
