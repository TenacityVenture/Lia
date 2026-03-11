// @ts-nocheck

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

  const data = await me.json()
  if (!data.error) {
    insertProfileInfo(data)
  }

  return data; // Return the LIA user data as JSON
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
  console.log('Access token and refresh token cleared from storage.');
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
      credentials: 'include', // we don't rely on cookies anymore, but keeping it for compatibility
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

// update profile details
const insertProfileInfo = (liaUser) => {
  let name = liaUser.username || liaUser.name
  // truncate if it's grater than 10 characters
  if (name.length > 10) {
    name = name.slice(0, 10) + '...'
  }

  if (liaUser) {
    try {
      document.querySelector('.profile-avatar').setAttribute('src', liaUser.profile_picture_url)
      document.querySelector('.profile-details').innerHTML = `
      <span class="profile-name" id="profile-name">${name}</span>
      <span class="profile-status">${liaUser.plan}</span>
      `
      // customization
      /*const customizationModal = document.getElementById('customization-modal')
      if (liaUser?.nickname) {
        customizationModal.querySelector('#nickname').value = liaUser?.nickname
      } if (liaUser?.occupation) {
        customizationModal.querySelector('#occupation').value = liaUser?.occupation
      } if (liaUser?.personality) {
        customizationModal.querySelector('#personality').value = liaUser?.personality
      } if (liaUser?.additionalInfo) {
        customizationModal.querySelector('#additional-info').value = liaUser?.additionalInfo
      }

      
      if (liaUser?.traits) {
        liaUser.traits.forEach((trait) => {
          document.querySelector(`#trait-${trait}`).checked = true
        })

        customizationModal.querySelector('#custom-traits') = liaUser.traits.map(() => {
          return `${trait}, `
        })
      }*/
      
    } catch {}
  }
}

// showing profile card
class ProfileCard {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.isMenuOpen = false
    this.init()
  }

  init() {
    this.bindEvents()
  }

  bindEvents() {
    const profileCard = this.container.querySelector("#lia-profile-card")
    const profileMenu = this.container.querySelector("#profile-menu")

    // Toggle menu on profile card click
    profileCard.addEventListener("click", (e) => {
      e.stopPropagation()
      this.toggleMenu()
    })

    // Handle menu item clicks
    const menuItems = this.container.querySelectorAll(".menu-item[data-action]")
    menuItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation()
        const action = item.getAttribute("data-action")
        this.handleMenuAction(action)
      })
    })

    // Close menu when clicking outside
    document.addEventListener("click", () => {
      this.closeMenu()
    })
  }

  toggleMenu() {
    const menu = this.container.querySelector("#profile-menu")
    if (this.isMenuOpen) {
      this.closeMenu()
    } else {
      this.openMenu()
    }
  }

  openMenu() {
    const menu = this.container.querySelector("#profile-menu")
    menu.classList.remove("hidden")
    setTimeout(() => {
      menu.classList.add("show")
    }, 10)
    this.isMenuOpen = true
  }

  closeMenu() {
    const menu = this.container.querySelector("#profile-menu")
    menu.classList.remove("show")
    setTimeout(() => {
      menu.classList.add("hidden")
    }, 200)
    this.isMenuOpen = false
  }

  handleMenuAction(action) {
    switch (action) {
      case "customize":
        this.openCustomizationModal()
        break
      case "upgrade":
        console.log("Upgrade plan clicked")
        break
      case "settings":
        console.log("Settings clicked")
        break
      case "logout":
        console.log("Logout clicked")
        break
      default:
        console.log(`${action} clicked`)
    }
    this.closeMenu()
  }

  openCustomizationModal() {
    // This will trigger the customization modal
    if (window.customizationModal) {
      window.customizationModal.show()
    }
  }
}

