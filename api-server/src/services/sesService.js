require("dotenv").config();
const {
  SESClient,
  CreateTemplateCommand,
  GetTemplateCommand,
  SendTemplatedEmailCommand,
} = require("@aws-sdk/client-ses");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const { logger } = require("../utils/logger.js");

const ses = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
  },
});

const SENDER = process.env.SES_FROM_EMAIL || "info@getlia.live";

/**
 * Ensure SES template exists (idempotent)
 */
async function createSesTemplateIfMissing(name, subject, html, text) {
  try {
    await ses.send(new GetTemplateCommand({ TemplateName: name }));
    logger.info({ msg: "SES template exists", name });
  } catch {
    await ses.send(
      new CreateTemplateCommand({
        Template: {
          TemplateName: name,
          SubjectPart: subject,
          TextPart: text,
          HtmlPart: html,
        },
      })
    );
    logger.info({ msg: "SES template created", name });
  }
}

/**
 * Send email - choose between SES templates or SMTP
 */
async function sendEmail({
  to,
  from=SENDER,
  subject,
  templateName,
  templateData,
  html,
  text,
  useSesTemplate = true,
}) {
  if (useSesTemplate) {
    // ---- SES TEMPLATED SEND ----
    const params = {
      Source: from,
      Destination: { ToAddresses: [to] },
      Template: templateName,
      TemplateData: JSON.stringify(templateData || {}),
      ConfigurationSetName: process.env.SES_CONFIGSET || undefined,
    };

    try {
      const res = await ses.send(new SendTemplatedEmailCommand(params));
      logger.info({
        msg: "SES templated email sent",
        to,
        templateName,
        messageId: res.MessageId,
      });
      return res;
    } catch (err) {
      console.error("SES templated send error:", err);
      throw err;
    }
  } else {
    // ---- SMTP RAW SEND WITH HANDLEBARS SUBSTITUTION ----
    const transporter = nodemailer.createTransport({
      host: process.env.SES_SMTP_HOST || "email-smtp.eu-west-1.amazonaws.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SES_SMTP_USER,
        pass: process.env.SES_SMTP_PASS,
      },
      tls: { rejectUnauthorized: false }, // <--- THIS fixes self-signed cert error
    });

    // Compile handlebars template if provided
    let compiledHtml = html;
    let compiledText = text;

    if (html && templateData) {
      const template = handlebars.compile(html);
      compiledHtml = template(templateData);
    }

    if (text && templateData) {
      const template = handlebars.compile(text);
      compiledText = template(templateData);
    }

    const mailOptions = {
      from: from,
      to,
      subject,
      text: compiledText,
      html: compiledHtml,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      logger.info({
        msg: "SMTP raw email sent",
        to,
        subject,
        messageId: info.messageId,
      });
      return info;
    } catch (err) {
      console.error("SMTP send error:", err);
      throw err;
    }
  }
}

module.exports = { sendEmail, createSesTemplateIfMissing };