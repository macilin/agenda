'use strict';
class User {
    constructor(name, password, email, phone) {
        this.name = name;
        this.password = password;
        this.email = email;
        if (typeof phone === 'string') {
            phone = parseInt(phone);
        }
        this.phone = phone;
    }
}

module.exports = User;