// showing customization
/*class CustomizationModal {
  constructor() {
    this.selectedTraits = []
    this.init()
  }

  init() {
    this.bindEvents()
    window.customizationModal = this // Make globally accessible
  }

  bindEvents() {
    const modal = document.getElementById("customization-modal")
    const closeBtn = document.getElementById("close-modal")
    const cancelBtn = document.getElementById("cancel-btn")
    const saveBtn = document.getElementById("save-btn")
    const traitTags = document.querySelectorAll(".trait-tag")

    // Close modal events
    closeBtn.addEventListener("click", () => this.hide())
    cancelBtn.addEventListener("click", () => this.hide())

    // Save button
    saveBtn.addEventListener("click", async () => {await this.save()})

    // Trait selection
    traitTags.forEach((tag) => {
      tag.addEventListener("click", () => this.toggleTrait(tag))
    })

    // Close on overlay click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.hide()
      }
    })
  }

  show() {
    const modal = document.getElementById("customization-modal")
    modal.classList.remove("hidden")
    setTimeout(() => {
      modal.classList.add("show")
    }, 10)
  }

  hide() {
    const modal = document.getElementById("customization-modal")
    modal.classList.remove("show")
    setTimeout(() => {
      modal.classList.add("hidden")
    }, 300)
  }

  toggleTrait(tag) {
    const trait = tag.getAttribute("data-trait")
    if (tag.classList.contains("selected")) {
      tag.classList.remove("selected")
      this.selectedTraits = this.selectedTraits.filter((t) => t !== trait)
    } else {
      tag.classList.add("selected")
      this.selectedTraits.push(trait)
    }
    this.updateTraitsTextarea()
  }

  updateTraitsTextarea() {
    const textarea = document.getElementById("custom-traits")
    textarea.value = this.selectedTraits.join(", ")
  }

  async save() {
    const formData = {
      nickname: document.getElementById("nickname").value,
      occupation: document.getElementById("occupation").value,
      personality: document.getElementById("personality").value,
      traits: this.selectedTraits,
      additionalInfo: document.getElementById("additional-info").value,
    }

    // Save to Chrome storage or your preferred method
    if (window.chrome && window.chrome.storage) {
      window.chrome.storage.sync.set({ customization: formData }, () => {
        console.log("Customization saved")
      })
    }

    console.log("Customization data:", formData)
    this.hide()
  }
}*/

class CustomizationModal {
  constructor() {
    this.selectedTraits = []
    this.init()
  }

  async init() {
    await this.loadSavedData()
    this.bindEvents()
    window.customizationModal = this // Make globally accessible
  }

  bindEvents() {
    const modal = document.getElementById("customization-modal")
    const closeBtn = document.getElementById("close-modal")
    const cancelBtn = document.getElementById("cancel-btn")
    const saveBtn = document.getElementById("save-btn")
    const traitTags = document.querySelectorAll(".trait-tag")

    // Close modal events
    closeBtn.addEventListener("click", () => this.hide())
    cancelBtn.addEventListener("click", () => this.hide())

    // Save button
    saveBtn.addEventListener("click", async () => { await this.save() })

    // Trait selection
    traitTags.forEach((tag) => {
      tag.addEventListener("click", () => this.toggleTrait(tag))
    })

    // Close on overlay click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.hide()
      }
    })
  }

  show() {
    const modal = document.getElementById("customization-modal")
    modal.classList.remove("hidden")
    setTimeout(() => {
      modal.classList.add("show")
    }, 10)
  }

  hide() {
    const modal = document.getElementById("customization-modal")
    modal.classList.remove("show")
    setTimeout(() => {
      modal.classList.add("hidden")
    }, 300)
  }

  toggleTrait(tag) {
    const trait = tag.getAttribute("data-trait")
    if (tag.classList.contains("selected")) {
      tag.classList.remove("selected")
      this.selectedTraits = this.selectedTraits.filter((t) => t !== trait)
    } else {
      tag.classList.add("selected")
      this.selectedTraits.push(trait)
    }
    this.updateTraitsTextarea()
  }

  updateTraitsTextarea() {
    const textarea = document.getElementById("custom-traits")
    textarea.value = this.selectedTraits.join(", ")
  }

  async save() {
    const formData = {
      nickname: document.getElementById("nickname").value,
      occupation: document.getElementById("occupation").value,
      personality: document.getElementById("personality").value,
      traits: this.selectedTraits,
      additionalInfo: document.getElementById("additional-info").value,
    }
  
    if (window.chrome && window.chrome.storage) {
      window.chrome.storage.sync.set({ customization: formData }, () => {
        console.log("Customization saved locally")
      })
    }
  
    // Send to API
    try {
      const response = await lia_fetchWithAuth("https://api.getlia.live/api/user/customizations", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }
  
      const result = await response.json()
      console.log("Customization sent to API:", result)
    } catch (error) {
      console.error("Error sending customization to API:", error)
    }
  
    this.hide()
  }

  async loadSavedData() {
    if (window.chrome && window.chrome.storage) {
      window.chrome.storage.sync.get("customization", (data) => {
        if (data.customization) {
          this.populateDOM(data.customization)
        }
      })
    }
  }

  populateDOM(data) {
    document.getElementById("nickname").value = data.nickname || ""
    document.getElementById("occupation").value = data.occupation || ""
    document.getElementById("personality").value = data.personality || ""
    document.getElementById("additional-info").value = data.additionalInfo || ""
    
    this.selectedTraits = data.traits || []
    
    // Update trait tags visually
    document.querySelectorAll(".trait-tag").forEach((tag) => {
      const trait = tag.getAttribute("data-trait")
      if (this.selectedTraits.includes(trait)) {
        tag.classList.add("selected")
      } else {
        tag.classList.remove("selected")
      }
    })

    this.updateTraitsTextarea()
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
window.Lia_ProfileCard = ProfileCard
window.Lia_CustomizationModal = CustomizationModal