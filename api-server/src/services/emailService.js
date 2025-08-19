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
    Source: process.env.SES_FROM_EMAIL, // "LIA <hello@getlia.live>" - verified domain
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

// Password reset email example
async function sendPasswordResetEmail(user, token) {
  const templateData = {
    name: user.name || user.username || 'Friend',
    reset_url: `${process.env.BASE_URL || 'https://getlia.live'}/reset-password?token=${token}`,
    unsubscribe_url: `${process.env.BASE_URL || 'https://getlia.live'}/unsubscribe?uid=${user.id}`
  };

  const params = {
    Destination: { ToAddresses: [user.email] },
    Source: process.env.SES_FROM_EMAIL,
    Template: 'LIA_PASSWORD_RESET', // created programmatically in SES
    TemplateData: JSON.stringify(templateData),
    ConfigurationSetName: process.env.SES_CONFIGSET || undefined // if you use configuration sets for sending metrics
  };

  try {
    const cmd = new SendTemplatedEmailCommand(params);
    const res = await ses.send(cmd);
    console.log(res, 'this is the response from SES');
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
}

module.exports = {
  createTemplateIfNotExists,
  sendWelcomeEmail,
  sendPasswordResetEmail
};
