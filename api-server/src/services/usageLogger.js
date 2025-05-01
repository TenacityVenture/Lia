// src/services/usageLogger.js
const supabase = require('../utils/supabaseClient');

exports.log = async ({ userId, type, original_text, suggested_text, token_used = 0 }) => {
  const { error } = await supabase
    .from('usage')
    .insert([
      {
        user_id: userId,
        type,
        original_text,
        suggested_text,
        token_used
      }
    ]);

  if (error) console.error('Usage logging error:', error.message);
};
