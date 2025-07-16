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

window.getLinkedinUserInfo = getLinkedinUserInfo