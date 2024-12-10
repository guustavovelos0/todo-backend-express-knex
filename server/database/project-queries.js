const BaseModel = require('./BaseModel');

class Project extends BaseModel {
    constructor() {
        super('projects');
    }

    async getByOrganizationId(organizationId) {
        return await this.db.query(`SELECT * FROM ${this.table} WHERE organization_id = $1`, [organizationId]);
    }
}

module.exports = new Project();