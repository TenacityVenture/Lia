const { createTemplateIfNotExists } = require('../../services/emailService'); // Ensure email templates are created

const welcomeToLiaHtml = `<!doctype html>
<html>
  <body>
    <h1>Welcome to LIA, {{name}} 👋</h1>
    <p>Thanks for joining LIA — your LinkedIn AI assistant.</p>

    <p>Get started:</p>
    <ul>
      <li><a href="{{dashboard_url}}">Open Dashboard</a></li>
      <li>Tip: Try <strong>Rewrite post</strong> on your next post!</li>
    </ul>

    <p>If you want to opt out of marketing emails, <a href="{{unsubscribe_url}}">click here</a>.</p>

    <p>— David & the LIA team</p>
  </body>
</html>
`;

const welcomeToLiaText = `Welcome to LIA, {{name}} 👋
Thanks for joining LIA — your LinkedIn AI assistant.
Get started:
- Open Dashboard: {{dashboard_url}}
- Tip: Try "Rewrite post" on your next post!
If you want to opt out of marketing emails, click here: {{unsubscribe_url}}
— David & the LIA team
`;

const passwordResetHtml = `<!doctype html>
<html>
    <body>
        <h1>Password Reset Request</h1>
        <p>Hi {{name}},</p>
        <p>We received a request to reset your password. You can reset it by clicking the link below:</p>
        <p><a href="{{reset_url}}">Reset Password</a></p>
        <p>If you did not request this, please ignore this email.</p>
        <p>If you wish to unsubscribe from our emails, please click <a href="{{unsubscribe
_url}}">here</a>.</p>
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

