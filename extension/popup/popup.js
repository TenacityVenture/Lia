document.addEventListener('DOMContentLoaded', async () => {
  const unauth = document.getElementById('unauthenticated');
  const auth = document.getElementById('authenticated');
  const plan = document.getElementById('plan');

  const { access_token, refresh_token } = await chrome.storage.local.get(['access_token', 'refresh_token']);

  if (!access_token || !refresh_token) {
    unauth.style.display = 'flex';
    return;
  }

  // check if access_token is still valid
  async function getMe(token) {
    const me = await fetch('https://api.getlia.live/api/user/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return me;
  }
  let me = await getMe(access_token);

  if (!me.ok) {
    // try refreshing the token
    const newToken = await refreshToken(refresh_token);
    // get me again
    me = await getMe(newToken);

    if (!newToken) {
      unauth.style.display = 'flex';
      return;
    }
  }

  const userData = await me.json();
  auth.style.display = 'flex';
  unauth.style.display = 'none';

  // Set the user's plan
  plan.textContent = userData.plan ? `${userData.plan}`.toUpperCase() : 'Free';

  // Show usage count
  const usage = await fetch('https://api.getlia.live/api/usage/stats', {
    headers: { Authorization: `Bearer ${access_token}` }
  });

  const usageData = await usage.json();
  try {
    document.getElementById('username').innerText = userData.name.split(' ')[0];
  } catch (e) {
    document.getElementById('username').innerText = userData.email.split('@')[0];
  }
  document.getElementById('rewrite-count').innerText = usageData.post_rewrites || 0;

  // Load saved settings
  chrome.storage.sync.get(['tone', 'industry', 'rewrite_enabled', 'reply_enabled', 'chatbot_enabled'], (data) => {
    if (data.tone) document.getElementById('tone').value = data.tone;
    if (data.industry) document.getElementById('industry').value = data.industry;

    if (data.rewrite_enabled !== undefined) {
      document.getElementById('rewrite-enabled').checked = data.rewrite_enabled !== false;
    }

    if (data.reply_enabled !== undefined) {
      document.getElementById('reply-enabled').checked = data.reply_enabled !== false;
    }

    if (data.chatbot_enabled !== undefined) {
      document.getElementById('chatbot-enabled').checked = data.chatbot_enabled !== false;
    }
  });

  // Save settings
  document.getElementById('save-btn').addEventListener('click', () => {
    const tone = document.getElementById('tone').value;
    const industry = document.getElementById('industry').value;
    const rewrite_enabled = document.getElementById('rewrite-enabled').checked;
    const reply_enabled = document.getElementById('reply-enabled').checked;
    const chatbot_enabled = document.getElementById('chatbot-enabled').checked;

    chrome.storage.sync.set(
      {
        tone, 
        industry, 
        rewrite_enabled, 
        reply_enabled, 
        chatbot_enabled 
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
    });
  });
});

// Sign-in button redirect
document.getElementById('signin-btn')?.addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://www.getlia.live/login?src=extension' });
});

// refreshToken function
const refreshToken = async (refresh_token) => {
  try {
    const response = await fetch('https://api.getlia.live/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
    
      },
      // include credentials to allow cookies to be sent
      credentials: 'include',
      body: JSON.stringify({ refresh_token }),
    });

    const data = await response.json();

    chrome.storage.local.set({ access_token: data.access_token, refresh_token: data.refresh_token });
    return data.access_token;

  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}