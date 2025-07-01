/**
 * 
 * @param {Object} req 
 * @returns 
 * This function determines the OpenAI model to use based on the user's plan.
 * If the user has a 'pro' plan, it returns 'gpt-4.
 */
exports.getModel = (req) => {
    const plan = req.user?.plan;
    if (plan === 'pro') {
        return 'gpt-4.1';
    }
    return 'gpt-3.5-turbo';
}