// src/server.js
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { createEmailTemplates } = require('./utils/helpers/createEmailTemplate'); // Create email templates  
const app = express();

// tells express not to ignore the X-Forwarded-For header, which is important for rate limiting and security
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // trust first proxy
} else {
  app.set('trust proxy', false); // local dev, don't trust
}

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
//app.use(cors());
// Enable CORS for specific origins
const extensionIds = process.env.LOCAL_IDS ? process.env.LOCAL_IDS.split(',') : [];
const extensionOrigins = extensionIds.map(id => `chrome-extension://${id.trim()}`);

app.use(cors({
  origin: [
    'https://www.getlia.live',
    `chrome-extension://${process.env.EXTENSION_ID}`, // main extension id
    ...extensionOrigins, // for development (my team will have different id for the same extension because they'll all have it locally)
    'http://localhost:3000',
    'https://www.linkedin.com'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

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

// Chat routes
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

// Paypal routes
const paypalRoutes = require('./routes/paypalRoutes');
app.use('/api/paypal', paypalRoutes);

// support routes
const supportRoutes = require('./routes/supportRoutes');
app.use('/api/support', supportRoutes);

// tts - aws text to speech routes
const ttsRoutes = require('./routes/ttsRoutes');
app.use('/api/tts', ttsRoutes);

// note routes
const noteRoutes = require('./routes/noteRoutes');  
app.use('/api/note', noteRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('LIA API is live 🔥');
});

app.get('/health', (req, res) => {
  res.send('LIA API is healthy ✅');
});

// Debug route - especially useful for checking cookies and body
// This route can be used to debug issues with cookies or request body
app.get('/debug-token', (req, res) => {
  res.json({
    cookies: req.cookies,
    body: req.body,
  });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  console.log('Creating email templates if they do not exist...');
  try {
    console.log('Checking SES email templates...');
    //if (process.env.NODE_ENV === 'production') {
    await createEmailTemplates();
    //}
    console.log('✅ Email templates are ready.');
  } catch (err) {
    console.error('⚠️ Failed to verify/create SES templates:', err.message);
  }
});

module.exports = app; // Export the app for testing purposes
