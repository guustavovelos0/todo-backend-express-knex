const db = require('../database/connection');

const rlsMiddleware = async (req, res, next) => {
    const organizationId = req.user?.organization_id;

    if (!organizationId) {
        return res.status(403).json({ error: 'Organization ID is required' });
    }

    try {
        // Set the tenant
        await db.raw(`SET app.current_tenant = "${organizationId}"`);

        next();
    } catch (error) {
        console.error('Error setting RLS policy:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = rlsMiddleware;