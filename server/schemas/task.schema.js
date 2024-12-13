const { z } = require('zod');
const STATUS = require('../utils/status.enum');
const PRIORITY = require('../utils/priority.enum');

const taskSchema = z.object({
    title: z.string().min(3).max(50),
    description: z.string().min(3).max(500),
    project_id: z.string().uuid(),
    status: z.enum(Object.values(STATUS)).default(STATUS.TODO),
    priority: z.enum(Object.values(PRIORITY)).default(PRIORITY.LOW),
    parent_task_id: z.string().uuid().optional(),
    due_date: z.string().datetime(),
    user_id: z.string().uuid(),
});

module.exports = taskSchema;