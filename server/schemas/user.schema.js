const { z } = require('zod');
const ROLES = require('../utils/roles.enum');

const userSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(Object.values(ROLES)).default(ROLES.USER),
    organization_id: z.string().uuid()
});

module.exports = userSchema;