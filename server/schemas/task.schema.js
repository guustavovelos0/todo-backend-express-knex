const { z } = require('zod');
const STATUS = require('../utils/status.enum');
const PRIORITY = require('../utils/priority.enum');

const taskSchema = z.object({
    title: z.string().min(3).max(50),
    description: z.string().min(3).max(500),
    project_id: z.string().uuid(),
    status: z.enum(Object.values(STATUS)).default(STATUS.TODO),
    priority: z.enum(Object.values(PRIORITY)).default(PRIORITY.LOW),
    due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD.")
        .transform((dateStr) => new Date(dateStr))
        .refine((date) => !isNaN(date.getTime()), "Invalid date"),
    user_id: z.string().uuid(),
});

module.exports = taskSchema;