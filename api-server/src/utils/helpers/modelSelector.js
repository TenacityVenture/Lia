// utils/helpers.js
const supabase = require('../supabaseClient');
const modelMap = require('./modelMap');

/**
 * Get model name based on user plan and provider.
 * Get model name based on user plan and provider.
 * @param {Object} req - Express request object
 * @param {string} provider - AI provider ('openai', 'bedrock', etc.)
 * @returns {Promise<string>} - The model name
 */
exports.getModelName = async (req, provider = 'openai') => {
  const userId = req.user?.sub;
  if (!userId) {
    console.warn('Missing user ID. Defaulting to openai:gpt-3.5-turbo');
    return modelMap[provider]?.free || 'gpt-3.5-turbo';
  }

  const { data, error } = await supabase
    .from('users')
    .select('plan')
    .eq('id', userId)
    .single();

  if (error || !data?.plan) {
    console.error('Error fetching user plan:', error);
    return modelMap[provider]?.free || 'gpt-3.5-turbo';
  }

  const plan = data.plan;
  const model = modelMap[provider]?.[plan];

  if (!model) {
    console.warn(`No model mapped for plan "${plan}" under "${provider}". Defaulting to openai free.`);
    return modelMap['openai'].free;
  }

  return model;
};
