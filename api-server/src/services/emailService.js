require('dotenv').config();
const { SESClient, CreateTemplateCommand, SendTemplatedEmailCommand } = require('@aws-sdk/client-ses');
const supabase = require('../utils/supabaseClient'); // your supabase client

const ses = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
  }
});

// create template programmatically (run once or on deploy - currently it's run on every server start - server.js)
async function createTemplateIfNotExists(templateName, html, text, subject) {
  try {
    const tpl = {
      Template: {
        TemplateName: templateName,
        SubjectPart: subject,
        HtmlPart: html,
        TextPart: text,
      }
    };
    const cmd = new CreateTemplateCommand(tpl);
    await ses.send(cmd);
    console.log('Template created', templateName);
  } catch (err) {
    // If template exists, CreateTemplateCommand will error - ignore if exists
    if (
      err.name === "TemplateNameAlreadyExists" ||
      err.name === "AlreadyExists"
    ) {
      console.log(`Template already exists: ${templateName}`);
      return;
    }
    console.warn('CreateTemplate error (ok to ignore if already exists):', err.message);
  }
}

// Send templated welcome email
async function sendWelcomeEmail(user) {
  // We respect marketing preference for marketing content only.
  // But welcome emails are transactional — send regardless.
  const templateData = {
    name: user.name || user.username || 'Friend',
    dashboard_url: `${process.env.BASE_URL || 'https://getlia.live'}/dashboard`,
    unsubscribe_url: `${process.env.BASE_URL || 'https://getlia.live'}/unsubscribe?uid=${user.id}`
  };

  const params = {
    Destination: { ToAddresses: [user.email] },
    Source: "hello@getlia.live", // "LIA <hello@getlia.live>" - verified domain
    Template: 'LIA_WELCOME_TEMPLATE', // must match template name in SES
    TemplateData: JSON.stringify(templateData),
    ConfigurationSetName: process.env.SES_CONFIGSET || undefined // configuration sets for sending metrics
  };

  try {
    const cmd = new SendTemplatedEmailCommand(params); // SendTemplatedEmailCommand is used to send templated emails
    const res = await ses.send(cmd); // Send the email using SES

    // Log to supabase
    await supabase.from('email_logs').insert({
      user_id: user.id,
      email_to: user.email,
      template_name: 'welcome',
      template_data: templateData,
      message_id: res.MessageId,
      status: 'sent',
      response: res
    });

    return res;
  } catch (err) { // still log the error to supabase
    console.error('SES send error:', err);
    await supabase.from('email_logs').insert({
      user_id: user.id,
      email_to: user.email,
      template_name: 'welcome',
      template_data: templateData,
      status: 'failed',
      response: { message: err.message }
    });
    throw err;
  }
}

// Password reset email example using SES
/*async function sendPasswordResetEmail(user, token) {
  const templateData = {
    name: user.name || user.username || 'Friend',
    reset_url: `${process.env.BASE_URL || 'https://getlia.live'}/reset-password?token=${token}`,
    //unsubscribe_url: `${process.env.BASE_URL || 'https://getlia.live'}/unsubscribe?uid=${user.id}`
  };

  const params = {
    Destination: { ToAddresses: [user.email] },
    Source: 'hello@getlia.live',
    Template: 'LIA_PASSWORD_RESET', // created programmatically in SES
    TemplateData: JSON.stringify(templateData),
    ConfigurationSetName: process.env.SES_CONFIGSET || undefined // if you use configuration sets for sending metrics
  };

  try {
    const cmd = new SendTemplatedEmailCommand(params);
    const res = await ses.send(cmd);
    await supabase.from('email_logs').insert({
      user_id: user.id,
      email_to: user.email,
      template_name: 'password_reset',
      template_data: templateData,
      message_id: res.MessageId,
      status: 'sent',
      response: res
    });
    return res;
  } catch (err) {
    console.error('SES password reset error', err);
    await supabase.from('email_logs').insert({
      user_id: user.id,
      email_to: user.email,
      template_name: 'password_reset',
      status: 'failed',
      response: { message: err.message }
    });
    throw err;
  }

  // USING SMTP
}*/

const nodemailer = require("nodemailer");
const passwordResetHtml = (user, resetUrl) => {
  return `<!doctype html>
<html>
    <body>
        <h1>Password Reset Request</h1>
        <p>Hi ${user.name || "Friend"},</p>
        <p>We received a request to reset your password. You can reset it by clicking the link below:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,<br/>The LIA Team</p>
    </body>
</html>`;
}

const passwordResetText = (user, resetUrl) => {
  return `Hi ${user.name || "Friend"},
We received a request to reset your password. You can reset it by clicking the link below:
${resetUrl}
If you did not request this, please ignore this email.
Best regards,
The LIA Team`
};

// This function sends a password reset email using SMTP
async function sendPasswordResetEmail(user, token) {
  const transporter = nodemailer.createTransport({
  host: "email-smtp.eu-west-1.amazonaws.com", // your SES region
  port: 587,
  secure: false, // use TLS (587) not SSL
  auth: {
    user: process.env.SES_SMTP_USER,
    pass: process.env.SES_SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // <--- THIS fixes self-signed cert error
  },
});

  const resetUrl = `${process.env.BASE_URL || "https://getlia.live"}/reset-password?token=${token}`;

  const mailOptions = {
    from: "password-reset@getlia.live", // must be a verified identity
    to: user.email,
    subject: "Password Reset",
    text: passwordResetText(user, resetUrl),
    html: passwordResetHtml(user, resetUrl),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("SMTP Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("SMTP send error:", err);
    throw err;
  }
}


module.exports = {
  createTemplateIfNotExists,
  sendWelcomeEmail,
  sendPasswordResetEmail
};
