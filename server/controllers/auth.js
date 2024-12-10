const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const users = require('../database/user-queries.js');
const addErrorReporting = require('../utils/addErrorReporting.js');
const userSchema = require('../schemas/user.schema.js');
const signinSchema = require('../schemas/sign-in.schema.js');

async function signup(req, res) {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).send({
            error: "Invalid signup data",
            details: result.error.issues
        });
    }

    // Check if user already exists
    const existingUser = await users.getByEmail(result.data.email);
    if (existingUser) {
        return res.status(409).send({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    // Create user
    const userData = {
        ...result.data,
        password: hashedPassword
    };

    const user = await users.create(userData);

    // Generate JWT
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            organization_id: user.organization_id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    // Remove password from response
    delete user.password;

    return res.status(201).send({ user, token });
}

async function signin(req, res) {
    const result = signinSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).send({
            error: "Invalid signin data",
            details: result.error.issues
        });
    }

    // Find user
    const user = (await users.getByEmail(result.data.email))[0];
    if (!user) {
        return res.status(401).send({ error: "Invalid email or password" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(result.data.password, user.password);
    if (!validPassword) {
        return res.status(401).send({ error: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            organization_id: user.organization_id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    // Remove password from response
    delete user.password;

    return res.send({ user, token });
}

const toExport = {
    signup: { method: signup, errorMessage: "Could not complete signup" },
    signin: { method: signin, errorMessage: "Could not complete signin" }
};

for (let route in toExport) {
    toExport[route] = addErrorReporting(toExport[route].method, toExport[route].errorMessage);
}

module.exports = toExport; 