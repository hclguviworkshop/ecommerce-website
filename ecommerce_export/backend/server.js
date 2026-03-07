const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');
const routes = require('./routes');

// Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// General rate limiter applied to all routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.use('/api', routes);

// Serve React frontend static build
const STATIC_DIR = path.join(__dirname, 'public');
app.use(express.static(STATIC_DIR));

// Catch-all: serve index.html for client-side routing (SPA)
// Only handles non-API GET requests so API 404s are not swallowed.
app.get('*', limiter, (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'Not Found' });
  }
  res.sendFile(path.join(STATIC_DIR, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Frontend not found');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Start Server & Connect to DB
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    // Note: use { alter: true } or { force: true } during dev if needed, 
    // but typically best to use migrations in production
    await sequelize.sync(); 
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
