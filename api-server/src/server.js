// src/server.js
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per minute
  message: 'Too many requests, please try again later.',

  handler: (req, res, next) => {
    res.status(429).json({
      status: 'error',
      message: 'Too many requests, please try again later.',
    });
  },
})

// Middlewares
app.use(cors());
// later on i when i go production i should change the app.use(cors()) to
// app.use(cors({
//   origin: ['https://your-production-domain.com', 'chrome-extension://<my-extension-id>],
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true}))
app.use(cookieParser()); // To parse cookies
app.use(express.json()); // To parse JSON requests
app.use(limiter); // Apply rate limiting middleware
app.use(helmet()); // Set security HTTP headers

// Routes

// Prompt routes
const promptRoutes = require('./routes/promptRoutes');
app.use('/api/prompt', promptRoutes);

// User routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

// auth route
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// usage route
const usageRoutes = require('./routes/usageRoutes');
app.use('/api/usage', usageRoutes);


// Default route
app.get('/', (req, res) => {
  res.send('LIA API is live 🔥');
});

app.get('/health', (req, res) => {
  res.send('LIA API is healthy ✅');
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export the app for testing purposes
