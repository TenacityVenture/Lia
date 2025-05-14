// src/server.js
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per minute
  message: 'Too many requests, please try again later.',
})

// Middlewares
app.use(cors());
app.use(express.json()); // To parse JSON requests
app.use(limiter); // Apply rate limiting middleware


// Routes

// Prompt routes
const promptRoutes = require('./routes/promptRoutes');
app.use('/api/prompt', promptRoutes);

// User routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

// sign-in with password route
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// usage route
const usageRoutes = require('./routes/usageRoutes');
app.use('/api/usage', usageRoutes);


// Default route
app.get('/', (req, res) => {
  res.send('LIA API is live 🔥');
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
