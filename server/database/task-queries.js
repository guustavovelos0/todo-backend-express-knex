const BaseModel = require('./BaseModel');

class Task extends BaseModel {
    constructor() {
        super('tasks');
    }

    async getByOrganizationId(organization_id) {
        return this.db(this.tableName).join('projects', 'tasks.project_id', 'projects.id')
            .where('projects.organization_id', organization_id);
    }
}

module.exports = new Task();