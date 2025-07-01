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
  const base64Credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Authorization': `Basic ${base64Credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new Error('No access token received from PayPal');
  }

  return data.access_token;
}

module.exports = { authenticate, getPaypalAccessToken };
