require('dotenv').config();
const { SESClient, CreateTemplateCommand, SendTemplatedEmailCommand } = require('@aws-sdk/client-ses');
const nodemailer = require("nodemailer");
const supabase = require('../utils/supabaseClient'); // your supabase client
const { logger } = require('../utils/logger')
const { 
  welcomeEmailHtml,
  welcomeEmailText,
  passwordResetHtml,
  passwordResetText
} = require('./emailTemplates')
const { substitutePlaceholdersForValues } = require('../utils/helpers')

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
/*async function sendWelcomeEmail(user) {
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
    console.log(cmd, 'cmd')
    const res = await ses.send(cmd); // Send the email using SES
    console.log(res)

    // Log to supabase
    await supabase.from('email_logs').insert({
      user_id: user.id,
      email_to: user.email,
      template_name: 'LIA_WELCOME_TEMPLATE',
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
}*/

// Send password reset email with SMTP settings and nodemailer
async function sendWelcomeEmail(user) {
  const transporter = nodemailer.createTransport({
    host: "email-smtp.eu-west-1.amazonaws.com", // SES region
    port: 587,
    secure: false, // not ssl
    auth: {
      user: process.env.SES_SMTP_USER,
      pass: process.env.SES_SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // <--- THIS fixes self-signed cert error
    }
  })

  const templateData = {
    name: user.name || user.username || 'Friend',
    dashboard_url: `${process.env.BASE_URL || 'https://getlia.live'}/dashboard`,
    unsubscribe_url: `${process.env.BASE_URL || 'https://getlia.live'}/unsubscribe?uid=${user.id}`
  }

  const result = await substitutePlaceholdersForValues(welcomeEmailHtml, welcomeEmailText, templateData)

  const text = result.text;
  const html = result.html;

  const mailOptions = {
    from: "welcome@getlia.live", // must be a verified identity
    to: user.email,
    subject: "Welcome to LIA!🚀",
    text: text,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info({from: mailOptions.from, to: mailOptions, subject: mailOptions.subject}, msg=`SMTP Email sent: ${info.messageId}`)

    // log to db
    // Log to supabase
    await supabase.from('email_logs').insert({
      user_id: user.id,
      email_to: user.email,
      template_name: 'LIA_WELCOME_TEMPLATE',
      template_data: mailOptions,
      message_id: info.messageId,
      status: 'sent',
      response: info
    });
    return info;
  } catch (err) {
    logger.error({message: "SMTP send Error", error: err})

    await supabase.from('email_logs').insert({
      user_id: user.id,
      email_to: user.email,
      template_name: 'LIA_WELCOME_TEMPLATE',
      template_data: mailOptions,
      status: 'failed',
      response: { message: err?.message }
    });
    throw err;
  }
}

// Password reset email using SES
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

// This function sends a password reset email using SMTP
async function sendPasswordResetEmail(user, token) {
  const transporter = nodemailer.createTransport({
    host: "email-smtp.eu-west-1.amazonaws.com", // SES region
    port: 587,
    secure: false, // not ssl
    auth: {
      user: process.env.SES_SMTP_USER,
      pass: process.env.SES_SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // <--- THIS fixes self-signed cert error
    },
  });

  const resetUrl = `${process.env.BASE_URL || "https://getlia.live"}/reset-password?token=${token}`;

  const {html, text} = substitutePlaceholdersForValues(passwordResetHtml, passwordResetText, {user, reset_url: resetUrl})
  const mailOptions = {
    from: "password-reset@getlia.live", // must be a verified identity
    to: user.email,
    subject: "Password Reset Request",
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info({from: mailOptions.from, to: mailOptions, subject: mailOptions.subject}, msg=`SMTP Email sent: ${info.messageId}`)

    // log to db
    // Log to supabase
    await supabase.from('email_logs').insert({
      user_id: user.id,
      email_to: user.email,
      template_name: 'LIA_PASSWORD_RESET',
      template_data: mailOptions,
      message_id: info.messageId,
      status: 'sent',
      response: info
    });
    return info;
  } catch (err) {
    logger.error({message: "SMTP send Error", error: err})

    await supabase.from('email_logs').insert({
      user_id: user.id,
      email_to: user.email,
      template_name: 'LIA_PASSWORD_RESET',
      template_data: mailOptions,
      status: 'failed',
      response: { message: err?.message }
    });
    throw err;
  }
}


module.exports = {
  createTemplateIfNotExists,
  sendWelcomeEmail,
  sendPasswordResetEmail
};
