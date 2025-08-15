async function getLiaUserInfo () {
  const { access_token } = await chrome.storage.local.get(['access_token']);
  if (!access_token) {
    return null; // No tokens available, user is not authenticated
  }

  // fetch user from api-server
  let me = await getMe(access_token);
  if (!me.ok) {
    // try refreshing the token
    const newToken = await liaRefreshToken();
    // get me again
    me = await getMe(newToken);

    if (!newToken) {
      return;
    }
  }

  return me.json(); // Return the LIA user data as JSON
}

async function getMe(token) {
  const me = await fetch('https://api.getlia.live/api/user/me', {
    headers: { Authorization: `Bearer ${token}` }
  });

  return me; // Return the response object directly
}

// linkedin dark theme
// #1B1F23  
// button #71b7fb
// button hover #0a66c2
async function detectLinkedInTheme() {
  const container = document.querySelector('body');
  if (!container) return null;

  const style = getComputedStyle(container);
  const bgColor = style.backgroundColor;

  // Function to check brightness
  const isDark = (color) => {
    const [r, g, b] = color.match(/\d+/g).map(Number);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128; // below this is considered dark
  };

  const debounceLinkedinTheme = debounce(async () => {
    await setIfChanged('local', { linkedinTheme: isDark(bgColor) ? 'dark' : 'light' })
  });

  debounceLinkedinTheme();

  return isDark(bgColor) ? 'dark' : 'light';
}

// refreshToken function
// lia refresh token
const liaRefreshToken = async () => {
  try {
    const response = await fetch('https://api.getlia.live/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
    
      },
      // include credentials to allow cookies to be sent
      credentials: 'include',
    });

    const data = await response.json();

    const debounceSetAccessToken = debounce(async () => {
      await setIfChanged('local', { access_token: data.access_token })
    })

    debounceSetAccessToken()
    
    return data.access_token;

  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

const getAccessToken = async () => {
  const { access_token } = await chrome.storage.local.get(['access_token']);
  if (!access_token) {
    throw new Error("Please Sign in to continue")
  }
  return access_token;
}

// utility
function debounce(func, wait = 1000) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

async function setIfChanged(area = 'local', newData = {}) {
  const keys = Object.keys(newData);

  let oldData
  if (area === 'local') {
    oldData = await chrome.storage.local.get(keys);
  } else {
    oldData = await chrome.storage.sync.get(keys);
  }

  const changedData = {};
  for (const key of keys) {
    if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
      changedData[key] = newData[key];
    }
  }

  if (Object.keys(changedData).length > 0) {
    await chrome.storage[area].set(changedData);
    console.log(`[${area}] Storage updated:`, changedData);
  } else {
    console.log(`[${area}] No changes detected. Skipping set.`);
  }
}

// typewriter effect function
function typeWriter(plainContent, element) {
  let i = 0;
  function write() {
    if (i <= plainContent.length) {
      const currentText = plainContent.slice(0, i);
      element.innerHTML = currentText + (i < plainContent.length ? '<span class="lia-cursor">|</span>' : '');
      i++;
      setTimeout(write, 60);
    } else {
      // Final formatting
      element.innerHTML = plainContent;
    }
  }
  write();
}

async function lia_getTokens() {
  const { access_token, refresh_token } = await chrome.storage.local.get(['access_token', 'refresh_token']);
  return { access_token, refresh_token };
}

async function lia_setTokens({ access_token, refresh_token }) {
  await setIfChanged('local', { access_token, refresh_token });
  console.log('Tokens set successfully');
}

async function lia_clearTokens() {
  await chrome.storage.local.remove(['access_token', 'refresh_token']);
}

let refreshInFlight = null;

async function refreshTokenForFetchWithAuth() {
  if (refreshInFlight) return refreshInFlight; // wait for the same promise

  refreshInFlight = (async () => {
    const { refresh_token } = await window.lia_getTokens();
    if (!refresh_token) throw new Error("No refresh_token");

    const resp = await fetch('https://api.getlia.live/api/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // credentials NOT needed since we don't rely on cookies for refresh anymore
      body: JSON.stringify({ refresh_token })
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err?.error || 'Refresh failed');
    }

    const data = await resp.json();
    await window.lia_setTokens({ access_token: data.access_token, refresh_token: data.refresh_token });
    return data.access_token;
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

async function lia_fetchWithAuth(url, options = {}) {
  const { access_token } = await lia_getTokens();

  const doFetch = async (token) => {
    const headers = new Headers(options.headers || {});
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return fetch(url, { ...options, headers });
  };

  let res = await doFetch(access_token);
  if (res.status !== 401) return res;

  // Attempt refresh once
  try {
    const newAccess = await refreshTokenForFetchWithAuth();
    res = await doFetch(newAccess);
    if (res.status === 401) throw new Error('Unauthorized after refresh');
    return res;
  } catch (e) {
    await lia_clearTokens();
    throw e;
  }
}


window.getLiaUserInfo = getLiaUserInfo
window.getMe = getMe
window.detectLinkedInTheme = detectLinkedInTheme
window.typeWriter = typeWriter
window.lia_getTokens = lia_getTokens
window.lia_setTokens = lia_setTokens
window.lia_clearTokens = lia_clearTokens
window.lia_fetchWithAuth = lia_fetchWithAuth