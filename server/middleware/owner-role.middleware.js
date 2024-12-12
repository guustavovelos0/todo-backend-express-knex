const ROLES = require('../utils/roles.enum');

function ownerRoleMiddleware(req, res, next) {
    const user = req.user;

    if (user.role !== ROLES.OWNER) {
        return res.status(403).send({ error: 'Forbidden' });
    }

    next();
}

module.exports = ownerRoleMiddleware; 