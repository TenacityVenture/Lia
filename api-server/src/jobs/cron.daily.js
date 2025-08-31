const dayjs = require("dayjs");
const supabase = require("../utils/supabaseClient.js");
const { notify } = require("../services/notifier.js");
const { logger } = require("../utils/logger.js");

async function run() {
  const today = dayjs().startOf("day");
  const dashboard_url = `${process.env.BASE_URL || 'https://getlia.live'}/dashboard`

  // 1️⃣ Fetch all user_stats
  const { data: statsRows, error: statsError } = await supabase
    .from("user_stats")
    .select("user_id, trial_end_date, last_active_date");

  if (statsError) {
    logger.error({ msg: "Error fetching user_stats", error: statsError });
    return;
  }

  // 2️⃣ Fetch all user_prefs
  const { data: prefsRows, error: prefsError } = await supabase
    .from("user_prefs")
    .select("user_id, email_enabled, inapp_enabled, weekly_digest_enabled");

  if (prefsError) {
    logger.error({ msg: "Error fetching user_prefs", error: prefsError });
    return;
  }

  // Merge stats + prefs per user
  const users = statsRows.map(stat => {
    const prefs = prefsRows.find(p => p.user_id === stat.user_id) || {};
    return {
      ...stat,
      ...prefs
    };
  });

  let trialCount = 0;
  let reengageCount = 0;

  for (const user of users) {
    // ✅ Trial ending in 3 days
    if (user.trial_end_date) {
      const daysLeft = dayjs(user.trial_end_date).diff(today, "day");
      if (daysLeft === 3 && user.email_enabled) {
        await notify(user.user_id, {
          type: "trial_ending",
          title: "Your trial ends soon ⏳",
          message: `Your trial ends in ${daysLeft} days. Upgrade to keep going.`,
          emailTemplate: "TRIAL_ENDING",
          emailData: { days_left: daysLeft, dashboard_url }
        });
        trialCount++;
      }
    }

    // ✅ Re-engagement (inactive > 7 days)
    if (user.last_active_date) {
      const daysInactive = today.diff(dayjs(user.last_active_date), "day");
      if (daysInactive > 7 && user.email_enabled) {
        await notify(user.user_id, {
          type: "reengage",
          title: "We miss you 💌",
          message: "Haven't seen you in a while. Try an AI Rewrite today.",
          emailTemplate: "REENGAGE",
          emailData: { dashboard_url }
        });
        reengageCount++;
      }
    }
  }

  logger.info({
    msg: "Daily cron complete",
    trials: trialCount,
    reengage: reengageCount
  });
}

run().then(() => process.exit(0));