const { createSesTemplateIfMissing } = require("./sesService.js")

const baseFooter = `
<p style="color:#667085;font-size:12px;margin-top:24px;">
  You're receiving this because you use LIA. 
  <br/>To manage preferences, visit your dashboard.
</p>
`;

const welcomeEmailHtml = `<!doctype html>
<html>
  <body style="font-family:Arial, sans-serif; background:#f9f9f9; margin:0; padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9; padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:30px; text-align:left;">
            <tr>
              <td>
                <h1 style="color:#333333;">Welcome to LIA, {{name}} 👋</h1>
                <p style="color:#555555; font-size:15px; line-height:1.6;">
                  Thanks for joining <strong>LIA</strong> — your LinkedIn Intelligent Assistant.
                  We're excited to help you enhance your LinkedIn experience with AI 🚀.
                </p>

                <!-- CTA BUTTON -->
                <p style="text-align:center; margin:30px 0;">
                  <a href="{{dashboard_url}}" 
                     style="background:#4f46e5; color:#ffffff; text-decoration:none; 
                            padding:12px 24px; border-radius:6px; font-weight:bold; display:inline-block;">
                    Open Your Dashboard
                  </a>
                </p>

                <p style="color:#555555; font-size:15px; line-height:1.6;">
                  Here are some quick ways to get started:
                </p>
                <ul style="color:#555555; font-size:15px; line-height:1.6;">
                  <li>📺 Watch this <a href="https://www.youtube.com/watch?v=example" style="color:#4f46e5;">1-Minute Video</a></li>
                  <li>💡 Try <strong>AI Rewrite</strong> on your next post</li>
                  <li>💬 Use <strong>AI Reply</strong> to respond thoughtfully to comments</li>
                </ul>

                <p style="color:#555555; font-size:15px; line-height:1.6;">
                  More resources to help you get the most out of LIA:
                </p>
                <ul style="color:#555555; font-size:15px; line-height:1.6;">
                  <li><a href="https://docs.getlia.live" style="color:#4f46e5;">Documentation</a></li>
                  <li><a href="https://www.linkedin.com/company/getlia" style="color:#4f46e5;">LinkedIn</a></li>
                  <li><a href="https://discord.gg/getlia" style="color:#4f46e5;">Discord Community</a></li>
                  <li><a href="https://twitter.com/getlia" style="color:#4f46e5;">Twitter</a></li>
                  <li><a href="https://www.youtube.com/@getlia" style="color:#4f46e5;">YouTube</a></li>
                  <li><a href="https://www.getlia.live/blog" style="color:#4f46e5;">Blog</a></li>
                </ul>

                <p style="color:#555555; font-size:15px; line-height:1.6;">
                  — David & the LIA Team
                </p>

                <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />

                <p style="font-size:12px; color:#888888; text-align:center;">
                  If you prefer not to receive updates, you can 
                  <a href="{{unsubscribe_url}}" style="color:#888888;">unsubscribe here</a>.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
const welcomeEmailText = `Welcome to LIA, {{name}} 👋

Thanks for joining LIA — your LinkedIn Intelligent Assistant.
We're excited to help you enhance your LinkedIn experience with AI 🚀.

👉 Get started here: {{dashboard_url}}

Quick Start:
- Watch a 1-Minute Video: https://www.youtube.com/watch?v=example
- Try "AI Rewrite" on your next post
- Use "AI Reply" to respond thoughtfully to comments

More Resources:
- Docs: https://docs.getlia.live
- LinkedIn: https://www.linkedin.com/company/getlia
- Discord: https://discord.gg/getlia
- Twitter: https://twitter.com/getlia
- YouTube: https://www.youtube.com/@getlia
- Blog: https://www.getlia.live/blog

— David & the LIA Team

If you prefer not to receive updates, unsubscribe here: {{unsubscribe_url}}
`

const passwordResetHtml = `<!doctype html>
<html>
    <body>
        <h1>Password Reset Request</h1>
        <p>Hi {{name}},</p>
        <p>We received a request to reset your password. You can reset it by clicking the link below:</p>
        <p><a href="{{reset_url}}">Reset Password</a></p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,<br/>The LIA Team</p>
    </body>
