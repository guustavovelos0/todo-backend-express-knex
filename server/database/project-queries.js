const BaseModel = require('./BaseModel');

class Project extends BaseModel {
    constructor() {
        super('projects');
    }
}

module.exports = new Project();