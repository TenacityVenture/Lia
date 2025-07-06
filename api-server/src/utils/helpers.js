const supabase = require('../utils/supabaseClient');

/**
 * 
 * @param {Object} req 
 * @returns 
 * This function determines the OpenAI model to use based on the user's plan.
 * If the user has a 'pro' plan, it returns 'gpt-4.
 */
exports.getModel = (req) => {
    const userId = req.user.sub;

    const { data, error } = supabase
        .from('users')
        .select('plan')
        .eq('id', userId)
        .single();
    
    if (error || !data) {
        console.error('Error fetching user plan:', error);
        return 'gpt-3.5-turbo'; // Default to gpt-3.5-turbo if there's an error
    }

    const plan = data.plan;
    if (!plan) {
        console.warn('User plan not found, defaulting to gpt-3.5-turbo');
        return 'gpt-3.5-turbo'; // Default to gpt-3.5-turbo if plan is not found
    }
    if (plan === 'pro') {
        return 'gpt-4.1';
    }
    return 'gpt-3.5-turbo';
}