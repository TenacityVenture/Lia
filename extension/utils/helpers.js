const debouncedSetLinkedInUserInfo = debounce(async (data) => {
  await setIfChanged(data)
  console.log('LinkedIn user info saved in storage.');
}, 1000);

async function getLinkedinUserInfo () {
  const container = document.querySelector('.artdeco-card')
  let detailsContainer = null
  if (container) {
    detailsContainer = container.querySelector('.profile-card-member-details')
  }

  if (detailsContainer) {
    const name = detailsContainer.querySelector('.profile-card-name').textContent
    const headline = detailsContainer.querySelector('.profile-card-headline').textContent
    const linkToProfile = `https://www.linkedin.com${detailsContainer.querySelector('a').getAttribute('href')}`

    debouncedSetLinkedInUserInfo({ name, headline, linkToProfile });
    
    return {
      name,
      headline,
      linkToProfile
    }
  } else { // if we can't get the user info - maybe because the actualy dom is not available,
      // then we use the one from storage

      // get from chrome storage
      const { name, headline, linkToProfile } = await chrome.storage.local.get(['name', 'headline', 'linkToProfile'])

      return { name, headline, linkToProfile }
  }
}

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
async function typeWriter(plainContent, element) {
  if (i <= plainContent.length) {
    const currentText = plainContent.slice(0, i);
    element.innerHTML = currentText + (i < plainContent.length ? '<span class="lia-cursor">|</span>' : '');
    i++;
    setTimeout(typeWriter, 10);
  } else {
    // Final formatting
    element.innerHTML = plainContent;
  }
}

window.getLinkedinUserInfo = getLinkedinUserInfo
window.getLiaUserInfo = getLiaUserInfo
window.getMe = getMe
window.detectLinkedInTheme = detectLinkedInTheme
window.typeWriter = typeWriter