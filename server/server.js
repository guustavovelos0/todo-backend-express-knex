const app = require('./server-config.js');

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const authMiddleware = require('./middleware/auth.js');
const managerRoleMiddleware = require('./middleware/manager-role.js');

const port = process.env.PORT || 5000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', require('./routes/auth.js'));

app.use('/users', authMiddleware, require('./routes/users.js'));
app.use('/organizations', authMiddleware, require('./routes/organizations.js'));
app.use('/tasks', authMiddleware, require('./routes/tasks.js'));
app.use('/projects', [authMiddleware, managerRoleMiddleware], require('./routes/projects.js'));

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;