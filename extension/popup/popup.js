document.addEventListener('DOMContentLoaded', async () => {
  const unauth = document.getElementById('unauthenticated');
  const auth = document.getElementById('authenticated');

  const { access_token, refresh_token } = await chrome.storage.local.get(['access_token', 'refresh_token']);

  if (!access_token || !refresh_token) {
    unauth.style.display = 'flex';
    return;
  }

  // check if access_token is still valid
  const me = await fetch('https://your-api.com/api/user/me', {
    headers: { Authorization: `Bearer ${access_token}` }
  });

  if (!me.ok) {
    unauth.style.display = 'flex';
    return;
  }

  const userData = await me.json();
  auth.style.display = 'flex';
  unauth.style.display = 'none';

  // Show usage count
  const usage = await fetch('https://your-api.com/api/usage/stats', {
    headers: { Authorization: `Bearer ${access_token}` }
  });

  const usageData = await usage.json();
  document.getElementById('username').innerText = userData.name.split(' ')[0];
  document.getElementById('rewrite-count').innerText = usageData.post_rewrites || 0;

  // Load saved settings
  chrome.storage.sync.get(['tone', 'industry', 'rewrite_enabled', 'reply_enabled'], (data) => {
    if (data.tone) document.getElementById('tone').value = data.tone;
    if (data.industry) document.getElementById('industry').value = data.industry;
    document.getElementById('rewrite-enabled').checked = data.rewrite_enabled !== false;
    document.getElementById('reply-enabled').checked = data.reply_enabled !== false;
  });

  // Save settings
  document.getElementById('save-btn').addEventListener('click', () => {
    const tone = document.getElementById('tone').value;
    const industry = document.getElementById('industry').value;
    const rewrite_enabled = document.getElementById('rewrite-enabled').checked;
    const reply_enabled = document.getElementById('reply-enabled').checked;

    chrome.storage.sync.set({ tone, industry, rewrite_enabled, reply_enabled }, () => {
      alert('✅ Settings saved!');
    });
  });
});

// Sign-in button redirect
document.getElementById('signin-btn')?.addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://lia.davidconteh.engineer' });
});
