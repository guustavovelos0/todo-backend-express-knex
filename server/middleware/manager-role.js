const ROLES = require('../utils/roles.enum');

function managerRoleMiddleware(req, res, next) {
    const user = req.user;
    console.log(user);

    if (user.role !== ROLES.MANAGER && user.role !== ROLES.OWNER) {
        return res.status(403).send({ error: 'Forbidden' });
    }

    next();
}

module.exports = managerRoleMiddleware; 