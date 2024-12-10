/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .alterTable('users', (table) => {
            table.enu('role', ['OWNER', 'MANAGER', 'USER']).notNullable().defaultTo('USER');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .alterTable('users', (table) => {
            table.dropColumn('role');
        });
};
