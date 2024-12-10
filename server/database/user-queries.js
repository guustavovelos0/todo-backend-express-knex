const BaseModel = require('./BaseModel');

class User extends BaseModel {
    constructor() {
        super('users');
    }

    async getByEmail(email) {
        return this.db.table(this.tableName).where({ email });
    }
}

module.exports = new User();