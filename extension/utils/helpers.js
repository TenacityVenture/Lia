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

    // store in chrome storage
    await chrome.storage.local.set({ name, headline, linkToProfile }, () => {
      console.log('name, headline, linkToProfile saved in storage.')
    })
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
  const { access_token, refresh_token } = await chrome.storage.local.get(['access_token', 'refresh_token']);
  if (!access_token || !refresh_token) {
    return null; // No tokens available, user is not authenticated
  }

  // fetch user from api-server
  let me = await getMe(access_token);
  if (!me.ok) {
    // try refreshing the token
    const newToken = await refreshToken(refresh_token);
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


window.getLinkedinUserInfo = getLinkedinUserInfo
window.getLiaUserInfo = getLiaUserInfo
window.getMe = getMe