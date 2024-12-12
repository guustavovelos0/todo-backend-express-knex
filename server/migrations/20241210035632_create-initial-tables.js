/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        // Organizations table
        .createTable('organizations', (table) => {
            table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
            table.string('name').notNullable();
            table.timestamps(true, true);
        })

        // Users table with organization relationship
        .createTable('users', (table) => {
            table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
            table.string('name').notNullable();
            table.string('email').notNullable().unique();
            table.string('password').notNullable();
            table.uuid('organization_id').unsigned();
            table.foreign('organization_id').references('organizations.id');
            table.timestamps(true, true);
        })

        // Projects table with organization relationship
        .createTable('projects', (table) => {
            table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
            table.string('name').notNullable();
            table.uuid('organization_id').unsigned();
            table.foreign('organization_id').references('organizations.id');
            table.timestamps(true, true);
        })

        // Users-Projects junction table (many-to-many)
        .createTable('users_projects', (table) => {
            table.uuid('user_id').unsigned();
            table.uuid('project_id').unsigned();
            table.foreign('user_id').references('users.id');
            table.foreign('project_id').references('projects.id');
            table.primary(['user_id', 'project_id']);
        })

        // Tasks table
        .createTable('tasks', (table) => {
            table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
            table.string('title').notNullable();
            table.text('description');
            table.enu('status', ['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']).notNullable().defaultTo('TODO');
            table.enu('priority', ['LOW', 'MEDIUM', 'HIGH']).notNullable().defaultTo('LOW');
            table.date('due_date').notNullable();
            table.uuid('project_id').unsigned();
            table.uuid('user_id').unsigned();
            table.foreign('project_id').references('projects.id');
            table.foreign('user_id').references('users.id');
            table.timestamps(true, true);
        })

        // Subtasks table
        .createTable('subtasks', (table) => {
            table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
            table.string('title').notNullable();
            table.text('description');
            table.enu('status', ['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']).notNullable().defaultTo('TODO');
            table.enu('priority', ['LOW', 'MEDIUM', 'HIGH']).notNullable().defaultTo('LOW');
            table.uuid('task_id').unsigned();
            table.foreign('task_id').references('tasks.id');
            table.timestamps(true, true);
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('subtasks')
        .dropTableIfExists('tasks')
        .dropTableIfExists('users_projects')
        .dropTableIfExists('projects')
        .dropTableIfExists('users')
        .dropTableIfExists('organizations')
        .then(() => {
            return knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
        });
};
