const db = require('../database/connection');

const rlsMiddleware = async (req, res, next) => {
    console.log('req.user', req.user);
    const organizationId = req.user?.organization_id;

    if (!organizationId) {
        return res.status(403).json({ error: 'Organization ID is required' });
    }

    try {

        // Set the tenant
        await db.raw(`SET app.current_tenant = "${organizationId}"`);

        // Verify the setting was applied
        const result = await db.raw('SELECT current_setting(\'app.current_tenant\')');
        console.log('Current tenant set to:', result.rows[0].current_setting);

        // Log the user's organization_id for comparison
        console.log('User organization_id:', organizationId);

        next();
    } catch (error) {
        console.error('Error setting RLS policy:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = rlsMiddleware;