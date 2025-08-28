const supabase = require("../utils/supabaseClient.js");
const { emailQueue } = require("../jobs/queue.js");

async function notify(userId, { type, title, message, emailTemplate, emailData = {} }) {
  // respect user prefs
  const { data: prefs } = await supabase
    .from("user_prefs")
    .select("email_enabled, inapp_enabled")
    .eq("user_id", userId)
    .single();

  if (!prefs || prefs.inapp_enabled) {
    await supabase
      .from("notifications")
      .insert([{ user_id: userId, type, title, message }]);
  }

  if (!prefs || prefs.email_enabled) {
    console.log('sending email....')
    await emailQueue.add("sendEmail", { userId, type, title, template: emailTemplate, data: emailData });
  }
}

module.exports = { notify };