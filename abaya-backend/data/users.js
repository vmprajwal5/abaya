const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123', // Will be hashed by User model pre-save hook if using User.create
        isAdmin: true,
    },
    {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        isAdmin: false,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        isAdmin: false,
    },
];

module.exports = users;
