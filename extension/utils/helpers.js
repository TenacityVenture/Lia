function getLinkedinUserInfo () {
  const container = document.querySelector('.artdeco-card')
  const detailsContainer = container.querySelector('.profile-card-member-details')

  if (detailsContainer) {
    const name = detailsContainer.querySelector('.profile-card-name').textContent
    const headline = detailsContainer.querySelector('.profile-card-headline').textContent
    const linkedinUrl = `https://www.linkedin.com${detailsContainer.querySelector('a').getAttribute('href')}`

    // store in chrome storage
    chrome.storage.local.set({ name, headline, linkedinUrl }, () => {
      console.log('name, headline, linkedinUrl saved in storage.')
    })
    return {
      name,
      headline,
      linkedinUrl
    }
  } else { // if we can't get the user info - maybe because the actualy dom is not available,
      // then we use the one from storage
      let userInfo = {
        name: "",
        headline: "",
        linkedinUrl: ""
      }

      // get from chrome storage
      chrome.storage.local.get(['name', 'headline', 'linkedinUrl'], (data) => {
        userInfo = {...userInfo, ...data}
      })

      return userInfo
  }
}

window.getLinkedinUserInfo = getLinkedinUserInfo