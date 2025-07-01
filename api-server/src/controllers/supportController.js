const supabase = require("../utils/supabaseClient");

exports.sendMessage = async (req, res) => {
    const userId = req.user.sub; // Extract user ID from the request object
    const { message } = req.body; // message: subject, message, status, priority, email

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Validate the message
    if (!message || typeof message !== 'string' || message.trim() === '') return res.status(400).json({ error: 'Invalid support message' });

    // Ensure the message is not empty
    // Check if the message is too short
    if (message.length < 10) return res.status(400).json({ error: 'Message must be at least 10 characters long' });

    // Check if the message is too long
    if (message.length > 1000) {
        return res.status(400).json({ error: 'Message must not exceed 1000 characters' });
    }
    // Check if the message contains only allowed characters (alphanumeric, spaces, punctuation)
    const allowedCharacters = /^[a-zA-Z0-9\s.,!?'"-]+$/;
    if (!allowedCharacters.test(message)) return res.status(400).json({ error: 'Message contains invalid characters' });

    // check if message has priority, subject, status, email
    const { subject, status, priority, email } = req.body;
    if (!subject || typeof subject !== 'string' || subject.trim() === '') return res.status(400).json({ error: 'Subject is required' });
    if (!status || typeof status !== 'string' || !['open', 'closed', 'pending'].includes(status)) return res.status(400).json({ error: 'Status must be one of: open, closed, pending' });
    if (!priority || typeof priority !== 'string' || !['low', 'medium', 'high'].includes(priority)) return res.status(400).json({ error: 'Priority must be one of: low, medium, high' });
    if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email))  return res.status(400).json({ error: 'Valid email is required' });
    
    
    try {
        // Here you would typically send the message to your support system
        // For example, you might use an email service or a support ticket system
        // This is a placeholder for the actual implementation
        console.log(`User ${userId} sent message: ${message}`);

        // save the message to a database
        const { data, error } = await supabase
            .from('support_messages')
            .insert({
                user_id: userId,
                subject: subject,
                status: status,
                message: message,
                priority: priority,
                email: email
            });

        if (error) {
            console.error('Error saving support message:', error);
            return res.status(500).json({ error: 'Failed to save support message' });
        }
    
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
    }