const app = require('./server-config.js');
const usersRoutes = require('./routes/users.js');
const organizationsRoutes = require('./routes/organizations.js');
const authRoutes = require('./routes/auth.js');
const authMiddleware = require('./middleware/auth.js');
const port = process.env.PORT || 5000;

app.use('/auth', authRoutes);

app.use('/users', authMiddleware, usersRoutes);
app.use('/organizations', authMiddleware, organizationsRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;