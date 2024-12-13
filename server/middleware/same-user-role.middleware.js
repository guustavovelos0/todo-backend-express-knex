// Only allow same user to access this route
function sameUserRoleMiddleware(req, res, next) {
    const user = req.user;

    if (req.params.id !== user.id) {
        return res.status(403).send({ error: 'Forbidden' });
    }

    next();
}

module.exports = sameUserRoleMiddleware; 