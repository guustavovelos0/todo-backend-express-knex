/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        // First drop existing policies if any
        .raw('DROP POLICY IF EXISTS tenant_isolation_policy ON users')
        .raw('DROP POLICY IF EXISTS tenant_isolation_policy ON organizations')
        .raw('DROP POLICY IF EXISTS tenant_isolation_policy ON projects')
        .raw('DROP POLICY IF EXISTS tenant_isolation_policy ON tasks')
        // Enable RLS
        .raw('ALTER TABLE users ENABLE ROW LEVEL SECURITY')
        .raw('ALTER TABLE organizations ENABLE ROW LEVEL SECURITY')
        .raw('ALTER TABLE projects ENABLE ROW LEVEL SECURITY')
        .raw('ALTER TABLE tasks ENABLE ROW LEVEL SECURITY')
        // Create policies
        .raw(`
            CREATE POLICY tenant_isolation_policy ON users 
            FOR ALL TO PUBLIC
            USING (organization_id = current_setting('app.current_tenant')::uuid)
        `)
        .raw(`
            CREATE POLICY tenant_isolation_policy ON organizations 
            FOR ALL TO PUBLIC
            USING (id = current_setting('app.current_tenant')::uuid)
        `)
        .raw(`
            CREATE POLICY tenant_isolation_policy ON projects 
            FOR ALL TO PUBLIC
            USING (organization_id = current_setting('app.current_tenant')::uuid)
        `)
        .raw(`
            CREATE POLICY tenant_isolation_policy ON tasks 
            FOR ALL TO PUBLIC
            USING (organization_id = current_setting('app.current_tenant')::uuid)
        `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .raw('DROP POLICY IF EXISTS tenant_isolation_policy ON users')
        .raw('DROP POLICY IF EXISTS tenant_isolation_policy ON organizations')
        .raw('DROP POLICY IF EXISTS tenant_isolation_policy ON projects')
        .raw('DROP POLICY IF EXISTS tenant_isolation_policy ON tasks')
        .raw('ALTER TABLE users DISABLE ROW LEVEL SECURITY')
        .raw('ALTER TABLE organizations DISABLE ROW LEVEL SECURITY')
        .raw('ALTER TABLE projects DISABLE ROW LEVEL SECURITY')
        .raw('ALTER TABLE tasks DISABLE ROW LEVEL SECURITY');
};
