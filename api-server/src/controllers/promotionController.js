const supabase = require('../utils/supabaseClient');
const { sendEmail } = require('../services/sesService');
const { influencerPromotionEmailHtml, influencerPromotionEmailText } = require('../services/emailTemplates');
/**
 * Handle influencer promotion confirmation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @return {Object} - JSON response with success or error message
 * Expected req.body: { userId, promotionCode }
 */
async function influencerPromotion(req, res) {
    const { userId, promotionCode, email } = req.body;

    if (!userId || !promotionCode || !email) {
        return res.status(400).json({ error: 'userId, promotionCode, and email are required' });
    }

    try {
        // Validate promotion code (this is a placeholder, implement your own logic)
        if (promotionCode !== 'INFLUENCER') {
            return res.status(400).json({ error: 'Invalid promotion code' });
        }

        // Fetch user
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (userError) {
            console.error('Error fetching user:', userError);
            return res.status(500).json({ error: 'Failed to fetch user' });
        }

        // Check if user is eligible for promotion  || !user.is_influencer
        if (!user) {
            return res.status(403).json({ error: 'User is not eligible for promotion' });
        }

        // Update user with promotion details
        const { error: updateError } = await supabase
            .from('users')
            .update({
                plan: 'pro',
                plan_expires_at: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000).toISOString(), // three months from now
                is_influencer: true,
            })
            .eq('id', userId);

        if (updateError) {
            console.error('Error updating user plan:', updateError);
            return res.status(500).json({ error: 'Failed to update user plan' });
        }


        // Send confirmation email
        await sendEmail({
            to: email,
            from: 'promotions@getlia.live',
            subject: 'Offer Confirmed',
            html: influencerPromotionEmailHtml,
            text: influencerPromotionEmailText,
            templateData: { 
                name: user.name || user.username || user.email || 'there', 
                dashboard_url: 'https://www.getlia.live/dashboard',
                unsubscribe_url: `${process.env.BASE_URL || 'https://getlia.live'}/unsubscribe?uid=${userId}`
             },
            useSesTemplate: false
        }
        );

        // Log the promotion confirmation
        console.log(`User ${userId} confirmed promotion with code ${promotionCode}`);

        // to supabase promotions table
        await supabase.from('promotions').insert([
            {
                user_id: userId,
                promotion_code: promotionCode,
                email: email
            }
        ]);

        // If all checks pass, confirm the promotion
        return res.json({ message: 'Promotion confirmed successfully' });
    } catch (err) {
        console.error('Error confirming promotion:', err);
        return res.status(500).json({ error: 'Failed to confirm promotion' });
    }
}
module.exports = {
    influencerPromotion,
};