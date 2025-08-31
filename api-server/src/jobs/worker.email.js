require('dotenv').config();
const { Worker, Queue } = require("bullmq");
const { sendEmail } = require("../services/sesService.js");
const supabase = require("../utils/supabaseClient.js");
const { logger } = require("../utils/logger.js");
const {
  weeklyDigestHtml,
  trialEndingEmailHtml,
  reengageEmailHtml
} = require("../services/emailTemplates.js");
const {
  weeklyDigestText,
  trialEndingEmailText,
  reengageEmailText
} = require("../services/emailTemplates.js");

const runDailyCron = require("./cron.daily");
const runWeeklyDigest = require("./cron.weekly");

// ---------- Redis Connection ----------
const connection = { url: process.env.UPSTASH_REDIS_URL };

// ---------- Email + Cron Queue ----------
const mainQueue = new Queue("mainQueue", { connection });

// Schedule repeatable jobs
(async () => {
  // Daily cron at midnight UTC
  await mainQueue.add(
    "dailyCron",
    {},
    { repeat: { cron: "0 0 * * *" }, jobId: "dailyCron" }
  );

  // Weekly digest every Monday 08:00 UTC
  await mainQueue.add(
    "weeklyDigest",
    {},
    { repeat: { cron: "0 8 * * 1" }, jobId: "weeklyDigest" }
  );

  logger.info("✅ Repeatable cron jobs scheduled");
})();

// ---------- Worker ----------
new Worker("mainQueue", async job => {
  try {
    // ----- Cron Jobs -----
    if (job.name === "dailyCron") {
      await runDailyCron();
      logger.info("✅ Daily cron executed");
      return;
    }

    if (job.name === "weeklyDigest") {
      await runWeeklyDigest();
      logger.info("✅ Weekly digest executed");
      return;
    }

    // ----- Email Jobs -----
    const { userId, type, title, template, data } = job.data;

    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("id", userId)
      .single();

    if (error) {
      logger.error("Error fetching user for email:", error);
      return null;
    }

    if (!user) return;

    const unsubscribe_url = `${process.env.BASE_URL || 'https://getlia.live'}/unsubscribe?uid=${user.id}`;
    data.name = user.name;
    data.unsubscribe_url = unsubscribe_url;

    // Send email based on type
    if (type === 'trial_ending') {
      await sendEmail({
        to: user.email,
        subject: title,
        text: trialEndingEmailText,
        html: trialEndingEmailHtml,
        templateData: data,
        useSesTemplate: false
      });
    } else if (type === 'reengage') {
      await sendEmail({
        to: user.email,
        subject: title,
        text: reengageEmailText,
        html: reengageEmailHtml,
        templateData: data,
        useSesTemplate: false
      });
    } else if (type === 'weekly_digest') {
      await sendEmail({
        to: user.email,
        from: 'weekly-digest@getlia.live',
        subject: title,
        text: weeklyDigestText,
        html: weeklyDigestHtml,
        templateData: data,
        useSesTemplate: false
      });
    }
    logger.info(`📧 Job processed: ${type} for user ${user.id}`);
  } catch (err) {
    logger.error("Error processing job", { jobName: job.name, error: err });
  }
}, { connection });

logger.info("🚀 Main worker running…");

// ---------- Optional Heartbeat ----------
setInterval(() => {
  logger.info("💓 Worker heartbeat - still alive");
}, 60_000);
