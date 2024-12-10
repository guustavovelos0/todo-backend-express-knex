const knex = require("./connection.js");

class BaseModel {
    constructor(tableName) {
        this.tableName = tableName;
        this.db = knex;
    }

    async all(whereClause = {}) {
        // By default, only return non-deleted records if deleted_at exists
        const query = this.db(this.tableName);
        if (await this.hasColumn('deleted_at')) {
            query.where({ deleted_at: null });
        }
        return query.where(whereClause);
    }

    async get(id) {
        const results = await this.db(this.tableName).where({ id });
        return results[0];
    }

    async create(data) {
        const results = await this.db(this.tableName).insert(data).returning('*');
        return results[0];
    }

    async update(id, properties) {
        const results = await this.db(this.tableName)
            .where({ id })
            .update({ ...properties, updated_at: new Date() })
            .returning('*');
        return results[0];
    }

    async delete(id) {
        // If table has deleted_at, do soft delete, otherwise hard delete
        if (await this.hasColumn('deleted_at')) {
            return this.update(id, { deleted_at: new Date() });
        }
        const results = await this.db(this.tableName)
            .where({ id })
            .del()
            .returning('*');
        return results[0];
    }

    // Helper method to check if a column exists
    async hasColumn(columnName) {
        const hasColumn = await this.db.schema.hasColumn(this.tableName, columnName);
        return hasColumn;
    }

    // Optional: Add pagination
    async paginate(page = 1, perPage = 10, whereClause = {}) {
        const offset = (page - 1) * perPage;
        const query = this.db(this.tableName);

        if (await this.hasColumn('deleted_at')) {
            query.where({ deleted_at: null });
        }

        const [count] = await query.clone().count();
        const data = await query
            .where(whereClause)
            .offset(offset)
            .limit(perPage);

        return {
            data,
            pagination: {
                total: parseInt(count.count),
                perPage,
                currentPage: page,
                lastPage: Math.ceil(count.count / perPage)
            }
        };
    }
}

module.exports = BaseModel; 