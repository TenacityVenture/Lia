const { createTemplateIfNotExists } = require('../../services/emailService'); // Ensure email templates are created

const welcomeToLiaHtml = `<!doctype html>
<html>
  <body style="font-family:Arial, sans-serif; background:#f9f9f9; margin:0; padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9; padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:30px; text-align:left;">
            <tr>
              <td>
                <h1 style="color:#333333;">Welcome to LIA, {{name}} 👋</h1>
                <p style="color:#555555; font-size:15px; line-height:1.6;">
                  Thanks for joining <strong>LIA</strong> — your LinkedIn Intelligent Assistant.
                  We're excited to help you enhance your LinkedIn experience with AI 🚀.
                </p>

                <!-- CTA BUTTON -->
                <p style="text-align:center; margin:30px 0;">
                  <a href="{{dashboard_url}}" 
                     style="background:#4f46e5; color:#ffffff; text-decoration:none; 
                            padding:12px 24px; border-radius:6px; font-weight:bold; display:inline-block;">
                    Open Your Dashboard
                  </a>
                </p>

                <p style="color:#555555; font-size:15px; line-height:1.6;">
                  Here are some quick ways to get started:
                </p>
                <ul style="color:#555555; font-size:15px; line-height:1.6;">
                  <li>📺 Watch this <a href="https://www.youtube.com/watch?v=example" style="color:#4f46e5;">1-Minute Video</a></li>
                  <li>💡 Try <strong>AI Rewrite</strong> on your next post</li>
                  <li>💬 Use <strong>AI Reply</strong> to respond thoughtfully to comments</li>
                </ul>

                <p style="color:#555555; font-size:15px; line-height:1.6;">
                  More resources to help you get the most out of LIA:
                </p>
                <ul style="color:#555555; font-size:15px; line-height:1.6;">
                  <li><a href="https://docs.getlia.live" style="color:#4f46e5;">Documentation</a></li>
                  <li><a href="https://www.linkedin.com/company/getlia" style="color:#4f46e5;">LinkedIn</a></li>
                  <li><a href="https://discord.gg/getlia" style="color:#4f46e5;">Discord Community</a></li>
                  <li><a href="https://twitter.com/getlia" style="color:#4f46e5;">Twitter</a></li>
                  <li><a href="https://www.youtube.com/@getlia" style="color:#4f46e5;">YouTube</a></li>
                  <li><a href="https://www.getlia.live/blog" style="color:#4f46e5;">Blog</a></li>
                </ul>

                <p style="color:#555555; font-size:15px; line-height:1.6;">
                  — David & the LIA Team
                </p>

                <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />

                <p style="font-size:12px; color:#888888; text-align:center;">
                  If you prefer not to receive updates, you can 
                  <a href="{{unsubscribe_url}}" style="color:#888888;">unsubscribe here</a>.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const welcomeToLiaText = `Welcome to LIA, {{name}} 👋

Thanks for joining LIA — your LinkedIn Intelligent Assistant.
We’re excited to help you enhance your LinkedIn experience with AI 🚀.

👉 Get started here: {{dashboard_url}}

Quick Start:
- Watch a 1-Minute Video: https://www.youtube.com/watch?v=example
- Try "AI Rewrite" on your next post
- Use "AI Reply" to respond thoughtfully to comments

More Resources:
- Docs: https://docs.getlia.live
- LinkedIn: https://www.linkedin.com/company/getlia
- Discord: https://discord.gg/getlia
- Twitter: https://twitter.com/getlia
- YouTube: https://www.youtube.com/@getlia
- Blog: https://www.getlia.live/blog

— David & the LIA Team

If you prefer not to receive updates, unsubscribe here: {{unsubscribe_url}}
`;

const passwordResetHtml = `<!doctype html>
<html>
    <body>
        <h1>Password Reset Request</h1>
        <p>Hi {{name}},</p>
        <p>We received a request to reset your password. You can reset it by clicking the link below:</p>
        <p><a href="{{reset_url}}">Reset Password</a></p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,<br/>The LIA Team</p>
    </body>
</html>
`;

const passwordResetText = `Hi {{name}},
We received a request to reset your password. You can reset it by clicking the link below:
{{reset_url}}
If you did not request this, please ignore this email.
If you wish to unsubscribe from our emails, please click here: {{unsubscribe_url}}.
Best regards,
The LIA Team
`;

// Export the function to create email templates
// This allows it to be used in other parts of the application if needed
exports.createEmailTemplates = async () => {
  try {
    await createTemplateIfNotExists(
      'LIA_WELCOME_TEMPLATE',
      welcomeToLiaHtml,
      welcomeToLiaText,
      'Welcome to LIA!'
    );
    console.log('Welcome email template created successfully');

    await createTemplateIfNotExists(
      'LIA_PASSWORD_RESET',
      passwordResetHtml,
      passwordResetText,
      'Password Reset Request'
    );
    console.log('Password reset email template created successfully');
  } catch (error) {
    console.error('Error creating email templates:', error);
  }
};

