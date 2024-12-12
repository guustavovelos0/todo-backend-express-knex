const { z } = require('zod');

const projectSchema = z.object({
    name: z.string().min(3).max(50),
    organization_id: z.string().uuid(),
});

module.exports = projectSchema;