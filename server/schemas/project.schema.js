const { z } = require('zod');

// Add user schema
const projectSchema = z.object({
    name: z.string().min(3).max(50),
    organization_id: z.number(),
});

module.exports = projectSchema;