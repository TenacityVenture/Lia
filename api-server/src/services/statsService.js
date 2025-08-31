require('dotenv').config();
const dayjs = require("dayjs");
const supabase = require("../utils/supabaseClient.js");
const { notify } = require("./notifier.js");

async function ensureUserStats(userId) {
    // Get plan_expires_at from users table
    const { data: userRows, error: userErr } = await supabase
        .from("users")
        .select("plan_expires_at")
        .eq("id", userId)
        .single();

    if (userErr || !userRows) throw new Error("User not found or error fetching user");

    const trialEndDate = userRows.plan_expires_at
        ? dayjs(userRows.plan_expires_at).format("YYYY-MM-DD")
        : dayjs().add(parseInt(process.env.TRIAL_DAYS || "7"), "day").format("YYYY-MM-DD");

    // Check if user_stats exists
    const { data: statsRows, error: statsErr } = await supabase
        .from("user_stats")
        .select("user_id")
        .eq("user_id", userId);

    if (statsErr) throw new Error("Error checking user_stats");

    if (!statsRows || statsRows.length === 0) {
        const { error: insertErr } = await supabase
            .from("user_stats")
            .insert([{
                user_id: userId,
                post_rewrites: 0,
                streak_days: 0,
                last_active_date: dayjs().format("YYYY-MM-DD"),
                trial_end_date: trialEndDate
            }]);
        if (insertErr) throw new Error("Error inserting user_stats");
    }
}

async function trackRewrite(userId) {
    await ensureUserStats(userId);

    // Fetch user_stats for the user
    const { data: statsRows, error: statsErr } = await supabase
        .from("user_stats")
        .select("post_rewrites, streak_days, last_active_date")
        .eq("user_id", userId)
        .single();

    if (statsErr || !statsRows) throw new Error("Error fetching user_stats");

    const today = dayjs().format("YYYY-MM-DD");
    let newStreak = statsRows.streak_days;

    if (!statsRows.last_active_date) newStreak = 1;
    else if (dayjs(statsRows.last_active_date).isSame(dayjs(), "day")) {
        // same day, streak unchanged
    } else if (dayjs(statsRows.last_active_date).add(1, "day").isSame(dayjs(), "day")) {
        newStreak = statsRows.streak_days + 1; // consecutive
    } else {
        newStreak = 1; // broken streak
    }

    const newCount = statsRows.post_rewrites + 1;

    // Update user_stats
    const { error: updateErr } = await supabase
        .from("user_stats")
        .update({
            post_rewrites: newCount,
            streak_days: newStreak,
            last_active_date: today
        })
        .eq("user_id", userId);

    if (updateErr) throw new Error("Error updating user_stats");

    // Milestone: 10 rewrites
    if (newCount === 10) {
        await notify(userId, {
            type: "milestone",
            title: "Congrats 🎉",
            message: "You've enhanced 10 posts with LIA, keep the momentum going!",
            emailTemplate: "MILESTONE_10",
            emailData: {}
        });
    }

    // Streak: 20 days
    if (newStreak === 20) {
        await notify(userId, {
            type: "streak",
            title: "20 Days Strong 🔥",
            message: "You've been consistent for 20 days. Keep going!",
            emailTemplate: "STREAK_20",
            emailData: {}
        });
    }
}

module.exports = { trackRewrite, ensureUserStats };