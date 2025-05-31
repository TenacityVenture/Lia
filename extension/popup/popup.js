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
  chrome.storage.sync.get(['tone', 'industry', 'rewrite_enabled', 'reply_enabled', 'post_enabled'], (data) => {
    if (data.tone) document.getElementById('tone').value = data.tone;
    if (data.industry) document.getElementById('industry').value = data.industry;

    if (data.rewrite_enabled !== undefined) {
      document.getElementById('rewrite-enabled').checked = data.rewrite_enabled !== false;
    }

    if (data.reply_enabled !== undefined) {
      document.getElementById('reply-enabled').checked = data.reply_enabled !== false;
    }

    if (data.post_enabled !== undefined) {
      document.getElementById('post-enabled').checked = data.post_enabled !== false;
    }
  });

  // Save settings
  document.getElementById('save-btn').addEventListener('click', () => {
    const tone = document.getElementById('tone').value;
    const industry = document.getElementById('industry').value;
    const rewrite_enabled = document.getElementById('rewrite-enabled').checked;
    const reply_enabled = document.getElementById('reply-enabled').checked;
    const post_enabled = document.getElementById('post-enabled').checked;

    chrome.storage.sync.set(
      {
        tone, 
        industry, 
        rewrite_enabled, 
        reply_enabled, 
        post_enabled 
      }, () => {
        // Show success message
        const button = document.getElementById('save-btn');
        const originalText = button.textContent
        button.textContent = '✅ Settings saved!';

        setTimeout(() => {
          button.textContent = originalText;
        }, 1500);

        // Notify content script that settings have changed
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { action: "settingsUpdated" })
        })

        alert('✅ Settings saved!');
    });
  });
});

// Sign-in button redirect
document.getElementById('signin-btn')?.addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://lia.davidconteh.engineer' });
});