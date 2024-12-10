/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        // Organizations table
        .createTable('organizations', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.timestamps(true, true);
        })

        // Users table with organization relationship
        .createTable('users', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.string('email').notNullable().unique();
            table.string('password').notNullable();
            table.integer('organization_id').unsigned();
            table.foreign('organization_id').references('organizations.id');
            table.timestamps(true, true);
        })

        // Projects table with organization relationship
        .createTable('projects', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.integer('organization_id').unsigned();
            table.foreign('organization_id').references('organizations.id');
            table.timestamps(true, true);
        })

        // Users-Projects junction table (many-to-many)
        .createTable('users_projects', (table) => {
            table.integer('user_id').unsigned();
            table.integer('project_id').unsigned();
            table.foreign('user_id').references('users.id');
            table.foreign('project_id').references('projects.id');
            table.primary(['user_id', 'project_id']);
        })

        // Tasks table
        .createTable('tasks', (table) => {
            table.increments('id').primary();
            table.string('title').notNullable();
            table.text('description');
            table.enu('status', ['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']).notNullable().defaultTo('TODO');
            table.enu('priority', ['LOW', 'MEDIUM', 'HIGH']).notNullable().defaultTo('LOW');
            table.date('due_date').notNullable();
            table.integer('project_id').unsigned();
            table.integer('user_id').unsigned();
            table.foreign('project_id').references('projects.id');
            table.foreign('user_id').references('users.id');
            table.timestamps(true, true);
        })

        // Subtasks table
        .createTable('subtasks', (table) => {
            table.increments('id').primary();
            table.string('title').notNullable();
            table.text('description');
            table.enu('status', ['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']).notNullable().defaultTo('TODO');
            table.enu('priority', ['LOW', 'MEDIUM', 'HIGH']).notNullable().defaultTo('LOW');
            table.integer('task_id').unsigned();
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
        .dropTableIfExists('organizations');
};
