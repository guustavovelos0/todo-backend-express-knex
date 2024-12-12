const ROLES = require('../utils/roles.enum');

// Only allow managers and owners to access this route
function managerRoleMiddleware(req, res, next) {
    const user = req.user;

    if (user.role !== ROLES.MANAGER && user.role !== ROLES.OWNER) {
        return res.status(403).send({ error: 'Forbidden' });
    }

    next();
}

module.exports = managerRoleMiddleware; 