</html>
`;

const passwordResetText = `Hi {{name}},
We received a request to reset your password. You can reset it by clicking the link below:
{{reset_url}}
If you did not request this, please ignore this email.
If you wish to unsubscribe from our emails, please click here: {{unsubscribe_url}}.
Best regards,
The LIA Team
`;

const weeklyDigestHtml = `<!doctype html>
    <html>
      <body style="font-family:Arial, sans-serif; background:#f9f9f9; margin:0; padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:30px; text-align:left;">
                <tr><td>
                  <h1 style="color:#333;">Hey {{name}}, here's what happened this week! 🚀</h1>
                  <p style="color:#555; font-size:15px; line-height:1.6;">
                    A quick recap of your activity and achievements with LIA.
                  </p>

                  <!-- Milestones Section -->
                  {{#if milestones}}
                  <h2 style="color:#333; margin-top:20px;">🎯 Milestones</h2>
                  <ul style="color:#555; font-size:15px; line-height:1.6;">
                    {{#each milestones}}
                      <li>🎉 {{title}} — {{description}}</li>
                    {{/each}}
                  </ul>
                  {{/if}}

                  <!-- Streaks Section -->
                  {{#if streaks}}
                  <h2 style="color:#333; margin-top:20px;">🔥 Streaks</h2>
                  <ul style="color:#555; font-size:15px; line-height:1.6;">
                    {{#each streaks}}
                      <li>{{days}}-day streak — Keep it going!</li>
                    {{/each}}
                  </ul>
                  {{/if}}

                  <!-- Trial / Upsell Section -->
                  {{#if trialEnding}}
                  <h2 style="color:#333; margin-top:20px;">⏳ Trial Ending Soon</h2>
                  <p style="color:#555; font-size:15px; line-height:1.6;">
                    Your trial ends in {{trialEnding.days_left}} days. Upgrade now to keep creating with LIA.
                  </p>
                  <p style="text-align:center; margin:20px 0;">
                    <a href="{{dashboard_url}}" style="background:#4f46e5; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:bold; display:inline-block;">
                      Upgrade Now
                    </a>
                  </p>
                  {{/if}}

                  <!-- Re-engagement Section -->
                  {{#if inactive}}
                  <h2 style="color:#333; margin-top:20px;">💌 Stay Active</h2>
                  <p style="color:#555; font-size:15px; line-height:1.6;">
                    We noticed you haven't used LIA in a while. Try a rewrite today to boost your LinkedIn presence.
                  </p>
                  <p style="text-align:center; margin:20px 0;">
                    <a href="{{dashboard_url}}" style="background:#4f46e5; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:bold; display:inline-block;">
                      Try AI Rewrite
                    </a>
                  </p>
                  {{/if}}

                  ${baseFooter}
                </td></tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`
const weeklyDigestText = `Your weekly LIA digest: {{#if milestones}}{{#each milestones}}{{title}}, {{/each}}{{/if}}{{#if streaks}}{{#each streaks}}{{days}}-day streak, {{/each}}{{/if}}`;

const mileStone10EmailHtml = `<!doctype html>
    <html>
      <body style="font-family:Arial, sans-serif; background:#f9f9f9; margin:0; padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:30px; text-align:left;">
                <tr><td>
                  <h1 style="color:#333;">Congrats, {{name}}! 🎉</h1>
                  <p style="color:#555; font-size:15px; line-height:1.6;">
                    You've enhanced 10 posts with LIA. Keep the momentum going!
                  </p>
                  <p style="text-align:center; margin:30px 0;">
                    <a href="{{dashboard_url}}" style="background:#4f46e5; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:bold; display:inline-block;">
                      View Your Progress
                    </a>
                  </p>
                  ${baseFooter}
                </td></tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`
const mileStone10EmailText = `Congrats, {{name}}! You've enhanced 10 posts with LIA. Keep going!`;

const streak20EmailHtml = `<!doctype html>
    <html>
      <body style="font-family:Arial, sans-serif; background:#f9f9f9; margin:0; padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:30px; text-align:left;">
                <tr><td>
                  <h1 style="color:#333;">You're on fire, {{name}}! 🔥</h1>
                  <p style="color:#555; font-size:15px; line-height:1.6;">
                    You've been consistent for 20 days using LIA — keep your LinkedIn momentum strong!
                  </p>
                  <p style="text-align:center; margin:30px 0;">
                    <a href="{{dashboard_url}}" style="background:#4f46e5; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:bold; display:inline-block;">
                      See Your Streak
                    </a>
                  </p>
                  ${baseFooter}
                </td></tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`
const streak20EmailText = `You're on fire, {{name}}! 20-day LinkedIn streak achieved! Keep it going.`

const trialEndingEmailHtml = `<!doctype html>
    <html>
      <body style="font-family:Arial, sans-serif; background:#f9f9f9; margin:0; padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:30px; text-align:left;">
                <tr><td>
                  <h1 style="color:#333;">Hi {{name}}, your trial is ending ⏳</h1>
                  <p style="color:#555; font-size:15px; line-height:1.6;">
                    Your trial ends in {{days_left}} days. Upgrade now to keep enhancing your LinkedIn experience.
                  </p>
                  <p style="text-align:center; margin:30px 0;">
                    <a href="{{dashboard_url}}" style="background:#4f46e5; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:bold; display:inline-block;">
                      Upgrade Now
                    </a>
                  </p>
                  ${baseFooter}
                </td></tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`
const trialEndingEmailText = `Hi {{name}}, your trial ends in {{days_left}} days. Upgrade now to continue using LIA.`

const reengageEmailHtml = `<!doctype html>
    <html>
      <body style="font-family:Arial, sans-serif; background:#f9f9f9; margin:0; padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:30px; text-align:left;">
                <tr><td>
                  <h1 style="color:#333;">We miss you, {{name}}! 💌</h1>
                  <p style="color:#555; font-size:15px; line-height:1.6;">
                    Haven't seen you in a while. Try a rewrite today and keep your LinkedIn presence active.
                  </p>
                  <p style="text-align:center; margin:30px 0;">
                    <a href="{{dashboard_url}}" style="background:#4f46e5; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:bold; display:inline-block;">
                      Try AI Rewrite
                    </a>
                  </p>
                  ${baseFooter}
                </td></tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`
const reengageEmailText = `We miss you, {{name}}! Try a rewrite today and keep your LinkedIn presence active.`

const influencerPromotionEmailHtml = `<!doctype html>
<html>
  <body style="font-family:Arial, sans-serif; background:#f9f9f9; margin:0; padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:30px; text-align:left;">
            <tr><td>
              <h1 style="color:#4f46e5;">Welcome to LIA Pro, {{name}}! 🌟</h1>
              <p style="color:#555; font-size:15px; line-height:1.6;">
                Thank you for partnering with us! As a valued collaborator, you now have <strong>complimentary Pro access to LIA</strong> for the next three months.
              </p>
              <p style="color:#555; font-size:15px; line-height:1.6;">
                We’re excited for you to experience all the advanced features LIA offers. Use it to supercharge your LinkedIn presence, streamline your workflow, and unlock new opportunities.
              </p>
              <p style="color:#555; font-size:15px; line-height:1.6;">
                <strong>How you can help:</strong>
                <ul style="color:#555; font-size:15px; line-height:1.6;">
                  <li>Explore LIA Pro and discover your favorite features</li>
                  <li>Share your experience and results with your network</li>
                  <li>Tag <a href="https://www.linkedin.com/company/getlia" style="color:#4f46e5;">@getlia</a> in your posts</li>
                  <li>Send us feedback to help us improve</li>
                </ul>
              </p>
              <p style="text-align:center; margin:30px 0;">
                <a href="{{dashboard_url}}" style="background:#4f46e5; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:bold; display:inline-block;">
                  Access Your LIA Pro Dashboard
                </a>
              </p>
              <p style="color:#555; font-size:15px; line-height:1.6;">
                We’re grateful to have you on board and can’t wait to see how you use LIA to inspire others!
              </p>
              <p style="color:#555; font-size:15px; line-height:1.6;">
                — David & the LIA Team
              </p>
              <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />
              <p style="font-size:12px; color:#888888; text-align:center;">
                If you have any questions or need support, send a reply to this <a href="mailto:support@getlia.com" style="color:#888888;">email</a> or reach out via <a href="https://www.getlia.live/support" style="color:#888888;">support</a>.<br/>
                <a href="{{unsubscribe_url}}" style="color:#888888;">Unsubscribe</a>
              </p>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
const influencerPromotionEmailText = `Welcome to LIA Pro, {{name}}! 🌟

Thank you for partnering with us! You now have complimentary Pro access to LIA for the next three months.

How you can help:
- Explore LIA Pro and discover your favorite features
- Share your experience and results with your network
- Tag @getlia in your posts
- Send us feedback to help us improve

Access your dashboard: {{dashboard_url}}

We’re grateful to have you on board and can’t wait to see how you use LIA to inspire others!

— David & the LIA Team

Questions or need support? Email support@getlia.com or visit https://www.getlia.live/support

Unsubscribe: {{unsubscribe_url}}
`;

async function seedEmailTemplates() {
  // MILESTONE 10
  await createSesTemplateIfMissing(
    "MILESTONE_10",
    "🎉 You hit 10 post rewrites!",
    mileStone10Html,
    mileStone10Text
  );

  // STREAK 20
  await createSesTemplateIfMissing(
    "STREAK_20",
    "🔥 20-day LinkedIn streak",
    streak20EmailHtml,
    streak20EmailText
  );

  // TRIAL ENDING
  await createSesTemplateIfMissing(
    "TRIAL_ENDING",
    "⏳ Your LIA trial ends soon",
    trialEndingEmailHtml,
    trialEndingEmailText
  );

  // REENGAGE
  await createSesTemplateIfMissing(
    "REENGAGE",
    "We miss you at LIA 💌",
    reengageEmailHtml,
    reengageEmailText
  );

  // WEEKLY DIGEST
  await createSesTemplateIfMissing(
    "WEEKLY_DIGEST",
    "📬 Your LIA Weekly Digest",
    weeklyDigestHtml,
    weeklyDigestText,
  );
}

if (process.argv[1].includes("emailTemplates.js")) {
  console.log("Seeding SES templates…");
  seedEmailTemplates().then(() => {
    console.log("Seeded SES templates.");
    process.exit(0);
  });
}

module.exports = { 
  seedEmailTemplates,
  weeklyDigestHtml,
  weeklyDigestText,
  mileStone10EmailHtml,
  mileStone10EmailText,
  streak20EmailHtml,
  streak20EmailText,
  trialEndingEmailHtml,
  trialEndingEmailText,
  reengageEmailHtml,
  reengageEmailText,
  welcomeEmailHtml,
  welcomeEmailText,
  passwordResetHtml,
  passwordResetText,
  influencerPromotionEmailHtml,
  influencerPromotionEmailText 
};