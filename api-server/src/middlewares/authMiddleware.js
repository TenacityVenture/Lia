const jwt = require('jsonwebtoken');
const supabase = require('../utils/supabaseClient');
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

const checkPlan = (requiredPlan = 'free') => {
  return async (req, res, next) => {
    const user = req.user;
    const now = new Date();

    // Check if user is authenticated
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized or missing plan', message: 'User plan not found' });
    }

    // get the associate user in the users table
    // which has the plan field
    const { data: userData, error } = await supabase // actual user in users table
      .from('users')
      .select('plan, plan_expires_at')
      .eq('id', user.sub) // assuming user.sub is the user ID
      .single();
    
    if (error || !userData || userData.length === 0) {
      return res.status(401).json({ error: 'Unauthorized or missing plan', message: 'User plan not found in database' });
    }

    const tiers = ['free', 'standard', 'pro'];
    const currentLevel = tiers.indexOf(userData.plan);
    const requiredLevel = tiers.indexOf(requiredPlan);

    // 1. Expired plan?
    const isExpired = userData.plan_expires_at && new Date(userData.plan_expires_at) < now;

    // 2. Trial logic: if free + not expired + requiredPlan is standard
    const isTrialValid = (
      userData.plan === 'free' &&
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
