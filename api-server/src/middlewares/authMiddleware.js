const jwt = require('jsonwebtoken');
const { message } = require('../controllers/chatController');
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

const checkPlan = (requiredPlan = 'free') => {
  return async (req, res, next) => {
    const user = req.user;
    const now = new Date();

    if (!user || !user.plan) {
      return res.status(401).json({ error: 'Unauthorized or missing plan', message: 'User plan not found' });
    }

    const tiers = ['free', 'standard', 'pro'];
    const currentLevel = tiers.indexOf(user.plan);
    const requiredLevel = tiers.indexOf(requiredPlan);

    // 1. Expired plan?
    const isExpired = user.plan_expires_at && new Date(user.plan_expires_at) < now;

    // 2. Trial logic: if free + not expired + requiredPlan is standard
    const isTrialValid = (
      user.plan === 'free' &&
      !isExpired &&
      requiredPlan === 'standard'
    );

    // 3. If trial is valid, allow
    if (isTrialValid) return next();

    // 4. If expired, deny
    if (isExpired) {
      return res.status(403).json({ error: 'Your expired.', message: 'Plan expired. Please upgrade.' });
    }

    // 5. If user's plan is below required level, deny
    if (currentLevel < requiredLevel) {
      return res.status(403).json({ error: `${requiredPlan} plan required`, message: `This action requires a ${requiredPlan} plan. Please upgrade.` });
    }

    // 6. Pass through
    next();
  };
};


module.exports = { authenticate, getPaypalAccessToken, checkPlan };
