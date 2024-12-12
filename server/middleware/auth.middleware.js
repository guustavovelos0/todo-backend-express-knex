const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).send({ error: 'No token provided' });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user info to request object
        req.user = {
            id: decoded.id,
            email: decoded.email,
            organization_id: decoded.organization_id,
            role: decoded.role
        };

        next();
    } catch (error) {
        return res.status(401).send({ error: 'Invalid or expired token' });
    }
}

module.exports = authMiddleware; 