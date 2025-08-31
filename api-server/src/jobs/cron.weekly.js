const dayjs = require("dayjs");
const supabase = require("../utils/supabaseClient.js");
const { notify } = require("../services/notifier.js");
const { logger } = require("../utils/logger.js");

/**
 * Get post_rewrites count in last N days
 */
async function getPostRewritesCount(userId, sinceDate) {
  const { count, error } = await supabase
    .from("usage")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("type", "post_rewrite")
    .gte("created_at", sinceDate);

  if (error) {
    logger.error({ msg: "Error counting post_rewrites", userId, error });
    return 0;
  }
  return count || 0;
}

/**
 * Get last activity date from usage
 */
async function getLastActiveDate(userId) {
  const { data, error } = await supabase
    .from("usage")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    logger.error({ msg: "Error fetching last_active_date", userId, error });
    return null;
  }
  return data?.created_at || null;
}

/**
 * Calculate streak (consecutive days with post_rewrite)
 */
async function getStreakDays(userId) {
  const today = dayjs().startOf("day");
  let streak = 0;

  for (let i = 0; i < 30; i++) {
    const dayStart = today.subtract(i, "day").toISOString();
    const dayEnd = today.subtract(i - 1, "day").toISOString();

    const { count, error } = await supabase
      .from("usage")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("type", "post_rewrite")
      .gte("created_at", dayStart)
      .lt("created_at", dayEnd);

    if (error) {
      logger.error({ msg: "Error calculating streak", userId, error });
      break;
    }

    if (count > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Main Weekly Digest Job
 */
async function runWeeklyDigest() {
  const today = dayjs();
  const lastWeek = today.subtract(7, "day").toISOString();

  // Fetch users + prefs
  const { data: users, error } = await supabase
    .from("users")
    .select(`
      id,
      name,
      email,
      user_prefs ( weekly_digest_enabled ),
      user_stats ( trial_end_date, last_digest_sent )
    `);

  if (error) {
    logger.error({ msg: "Error fetching users", error });
    return;
  }

  const digestUsers = (users || []).filter(
    (u) => u.user_prefs?.weekly_digest_enabled
  );

  logger.info({ msg: "Weekly digest users fetched", count: digestUsers.length });

  for (const user of digestUsers) {
    try {
      // 1️⃣ Usage stats
      const post_rewrites = await getPostRewritesCount(user.id, lastWeek);
      const streak_days = await getStreakDays(user.id);
      const last_active_date = await getLastActiveDate(user.id);

      // 2️⃣ Milestones last week
      const { data: milestones, error: milestonesError } = await supabase
        .from("notifications")
        .select("title, message")
        .eq("user_id", user.id)
        .eq("type", "milestone")
        .gte("created_at", lastWeek);

      if (milestonesError) {
        logger.error({ msg: "Error fetching milestones", userId: user.id, error: milestonesError });
      }

      // 3️⃣ Trial ending soon (from user_stats)
      let trialEnding = null;
      if (user.user_stats?.trial_end_date) {
        const daysLeft = dayjs(user.user_stats.trial_end_date).diff(today, "day");
        if (daysLeft <= 3 && daysLeft >= 0) {
          trialEnding = { days_left: daysLeft };
        }
      }

      // 4️⃣ Inactivity (>= 7 days since last activity)
      let inactive = false;
      if (last_active_date) {
        const daysInactive = today.diff(dayjs(last_active_date), "day");
        if (daysInactive >= 7) inactive = true;
      }

      // Only send if we have something meaningful
      if ((milestones?.length || 0) > 0 || streak_days > 0 || trialEnding || inactive) {
        const message = `
          Hi ${user.name || "there"}! 🎉
          Last week you rewrote ${post_rewrites} posts and maintained a ${streak_days}-day streak. Keep it up!
        `;

        await notify(user.id, {
          type: "weekly_digest",
          title: "Your Weekly Lia Summary 📊",
          message,
          emailTemplate: "WEEKLY_DIGEST",
          emailData: {
            name: user.name || "there",
            post_rewrites,
            milestones,
            streaks: streak_days ? [{ days: streak_days }] : [],
            trialEnding,
            inactive,
          },
        });

        logger.info({ msg: "Weekly digest sent", userId: user.id });
      } else {
        logger.info({ msg: "Skipped digest (no activity)", userId: user.id });
      }

      // Update last_digest_sent in user_stats
      await supabase
        .from("user_stats")
        .update({ last_digest_sent: new Date().toISOString() })
        .eq("user_id", user.id);

    } catch (err) {
      logger.error({ msg: "Error processing weekly digest", userId: user.id, error: err });
    }
  }

  logger.info({ msg: "Weekly digest job completed", count: digestUsers.length });
}

runWeeklyDigest().then();