// src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // To parse JSON requests

// Routes
const promptRoutes = require('./routes/promptRoutes');
app.use('/api/prompt', promptRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('LIA API is live 🔥');
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
