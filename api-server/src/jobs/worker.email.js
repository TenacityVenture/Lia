require('dotenv').config(); // Load environment variables from .env file
const { Worker } = require("bullmq"); // BullMQ for job queue processing
const { sendEmail } = require("../services/sesService.js"); // SES email sending service
const supabase = require("../utils/supabaseClient.js"); // Supabase client for DB access
const { logger } = require("../utils/logger.js"); // Logger utility
const { weeklyDigestHtml, trialEndingEmailHtml, reengageEmailHtml } = require("../services/emailTemplates.js")
const { weeklyDigestText, trialEndingEmailText, reengageEmailText } = require("../services/emailTemplates.js")

// Redis connection config for BullMQ worker
const connection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  //tls: process.env.AWS_REDIS_TLS === "true" ? {} : undefined,
};

// Email worker: processes jobs from "emailQueue"
new Worker("emailQueue", async job => {
  console.log('this is the job', job)
  console.log('job data', job.data)
  const { userId, type, title, template, data } = job.data;

  // Fetch user info from DB
  const {data: user, error} = await supabase
    .from('users')
    .select('id, email, name')
    .eq('id', userId)
    .single();

  console.log('this is the user', user)

  if (error) {
    console.error('Error fetching user for email:', error); // Log DB errors
    return null;
  }

  if (!user) return; // Skip if user not found

  // Prepare email data and send template email
  console.log('sending final email')
  // SES
  /*await sendEmail({
    to: user.email,
    templateName: template,
    templateData: data
  });*/

  // Update data to include name and unsubscribe url
  const unsubscribe_url = `${process.env.BASE_URL || 'https://getlia.live'}/unsubscribe?uid=${user.id}`;
  data.name = user.name;
  data.unsubscribe_url = unsubscribe_url;

  if (type === 'trial_ending') {
    await sendEmail({
      to: user.email,
      subject: title,
      text: trialEndingEmailText,
      html: trialEndingEmailHtml,
      templateData: data,
      useSesTemplate: false
    });
  }

  if (type === 'reengage') {
    await sendEmail({
      to: user.email,
      subject: title,
      text: reengageEmailText,
      html: reengageEmailHtml,
      templateData: data,
      useSesTemplate: false
    });
  }

  if (type === 'weekly_digest') {
    // SMTP SEND
    await sendEmail({
      to: user.email,
      from: 'weekly-digest@getlia.live',
      subject: title,
      text: weeklyDigestText,
      html: weeklyDigestHtml,
      templateData: data,
      useSesTemplate: false
      /*
        {
          name: "David",
          milestones: [{ title: "Level Up", description: "Hit 100 points" }],
          streaks: [{ days: 7 }],
          trialEnding: { days_left: 2 },
          inactive: true,
          dashboard_url: "https://getlia.live/dashboard",
        },
      */
    });
  }
}, { connection });

logger.info("Email worker running…"); // Log worker startup
