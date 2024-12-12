const app = require('./server-config.js');

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const authMiddleware = require('./middleware/auth.middleware.js');
const managerRoleMiddleware = require('./middleware/manager-role.middleware.js');
const ownerRoleMiddleware = require('./middleware/owner-role.middleware.js');
const rlsMiddleware = require('./middleware/rls.middleware.js');

const port = process.env.PORT || 5000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', require('./routes/auth.js'));

app.use('/users', [authMiddleware, rlsMiddleware], require('./routes/users.js'));
app.use('/organizations', [authMiddleware, rlsMiddleware, ownerRoleMiddleware], require('./routes/organizations.js'));
app.use('/tasks', [authMiddleware, rlsMiddleware], require('./routes/tasks.js'));
app.use('/projects', [authMiddleware, rlsMiddleware, managerRoleMiddleware], require('./routes/projects.js'));

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;