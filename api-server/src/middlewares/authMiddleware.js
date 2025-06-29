const jwt = require('jsonwebtoken');
require('dotenv').config();

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET || 'a_very_secure_jwt_secret';

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: 'No token provided', message: 'No Token' });

  try {
    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);
    req.user = decoded; // attach decoded payload to request
    
    next();
  } catch (err) {
    console.error('Authentication error:', err); // Log the error for debugging
    return res.status(403).json({ error: 'Invalid or expired token', message: 'Invalid Token' });
  }
};

// get access token from PayPal
// for subsequent API calls
const getPaypalAccessToken = async () => {
  const response = await got.post(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
    },
    username: process.env.PAYPAL_CLIENT_ID,
    password: process.env.PAYPAL_CLIENT_SECRET,
    form: {
      grant_type: 'client_credentials',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusCode} ${response.statusMessage}`);
  }

  if (!response || !response.body) {
    throw new Error('No response received from PayPal');
  }

  if (response.statusCode !== 200) {
    throw new Error(`Failed to get access token: ${response.statusCode} ${response.statusMessage}`);
  }

  // Parse the response body and return the access token
  if (!response.body) {
    throw new Error('No response body received');
  }

  if (!response.body.startsWith('{')) {
    throw new Error('Invalid response body format');
  }

  return JSON.parse(response.body).access_token;
}

module.exports = { authenticate, getPaypalAccessToken };
