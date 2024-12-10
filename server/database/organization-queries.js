const BaseModel = require('./BaseModel');

class Organization extends BaseModel {
    constructor() {
        super('organizations');
    }
}

module.exports = new Organization();