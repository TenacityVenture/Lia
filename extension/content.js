(() => {

let settings = {
  tone: "professional",
  industry: "technology",
  post_enabled: true,
  reply_enabled: true,
  rewrite_enabled: true,
  isRewriting: false,
}

let linkedinUserInfo = {
  name: "",
  headline: "",
  linkToProfile: ""
}

// Load settings when content script initializes
chrome.storage.sync.get(["tone", "industry", "post_enabled", "reply_enabled", "rewrite_enabled"], (data) => {
  settings = { ...settings, ...data }
  initializeExtension()
})

// Listen for settings updates
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "settingsUpdated") {
    chrome.storage.sync.get(["tone", "industry", "post_enabled", "reply_enabled", "rewrite_enabled"], (data) => {
      settings = { ...settings, ...data }
    })
  }
})

// Listen for auth tokens after sign-in or signup on the website
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://www.getlia.live') return;
  if (event.source !== window) return;

  if (event.data.type === 'SEND_JWTs') {
    chrome.runtime.sendMessage({
      type: 'STORE_JWTs',
      access_token: event.data.access_token,
      refresh_token: event.data.refresh_token
    });
    initializeChatbot()
  }

  // clear tokens when logout on the website
  if (event.data.type === 'CLEAR_JWTs') {
    chrome.storage.local.remove(['access_token', 'refresh_token'], () => {
      console.log('Access token and refresh token cleared from storage.');
    });
  }
});

// uitlity functions

// check if element exists in dom / waits for it to exist by keep trying
function waitForElement(selector, maxAttempts = 100, interval = 1000) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const check = () => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);

      attempts++;
      if (attempts >= maxAttempts) {
        return reject(`Element ${selector} not found after ${maxAttempts} attempts`);
      }

      setTimeout(check, interval);
    };

    check();
  });
}


function initializeExtension() {
  // Initialize the extension functionality
  //setupPostCreationAssistant()
  setupCommentReplyAssistant()
  setuprewrite_enabledment()
  setupTextSelectionToolbar()
  setupTextToSpeech()

  linkedinUserInfo = {...window.getLinkedinUserInfo()}

  let mutationTimeout

  // Set up mutation observer to detect new elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      clearTimeout(mutationTimeout)
      mutationTimeout = setTimeout(() => {
        if (mutation.addedNodes.length) {
          try {
            setupCommentReplyAssistant()
            setuprewrite_enabledment()
            setupTextSelectionToolbar()
            setupTextToSpeech() 
            
            linkedinUserInfo = {...window.getLinkedinUserInfo()}

            if (chatbotState.referenceMode) {
              addReferenceListeners()
            }
          } catch (error) {
            console.error("MutationObserver Error:", error)
          }
        }
      }, 500)
    })
  })

  // observer entire document body
  observer.observe(document.body, { childList: true, subtree: true })

  // observer .feed-shared-update-v2__comments-container
  const commentsContainer = document.body.querySelector('.feed-shared-update-v2__comments-container')
  if (commentsContainer) {
    observer.observe(commentsContainer, { childList: true, subtree: true, characterData: true})
  }
}

function setupTextToSpeech() {
  // Find all LinkedIn posts
  const posts = document.querySelectorAll('.feed-shared-update-v2, .feed-shared-update-detail-viewer__content')
  
  posts.forEach(post => {
    // Check if we've already added the TTS button
    if (post.querySelector('.lia-tts-button')) return
    
    // Find the post content
    const postContent = post.querySelector('.feed-shared-update-v2__description, .reader-article-content')
    if (!postContent) return
    
    // Create the TTS button
    createTTSButton(post, postContent)
  })
}

function createTTSButton(postContainer, contentElement) {
  const ttsButton = document.createElement('button')
  ttsButton.className = 'lia-tts-button'
  ttsButton.innerHTML = `
    <svg class="lia-tts-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.08"/>
    </svg>
    <span class="lia-tts-text">Listen</span>
  `
  
  ttsButton.style.cssText = `
    position: absolute;
    top: 3px;
    right: 90px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    color: #0a66c2;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    opacity: 0;
    transform: translateY(-10px);
  `
  
  // Position the post container relatively
  postContainer.style.position = 'relative'
  
  // Show button on hover
  postContainer.addEventListener('mouseenter', () => {
    ttsButton.style.opacity = '1'
    ttsButton.style.transform = 'translateY(0)'
  })
  
  postContainer.addEventListener('mouseleave', () => {
    if (!ttsButton.classList.contains('playing')) {
      ttsButton.style.opacity = '0'
      ttsButton.style.transform = 'translateY(-10px)'
    }
  })
  
  // Add click handler
  ttsButton.addEventListener('click', (e) => {
    e.stopPropagation()
    handleTTSClick(ttsButton, contentElement)
  })
  
  postContainer.appendChild(ttsButton)
}

async function handleTTSClick(button, contentElement) {
  const text = extractTextContent(contentElement)
  
  if (!text || text.length < 10) {
    showTTSError(button, 'No content to read')
    return
  }
  
  if (button.classList.contains('playing')) {
    stopAudio(button)
    return
  }
  
  if (button.classList.contains('loading')) return
  
  try {
    showTTSLoading(button)
    const audioUrl = await generateSpeech(text)
    playAudio(button, audioUrl, text)
  } catch (error) {
    console.error('TTS Error:', error)
    //showTTSError(button, 'Failed to generate speech')
    showTTSError(button, 'Feature coming soon!')
  }
}

function extractTextContent(element) {
  // Get text content while preserving mentions
  let text = ''
  
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return NodeFilter.FILTER_ACCEPT
        }
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('ql-mention')) {
          return NodeFilter.FILTER_ACCEPT
        }
        return NodeFilter.FILTER_SKIP
      }
    }
  )
  
  let node
  while (node = walker.nextNode()) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent
    } else if (node.classList.contains('ql-mention')) {
      text += node.textContent
    }
  }
  
  // Clean up the text
  text = text.replace(/\s+/g, ' ').trim()
  
  // Remove URLs for better speech
  text = text.replace(/https?:\/\/[^\s]+/g, '')
  
  // Replace hashtags with readable format
  text = text.replace(/#(\w+)/g, ' hashtag $1')

  // Replace commonly used emojies with their meaning and remove the rest
  // Replace commonly used emojis with words (their meaning), remove the rest
  const emojiMap = {
    '🔥': 'fire ',
    '😊': 'smiling face ',
    '❤️': 'heart ',
    '✅': 'checkmark ',
    '🚀': 'rocket ',
    '🌍': 'world'
  };

  text = text.replace(
    /[\p{Emoji_Presentation}\u200d\uFE0F]/gu,
    (match) => emojiMap[match] || ''
  );


  console.log(text)
  
  return text
}

async function generateSpeech(text) {
  // Check if we have access token
  const accessToken = await getAccessToken()
  if (!accessToken) {
    throw new Error('Please sign in to use text-to-speech')
  }
  
  const response = await fetch('https://api.getlia.live/api/tts/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      text: text,
      voice: 'Joanna', // AWS Polly voice
      engine: 'neural'
    })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to generate speech')
  }
  
  const data = await response.json()
  return data.audioUrl
}

function playAudio(button, audioUrl, originalText) {
  // Create audio element
  const audio = new Audio(audioUrl)
  audio.crossOrigin = 'anonymous'
  
  // Update button to playing state
  button.classList.add('playing')
  button.innerHTML = `
    <svg class="lia-tts-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="6" y="4" width="4" height="16"/>
      <rect x="14" y="4" width="4" height="16"/>
    </svg>
    <span class="lia-tts-text">Pause</span>
  `
  button.style.background = 'rgba(10, 102, 194, 0.1)'
  button.style.borderColor = '#0a66c2'
  button.style.opacity = '1'
  button.style.transform = 'translateY(0)'
  
  // Create progress bar
  const progressBar = createProgressBar(button)
  
  // Store audio reference
  button.audioElement = audio
  button.progressBar = progressBar
  
  // Audio event listeners
  audio.addEventListener('loadstart', () => {
    console.log('Audio loading started')
  })
  
  audio.addEventListener('canplay', () => {
    console.log('Audio can start playing')
  })
  
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100
      progressBar.style.width = `${progress}%`
    }
  })
  
  audio.addEventListener('ended', () => {
    stopAudio(button)
  })
  
  audio.addEventListener('error', (e) => {
    console.error('Audio error:', e)
    showTTSError(button, 'Playback failed')
  })
  
  // Start playing
  audio.play().catch(error => {
    console.error('Play error:', error)
    showTTSError(button, 'Playback failed')
  })
}

function stopAudio(button) {
  if (button.audioElement) {
    button.audioElement.pause()
    button.audioElement = null
  }
  
  if (button.progressBar) {
    button.progressBar.remove()
    button.progressBar = null
  }
  
  button.classList.remove('playing', 'loading', 'error')
  button.innerHTML = `
    <svg class="lia-tts-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.08"/>
    </svg>
    <span class="lia-tts-text">Listen</span>
  `
  button.style.background = 'rgba(255, 255, 255, 0.95)'
  button.style.borderColor = '#e0e0e0'
}

function createProgressBar(button) {
  const progressContainer = document.createElement('div')
  progressContainer.style.cssText = `
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(10, 102, 194, 0.2);
    border-radius: 0 0 20px 20px;
    overflow: hidden;
  `
  
  const progressBar = document.createElement('div')
  progressBar.style.cssText = `
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #0a66c2, #004182);
    transition: width 0.1s ease;
  `
  
  progressContainer.appendChild(progressBar)
  button.appendChild(progressContainer)
  
  return progressBar
}

function showTTSLoading(button) {
  button.classList.add('loading')
  button.innerHTML = `
    <div class="lia-tts-spinner" style="
      width: 16px;
      height: 16px;
      border: 2px solid #e0e0e0;
      border-top: 2px solid #0a66c2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    "></div>
    <span class="lia-tts-text">Loading...</span>
  `
}

function showTTSError(button, message) {
  button.classList.add('error')
  button.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
    <span class="lia-tts-text" style="color: #ef4444;">${message}</span>
  `
  
  setTimeout(() => {
    if (button.classList.contains('error')) {
      stopAudio(button)
    }
  }, 3000)
}

async function getAccessToken() {
  try {
    const { access_token } = await chrome.storage.local.get(['access_token'])
    return access_token
  } catch (error) {
    console.error('Error getting access token:', error)
    return null
  }
}

// add bold and italic formatting leveraging unicodes
function toUnicodeStyle(text, style = 'bold') {
  const boldMap = {
    a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', h: '𝗵', i: '𝗶', j: '𝗷',
    k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻', o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁',
    u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇',
    A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚', H: '𝗛', I: '𝗜', J: '𝗝',
    K: '𝗞', L: '𝗟', M: '𝗠', N: '𝗡', O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥', S: '𝗦', T: '𝗧',
    U: '𝗨', V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭',
    0: '𝟬', 1: '𝟭', 2: '𝟮', 3: '𝟯', 4: '𝟰', 5: '𝟱', 6: '𝟲', 7: '𝟳', 8: '𝟴', 9: '𝟵'
  };

  const italicMap = {
    a: '𝘢', b: '𝘣', c: '𝘤', d: '𝘥', e: '𝘦', f: '𝘧', g: '𝘨', h: '𝘩', i: '𝘪', j: '𝘫',
    k: '𝘬', l: '𝘭', m: '𝘮', n: '𝘯', o: '𝘰', p: '𝘱', q: '𝘲', r: '𝘳', s: '𝘴', t: '𝘵',
    u: '𝘶', v: '𝘷', w: '𝘸', x: '𝘹', y: '𝘺', z: '𝘻',
    A: '𝘈', B: '𝘉', C: '𝘊', D: '𝘋', E: '𝘌', F: '𝘍', G: '𝘎', H: '𝘏', I: '𝘐', J: '𝘑',
    K: '𝘒', L: '𝘓', M: '𝘔', N: '𝘕', O: '𝘖', P: '𝘗', Q: '𝘘', R: '𝘙', S: '𝘚', T: '𝘛',
    U: '𝘜', V: '𝘝', W: '𝘞', X: '𝘟', Y: '𝘠', Z: '𝘡'
  };

  const map = style === 'italic' ? italicMap : boldMap;

  return [...text].map(char => map[char] || char).join('');
}

// convert from unicode to normal formatting
function fromUnicodeToNormal(text, style = 'bold') {
  const boldMap = {
    '𝗮': 'a', '𝗯': 'b', '𝗰': 'c', '𝗱': 'd', '𝗲': 'e', '𝗳': 'f', '𝗴': 'g', '𝗵': 'h', '𝗶': 'i', '𝗷': 'j',
    '𝗸': 'k', '𝗹': 'l', '𝗺': 'm', '𝗻': 'n', '𝗼': 'o', '𝗽': 'p', '𝗾': 'q', '𝗿': 'r', '𝘀': 's', '𝘁': 't',
    '𝘂': 'u', '𝘃': 'v', '𝘄': 'w', '𝘅': 'x', '𝘆': 'y', '𝘇': 'z',
    '𝗔': 'A', '𝗕': 'B', '𝗖': 'C', '𝗗': 'D', '𝗘': 'E', '𝗙': 'F', '𝗚': 'G', '𝗛': 'H', '𝗜': 'I', '𝗝': 'J',
    '𝗞': 'K', '𝗟': 'L', '𝗠': 'M', '𝗡': 'N', '𝗢': 'O', '𝗣': 'P', '𝗤': 'Q', '𝗥': 'R', '𝗦': 'S', '𝗧': 'T',
    '𝗨': 'U', '𝗩': 'V', '𝗪': 'W', '𝗫': 'X', '𝗬': 'Y', '𝗭': 'Z',
    '𝟬': 0, '𝟭': 1, '𝟮': 2, '𝟯': 3, '𝟰': 4, '𝟱': 5, '𝟲': 6, '𝟳': 7, '𝟴': 8, '𝟵': 9
  };

  const italicMap = {
    '𝘢': 'a', '𝘣': 'b', '𝘤': 'c', '𝘥': 'd', '𝘦': 'e', '𝘧': 'f', '𝘨': 'g', '𝘩': 'h', '𝘪': 'i', '𝘫': 'j',
    '𝘬': 'k', '𝘭': 'l', '𝘮': 'm', '𝗻': 'n', '𝘰': 'o', '𝘱': 'p', '𝘲': 'q', '𝘳': 'r', '𝘴': 's', '𝘵': 't',
    '𝘶': 'u', '𝘷': 'v', '𝘸': 'w', '𝘹': 'x', '𝘺': 'y', '𝘻': 'z',
    '𝘈': 'A', '𝘉': 'B', '𝘊': 'C', '𝘋': 'D', '𝘌': 'E', '𝘍': 'F', '𝘎': 'G', '𝘏': 'H', '𝘐': 'I', '𝘑': 'J',
    '𝘒': 'K', '𝘓': 'L', '𝘔': 'M', '𝘕': 'N', '𝘖': 'O', '𝘗': 'P', '𝘘': 'Q', '𝘙': 'R', '𝘚': 'S', '𝘛': 'T',
    '𝘜': 'U', '𝘝': 'V', '𝘞': 'W', '𝘟': 'X', '𝘠': 'Y', '𝘡': 'Z'
  };

  const map = style === 'italic' ? italicMap : boldMap;

  return [...text].map(char => map[char] || char).join('');
}

// check if text is unicode
function isUnicode(text) {
  // range of unicode characters
  return /[^\u0000-\u007F]/.test(text);
}

function setupTextSelectionToolbar() {
  // Remove existing popup if it exists
  const existingPopup = document.getElementById('linkedin-ai-text-toolbar')
  if (existingPopup) {
    existingPopup.remove()
  }

  // Create the enhanced toolbar
  const toolbar = document.createElement('div')
  toolbar.id = 'linkedin-ai-text-toolbar'
  toolbar.className = 'linkedin-ai-text-toolbar'
  toolbar.style.cssText = `
    position: absolute;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 8px;
    display: none;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    gap: 4px;
    align-items: center;
    backdrop-filter: blur(10px);
  `

  // Create toolbar buttons
  const buttons = [
    {
      id: 'bold',
      icon: 'B',
      title: 'Make Bold',
      style: 'font-weight: 700; font-size: 14px;',
      action: () => handleTextFormatting('bold')
    },
    {
      id: 'italic',
      icon: 'I',
      title: 'Make Italic',
      style: 'font-style: italic; font-size: 14px;',
      action: () => handleTextFormatting('italic')
    },
    {
      id: 'divider1',
      type: 'divider'
    },
    {
      id: 'ai-rewrite',
      icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2">
        <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Zm0 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
      </svg>`,
      title: 'AI Rewrite Paragraph',
      action: () => handleAIRewrite()
    },
    {
      id: 'shorten',
      icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2">
        <path d="M8 18L12 6l4 12"/>
        <path d="M9.5 12h5"/>
      </svg>`,
      title: 'Make Shorter',
      action: () => handleTextTransform('shorten')
    },
    {
      id: 'expand',
      icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
      </svg>`,
      title: 'Expand Text',
      action: () => handleTextTransform('expand')
    },
    {
      id: 'divider2',
      type: 'divider'
    },
    {
      id: 'professional',
      icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
      </svg>`,
      title: 'Make Professional',
      action: () => handleTextTransform('professional')
    },
    {
      id: 'emoji',
      icon: '😊',
      title: 'Add Emojis',
      style: 'font-size: 14px;',
      action: () => handleTextTransform('emoji')
    },
    {
      id: 'grammar',
      icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2">
        <path d="M9 12l2 2 4-4"/>
        <circle cx="12" cy="12" r="10"/>
      </svg>`,
      title: 'Fix Grammar',
      action: () => handleTextTransform('grammar')
    }
  ]

  // Build toolbar HTML
  buttons.forEach(button => {
    if (button.type === 'divider') {
      const divider = document.createElement('div')
      divider.style.cssText = `
        width: 1px;
        height: 20px;
        background: #e0e0e0;
        margin: 0 4px;
      `
      toolbar.appendChild(divider)
    } else {
      const btn = document.createElement('button')
      btn.className = 'linkedin-ai-toolbar-btn'
      btn.title = button.title
      btn.style.cssText = `
        background: none;
        border: none;
        padding: 6px 8px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
        color: #0a66c2;
        ${button.style || ''}
      `
      
      if (button.icon.startsWith('<svg')) {
        btn.innerHTML = button.icon
      } else {
        btn.textContent = button.icon
      }

      btn.addEventListener('mouseenter', () => {
        btn.style.backgroundColor = '#e7f3ff'
      })

      btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = 'transparent'
      })

      btn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        button.action()
      })

      toolbar.appendChild(btn)
    }
  })

  document.body.appendChild(toolbar)

  // Add selection event listeners
  document.addEventListener('mouseup', handleTextSelection)
  document.addEventListener('keyup', handleTextSelection)

  // Hide toolbar when clicking outside
  document.addEventListener('mousedown', (e) => {
    if (!toolbar.contains(e.target)) {
      toolbar.style.display = 'none'
    }
  })
}

function handleTextSelection() {
  const toolbar = document.getElementById('linkedin-ai-text-toolbar')
  if (!toolbar) return

  const selection = window.getSelection()
  const selectedText = selection.toString().trim()

  if (selectedText && selectedText.length > 0) {
    // Check if we're in a LinkedIn editor
    const activeElement = document.activeElement
    const isInEditor = activeElement && (
      activeElement.classList.contains('ql-editor') ||
      activeElement.closest('.ql-editor') ||
      activeElement.closest('.share-box') ||
      activeElement.closest('.comments-comment-texteditor')
    )

    if (isInEditor) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      toolbar.style.left = `${rect.left + window.scrollX + (rect.width / 2) - (toolbar.offsetWidth / 2)}px`
      toolbar.style.top = `${rect.top + window.scrollY - 50}px`
      toolbar.style.display = 'flex'

      // Store selection for later use
      toolbar.dataset.selectedText = selectedText
      toolbar.dataset.selectionStart = range.startOffset
      toolbar.dataset.selectionEnd = range.endOffset
    }
  } else {
    toolbar.style.display = 'none'
  }
}

function handleTextFormatting(type) {
  const selection = window.getSelection()
  const selectedText = selection.toString().trim()
  
  if (!selectedText) return

  let formattedText = selectedText

  switch (type) {
    case 'bold':
      if (isUnicode(selectedText)) {
        formattedText = fromUnicodeToNormal(selectedText, 'bold') // convert to normal text
      } else {
        // Use Unicode bold characters or formatting symbols
        formattedText = toUnicodeStyle(selectedText) // convert to unicode bold
      }
      break
    case 'italic':
      if (isUnicode(selectedText)) {
        formattedText = fromUnicodeToNormal(selectedText, 'italic') // convert to normal text
      } else {
        // Use Unicode italic or formatting symbols
        formattedText = toUnicodeStyle(selectedText, 'italic') // convert to unicode italic
      }
      break
  }

  replaceSelectedText(formattedText)
  hideToolbar()
}

async function handleAIRewrite() {
  const selection = window.getSelection()
  const selectedText = selection.toString().trim()
  
  if (!selectedText) return

  // Get the entire sentence containing the selection
  // but first check if . ? or ! is in the selectedText
  // if it is, then it's already a full sentence
  let fullSentence = selectedText
  if (selectedText.endsWith('.') || selectedText.endsWith('?') || selectedText.endsWith('!')) {
    fullSentence = selectedText
  } else {
    fullSentence = getFullSentence(selection)
  }

  // check if the last character in fullSentence is a fullstop is a full stop
  if (fullSentence.length === 0) return;

  // fullSentence without added full stop 
  const originalSentence = fullSentence
  if (fullSentence[fullSentence.length - 1] !== '.') {
    // If not, add a full stop at the end
    fullSentence += '.'
  }
  
  try {
    showToolbarLoading()

    let rewrittenText = null;
    try {
      // generate ai rewritten text
      rewrittenText = await generateRewrittenText(fullSentence, 'rewrite')
    } catch (error) {
      await refreshToken() // refresh the token

        // call generateRewrittenText again after refresh
        rewrittenText = await generateRewrittenText(fullSentence, 'rewrite')
    }
    if (rewrittenText) {
      await replaceTextInSentence(selection, originalSentence, rewrittenText)
      hideToolbar()
    } else {
      showToolbarError('failed to fetch')
    }
    //hideToolbar()
  } catch (error) {
    showToolbarError(error.message)
  }
}

async function handleTextTransform(type) {
  const selection = window.getSelection()
  const selectedText = selection.toString().trim()
  let fullSentence = getFullSentence(selection)

  // check if the last character in fullSentence is a fullstop is a full stop
  if (fullSentence.length === 0) return
  if (fullSentence[fullSentence.length - 1] !== '.') {
    // If not, add a full stop at the end
    fullSentence += '.'
  }

  if (!selectedText) return

  try {
    showToolbarLoading()
    let transformedText = ""
    try {
      transformedText = await generateRewrittenText(selectedText, type)
    } catch (error) {
      // refresh the token
      await refreshToken() // refresh the token

      // call generateRewrittenText again after refresh
      transformedText = await generateRewrittenText(selectedText, type)
    }
    //replaceSelectedText(transformedText)
    if (!transformedText) {
      showToolbarError('Failed to fetch transformed text')
      return
    }
    await replaceTextInSentence(selection, fullSentence, transformedText)
    hideToolbar()
  } catch (error) {
    showToolbarError(error.message)
  }
}

function getFullSentence(selection) {
    const range = selection.getRangeAt(0)

    // Find the paragraph containing the selection
    let paragraph = range.commonAncestorContainer
    while (paragraph && paragraph.tagName !== "P") {
      paragraph = paragraph.parentElement
    }

    if (paragraph && paragraph.tagName === "P") {
      // Store mention data for later restoration
      const mentions = extractMentionsFromParagraph(paragraph)

      // Convert mentions to @format for AI processing
      const textWithMentions = convertMentionsToAtFormat(paragraph)

      // Store mentions data globally for restoration
      window.linkedinMentionsData = mentions

      return textWithMentions
    }

    // Fallback to original method
    const container = range.commonAncestorContainer
    const text = container.textContent || container.innerText || ""
    const startOffset = range.startOffset

    // Find sentence boundaries
    let sentenceStart = text.lastIndexOf(".", startOffset - 1) + 1
    let sentenceEnd = text.indexOf(".", startOffset)

    if (sentenceStart < 0) sentenceStart = 0
    if (sentenceEnd < 0) sentenceEnd = text.length

    return text.substring(sentenceStart, sentenceEnd).trim()
  }

  function extractMentionsFromParagraph(paragraph) {
    const mentions = []
    const mentionElements = paragraph.querySelectorAll(".ql-mention")

    mentionElements.forEach((mention, index) => {
      mentions.push({
        id: index,
        text: mention.textContent.trim(),
        originalElement: mention.outerHTML,
        entityUrn: mention.getAttribute("data-entity-urn"),
        objectUrn: mention.getAttribute("data-object-urn"),
        href: mention.getAttribute("href"),
        guid: mention.getAttribute("data-guid"),
      })
    })

    return mentions
  }

  function convertMentionsToAtFormat(paragraph) {
    let text = paragraph.innerHTML
    const mentionElements = paragraph.querySelectorAll(".ql-mention")

    mentionElements.forEach((mention, index) => {
      const mentionText = mention.textContent.trim()
      const placeholder = `@${mentionText}`
      text = text.replace(mention.outerHTML, placeholder)
    })

    // Convert HTML to plain text but preserve @mentions
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = text
    return tempDiv.textContent || tempDiv.innerText || ""
  }

  function restoreMentionsInText(text, mentions) {
    if (!mentions || mentions.length === 0) return text

    let restoredText = text

    mentions.forEach((mention) => {
      const atMention = `@${mention.text}`
      if (restoredText.includes(atMention)) {
        // Create new mention element with preserved attributes
        const newMentionElement = createLinkedInMention(mention)
        restoredText = restoredText.replace(atMention, `<MENTION_${mention.id}>`)
      }
    })

    // Replace placeholders with actual mention HTML
    mentions.forEach((mention) => {
      const placeholder = `<MENTION_${mention.id}>`
      if (restoredText.includes(placeholder)) {
        const newMentionElement = createLinkedInMention(mention)
        restoredText = restoredText.replace(placeholder, newMentionElement)
      }
    })

    return restoredText
  }

  function createLinkedInMention(mentionData) {
    return `<a class="ql-mention" href="${mentionData.href || "#"}" data-entity-urn="${mentionData.entityUrn || ""}" data-guid="${mentionData.guid || ""}" data-object-urn="${mentionData.objectUrn || ""}" data-original-text="${mentionData.text}" spellcheck="false" data-test-ql-mention="true">${mentionData.text}</a>`
  }

async function generateRewrittenText(text, type) {
  let prompt = ''
  
  switch (type) {
    case 'rewrite':
      prompt = `Rewrite this sentence to be more engaging and professional: "${text}"`
      break
    case 'shorten':
      prompt = `Make this text shorter while keeping the main message: "${text}"`
      break
    case 'expand':
      prompt = `Expand this text with more detail and context: "${text}"`
      break
    case 'professional':
      prompt = `Make this text more professional and business-appropriate: "${text}"`
      break
    case 'emoji':
      prompt = `Add relevant emojis to this text to make it more engaging: "${text}"`
      break
    case 'grammar':
      prompt = `Fix any grammar, spelling, or punctuation errors in this text: "${text}"`
      break
    default:
      prompt = `Improve this text: "${text}"`
  }

  prompt += ` Return only the improved text without quotes or explanations.`

  const response = await fetch('https://api.getlia.live/api/prompt/improve', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await accessToken()}`,
    },
    credentials: 'include',
    body: JSON.stringify({prompt, type, userInfo: {...userInfo}}),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to transform text")
  }

  return data.response
}

function replaceSelectedText(newText) {
  const selection = window.getSelection()
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    range.deleteContents()
    range.insertNode(document.createTextNode(newText))
    
    // Trigger input event for LinkedIn
    const editor = range.commonAncestorContainer.parentElement
    if (editor) {
      const inputEvent = new Event("input", { bubbles: true })
      editor.dispatchEvent(inputEvent)
    }
  }
}

  async function replaceTextInSentence(selection, originalSentence, newSentence) {
    const range = selection.getRangeAt(0)

    // Find the paragraph containing the selection
    let paragraph = range.commonAncestorContainer
    while (paragraph && paragraph.tagName !== "P") {
      paragraph = paragraph.parentElement
    }

    if (!paragraph || paragraph.tagName !== "P") {
      // Fallback to simple replacement
      replaceSelectedText(newSentence)
      return
    }

    // Get stored mentions data
    const mentions = window.linkedinMentionsData || []

    // Restore mentions in the new sentence
    const restoredSentence = restoreMentionsInText(newSentence, mentions)

    // Store the original HTML structure
    const originalHTML = paragraph.innerHTML
    const originalText = paragraph.textContent || paragraph.innerText || ""

    // Create a temporary span to hold the paragraph being replaced
    const tempSpan = document.createElement("span")
    tempSpan.style.cssText = `
    background: linear-gradient(90deg, #e7f3ff, #f0f9ff);
    border-radius: 4px;
    padding: 2px 4px;
    transition: all 0.3s ease;
    position: relative;
    display: inline-block;
    width: 100%;
    min-height: 1.2em;`

    // Replace the paragraph content with our temp span
    tempSpan.textContent = originalText
    paragraph.innerHTML = ""
    paragraph.appendChild(tempSpan)

    // Animate the replacement
    await animateTextReplacement(tempSpan, originalText, newSentence)

    // After animation, restore the paragraph with mentions
    paragraph.innerHTML = restoredSentence

    // Clean up stored mentions data
    delete window.linkedinMentionsData

    // Trigger input event for LinkedIn
    const editor = paragraph.closest(".ql-editor")
    if (editor) {
      const inputEvent = new Event("input", { bubbles: true })
      editor.dispatchEvent(inputEvent)
    }
  }

  function createLinkedInFormattedHTML(text, originalHTML) {
    // Simple text replacement that preserves basic formatting
    // This is a basic implementation - you might want to enhance this
    // to better preserve mentions and other LinkedIn-specific elements

    // For now, just return the text as plain HTML
    // In a more sophisticated version, you'd parse the original HTML
    // and try to preserve mentions, links, etc.
    return text.replace(/\n/g, "<br>")
  }

  async function animateTextReplacement(element, originalText, newText) {
    return new Promise((resolve) => {
      // Phase 1: Highlight the original text
      element.style.background = "linear-gradient(90deg, #fef3c7, #fde68a)"
      element.style.transform = "scale(1.02)"

      setTimeout(() => {
        // Phase 2: Start the typewriter effect
        let currentIndex = 0

        // Add a subtle pulse effect during typing
        element.style.background = "linear-gradient(90deg, #e7f3ff, #dbeafe)"
        element.style.transform = "scale(1)"

        const typewriterInterval = setInterval(() => {
          if (currentIndex <= newText.length) {
            const partialText = newText.substring(0, currentIndex)

            // Add typing cursor effect
            if (currentIndex < newText.length) {
              element.innerHTML = partialText + '<span style="animation: blink 1s infinite; color: #0a66c2;">|</span>'
            } else {
              element.textContent = newText
            }

            currentIndex++
          } else {
            // Animation complete
            clearInterval(typewriterInterval)

            // Phase 3: Success highlight
            element.style.background = "linear-gradient(90deg, #d1fae5, #a7f3d0)"
            element.style.transform = "scale(1.02)"

            setTimeout(() => {
              // Phase 4: Fade back to normal
              element.style.background = "transparent"
              element.style.transform = "scale(1)"
              element.style.transition = "all 0.5s ease"

              setTimeout(() => {
                resolve()
              }, 500)
            }, 800)
          }
        }, 50) // Adjust typing speed here (lower = faster)
      }, 300)
    })
  }

function showToolbarLoading() {
  const toolbar = document.getElementById('linkedin-ai-text-toolbar')
  if (toolbar) {
    toolbar.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; padding: 4px 8px;">
        <div class="linkedin-ai-loading-spinner" style="width: 14px; height: 14px;"></div>
        <span style="font-size: 12px; color: #0a66c2;">Processing...</span>
      </div>
    `
  }
}

function showToolbarError(message) {
  const toolbar = document.getElementById('linkedin-ai-text-toolbar')
  if (toolbar) {
    toolbar.innerHTML = `
      <div style="padding: 4px 8px; color: #ef4444; font-size: 12px;">
        ${message}
      </div>
    `
    setTimeout(() => hideToolbar(), 3000)
  }
}

function hideToolbar() {
  const toolbar = document.getElementById("linkedin-ai-text-toolbar")
  if (toolbar) {
    toolbar.style.display = "none"
    window.getSelection().removeAllRanges()
  }

  document.getElementById("linkedin-ai-text-toolbar").remove()
  setupTextSelectionToolbar()
}

function setupPostCreationAssistant() {
  if (!settings.post_enabled) return

  // Find all post creation areas
  const postEditors = document.querySelectorAll(".share-box-feed-entry__closed-share-box")

  postEditors.forEach((editor) => {
    // Check if we've already added our button
    if (editor.querySelector(".linkedin-ai-button")) return

    // Find the toolbar or create insertion point
    const toolbar = editor.querySelector(".share-creation-state__footer") || editor.parentElement

    if (toolbar) {
      // post container
      const aiPostContainer = document.createElement("form")
      aiPostContainer.className = "linkedin-ai-post-container"

      // ai post input
      const aiPostInput = document.createElement("input")
      aiPostInput.className = "linkedin-ai-post-input"
      aiPostInput.setAttribute("placeholder", "What do you want to post?")
      aiPostInput.setAttribute("spellcheck", "false")
      aiPostInput.setAttribute("autocapitalize", "off")
      
      // Create AI assistant button
      const aiButton = document.createElement("button")
      aiButton.className = "linkedin-ai-button"
      aiButton.setAttribute("type", "submit")
      aiButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Zm0 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
        </svg>
        AI Assist
      `

      // Event listeners

      aiPostInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault()
          const content = aiPostInput.value
          handlepost_enabledant(editor, content)
        }
      })

      aiButton.addEventListener("click", (event) => {
        event.preventDefault()
        const content = aiPostInput.value
        handlepost_enabledant(editor, content)
      })

      // check if AI Button Exists
      if (toolbar.querySelector(".linkedin-ai-button")) {
        // do nothing
      }
      else {
        // Add button and input to postContainer then postContainer into toolbar
        aiPostContainer.appendChild(aiButton)
        aiPostContainer.appendChild(aiPostInput)
        toolbar.appendChild(aiPostContainer)
      }

    }
  })
}

function setupCommentReplyAssistant() {
  if (!settings.reply_enabled) return

  // Find all comment input areas
  const commentInputs = document.querySelectorAll(".comments-comment-texteditor")

  commentInputs.forEach((input) => {
    const container = input.querySelector(".ql-container")

    // Check if we've already added our button
    if (input.querySelector(".linkedin-ai-button")) return

    // Find the comment actions area
    const actionsArea = input.querySelector(".comments-comment-box-comment__text-editor")

    if (actionsArea) {
      // Create AI assistant button
      const aiButton = document.createElement("button")
      aiButton.className = "linkedin-ai-button"
      aiButton.style.fontSize = "12px"
      aiButton.style.padding = "4px 8px"
      aiButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Zm0 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
        </svg>
        AI Reply
      `

      aiButton.addEventListener("click", (e) => {
        e.preventDefault()
        handlereply_enabledant(input)
      })

      // Add button to actions area
      actionsArea.prepend(aiButton)
    }
  })
}

function setuprewrite_enabledment() {
  if (!settings.rewrite_enabled) return

  const createPostButton = document.querySelector(".share-box-feed-entry__top-bar button.artdeco-button--tertiary")

  if (!createPostButton) return;

  createPostButton.addEventListener('click', () => {

    waitForElement(".share-box_actions").then((shareBoxAction) => {
      //let shareBoxAction = document.querySelector(".share-box_actions")
      if (shareBoxAction) {
        shareBoxAction.style.display = "flex"
        shareBoxAction.style.gap = "8px"
        
      }

      const aiButton = document.createElement("button")
      aiButton.className = "linkedin-ai-button"
      aiButton.style.padding = "4px 8px"
      aiButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Zm0 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
        </svg>
        AI Rewrite
      `
      const qlEditor = document.querySelector(".share-box .ql-editor");
      aiButton.addEventListener("click", () => {
        if (settings.isRewriting) {
          showTemporaryMessage(qlEditor, "LIA is rewriting text. Please wait until the process is complete.")
        } else {
          handleRewriteAssistant(qlEditor)
        }
      })

      if (shareBoxAction) {
        if (!shareBoxAction.querySelector(".linkedin-ai-button")) {
          shareBoxAction.prepend(aiButton)
        }
      }
      
      
    })
  })
	
}


async function handlepost_enabledant(editor, content) {
  // Create suggestions container if it doesn't exist
  let suggestionsContainer = editor.parentElement.querySelector(".linkedin-ai-suggestions")

  if (!suggestionsContainer) {
    suggestionsContainer = document.createElement("div")
    suggestionsContainer.className = "linkedin-ai-suggestions"
    editor.parentElement.appendChild(suggestionsContainer)
  }

  // Show loading state
  suggestionsContainer.innerHTML = `
    <div class="linkedin-ai-loading">
      <div class="linkedin-ai-loading-spinner"></div>
      <span>Generating suggestions...</span>
    </div>
  `

  try {
    // Get the current post content
    // const postContent = editor.textContent.trim()

    // Get post context (optional)
    const postContext = getPostContext()

    // Generate suggestions
    const suggestions = await generatePostSuggestions(content, postContext)

    // Display suggestions
    displayPostSuggestions(suggestionsContainer, suggestions, editor)
  } catch (error) {
    suggestionsContainer.innerHTML = `
      <div style="color: red; padding: 10px;">
        Error: ${error.message || "Failed to generate suggestions"}
      </div>
    `
  }

  // try to add ai assist to .share-box
  const shareButton = editor.querySelector('.share-box-feed-entry__top-bar .artdeco-button')
  shareButton.addEventListener('click', () => {
    setupPostCreationAssistant()
  })
}

async function handlereply_enabledant(commentInput) {
  // Create suggestions container if it doesn't exist
  const commentBox = commentInput.querySelector(".ql-container")
  const commentInputEditor = commentInput.querySelector('.ql-editor')

  let suggestionsContainer = commentBox.querySelector(".linkedin-ai-suggestions")

  if (!suggestionsContainer) {
    suggestionsContainer = document.createElement("div")
    suggestionsContainer.className = "linkedin-ai-suggestions"
    commentBox.appendChild(suggestionsContainer)
  }

  // Show loading state
  suggestionsContainer.innerHTML = `
    <div class="linkedin-ai-loading">
      <div class="linkedin-ai-loading-spinner"></div>
      <span>Generating reply suggestions...</span>
    </div>
  `

  try {
    // Get the post and comment context
    const context = getCommentContext(commentInput)

    if (!context) {
      throw new Error("Unable to determine comment context")
    }

    let suggestions;
    if (context.isReplyingToComment == true) {
      // we are replying to a comment
      try {
        suggestions = await generateReplyToCommentSuggestions(context)
      } catch (error) {
          // try to refresh token and generate suggestions again
          await refreshToken() // refresh the token
          suggestions = await generateReplyToCommentSuggestions(context)
      }
    } else {
      // we are replying to a post

      // Generate suggestions

      try {
        suggestions = await generateCommentSuggestions(context)
      } catch (error) {
        // try to refresh token and generate suggestions again
        await refreshToken() // refresh the token
        suggestions = await generateCommentSuggestions(context)
      }
    }

    // set the ql-editor container to empty
    commentInputEditor.textContent = ''

    // Display suggestions
    displayCommentSuggestions(suggestionsContainer, suggestions, commentInput)
  } catch (error) {
    if (error.message === "Failed to generate suggestions") {
      suggestionsContainer.innerHTML = `
      <div style="color: red; padding: 10px;">
      Error: ${error.message || "Failed to generate suggestions"}, maybe your session has expired. Please try signing in again, <a href='https://getlia.live' target='_blank'>here</a>.
      </div>
      `
    } else {
    suggestionsContainer.innerHTML = `
      <div style="color: red; padding: 10px;">
      Error: ${error.message || "Failed to generate suggestions"}
      </div>
      `
    }
    throw error
  }
}

async function handleRewriteAssistant(editor) {
  settings.isRewriting = true;

  // let makes sure that we are having all the line breaks and whitespaces
  // in the editor text content by getting all the p tags and joining their text content
  // this is to avoid issues with the editor not having line breaks and whitespaces
  const paragraphs = Array.from(editor.querySelectorAll("p"))
  const textContent = paragraphs.map(p => {
    let result = '';
    p.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('ql-mention')) {
        result += '@' + node.textContent;
      } else if (node.nodeType === Node.TEXT_NODE) {
        result += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        result += node.textContent;
      }
    });
    return result.trim();
  }).join("\n")
  console.log("Text content to rewrite:", textContent)
  let currentText = textContent

  if (!textContent) {
    // Get the current text content
    currentText = editor.textContent || editor.innerText || ""
  }

  if (!currentText.trim()) {
    settings.isRewriting = false; // reset the flag
    // Show a temporary message if no text is selected
    showTemporaryMessage(editor, "Please write some text first to rewrite it")
    return
  }

  // Show loading state by adding a subtle overlay
  const loadingOverlay = createLoadingOverlay(editor)

  try {
    // Generate improved version

    let improvedText = null;
    try {
      improvedText = await generateImprovedText(currentText)
    } catch (error) {
      try { // call generateImprovedText again after refresh
        await refreshToken() // refresh the token
        improvedText = await generateImprovedText(currentText)
      } catch (retryError) {
        throw retryError // pass it to outer catch
      }
    }

    // Remove loading overlay
    loadingOverlay.remove()
    if (improvedText) {
      // Perform the in-place rewrite with animation
      //await animateTextRewrite(editor, currentText, improvedText)
      await window.animateTextRewriteWithMentions(editor, currentText, improvedText)
      settings.isRewriting = false; // reset the flag
    } else {
      settings.isRewriting = false; // reset the flag
      // Show a temporary message if no improved text was generated
      showTemporaryMessage(editor, "No improvements were made to the text because the extension encountered an error")
    }
  } catch (error) {
    settings.isRewriting = false; // reset the flag
    loadingOverlay.remove()
    console.error("Error during rewrite:", error)
    // Show error message
    if (error.message === "Failed to generate improved text") {
      showTemporaryMessage(editor, "Failed to generate improved text. Maybe your session has expired. Please try signing in again.")
    } else showTemporaryMessage(editor, `Error: ${error.message}`)
  }
}

function createLoadingOverlay(editor) {
  const overlay = document.createElement("div")
  overlay.className = "linkedin-ai-rewrite-loading"
  overlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    border-radius: 8px;
    backdrop-filter: blur(2px);
  `

  overlay.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px; color: #0a66c2;">
      <div class="linkedin-ai-loading-spinner" style="width: 16px; height: 16px;"></div>
      <span style="font-size: 14px;">AI is rewriting...</span>
    </div>
  `

  // Position relative to editor
  const editorRect = editor.getBoundingClientRect()
  const editorParent = editor.parentElement
  editorParent.style.position = "relative"
  editorParent.appendChild(overlay)

  return overlay
}

async function generateImprovedText(originalText) {

  if (!settings.rewrite_enabled) return;

  // setup prompt
  const prompt = `Improve and rewrite the following LinkedIn post to make it more engaging, professional, and impactful. Keep the core message but enhance clarity, flow, and engagement. Maintain unicode characters, maintain the same tone (${settings.tone}) and make it suitable for the ${settings.industry} industry:

  "${originalText}"

  Return only the improved text without any explanations or quotes. Include proper line breaks and formatting as needed - whitespaces.`

  // fetch the response from api-server
  const response = await fetch("https://api.getlia.live/api/prompt/rewrite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await accessToken()}`,
    },
    body: JSON.stringify({prompt, originalText}),
  })

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to generate improved text")
  }

  // get the json response
  const data = await response.json()

  return data.response
}

async function animateTextRewrite(editor, originalText, newText) {
  return new Promise((resolve) => {

    // Create a temporary container for the animation
    const animationContainer = document.createElement("div")
    animationContainer.style.cssText = `
      position: relative;
      min-height: ${editor.offsetHeight}px;
    `

    // Store original editor styles
    const originalStyles = {
      opacity: editor.style.opacity,
      transition: editor.style.transition,
    }

    // Add smooth transition
    editor.style.transition = "opacity 0.3s ease"

    // Phase 1: Fade out original text
    editor.style.opacity = "0.3"

    setTimeout(() => {
      // Phase 2: Character-by-character rewrite simulation
      let currentIndex = 0
      const maxLength = Math.max(originalText.length, newText.length)

      const typewriterInterval = setInterval(() => {
        if (currentIndex <= newText.length) {
          const partialText = newText.substring(0, currentIndex)
          editor.textContent = partialText

          // Add a blinking cursor effect
          if (currentIndex < newText.length) {
            editor.textContent += "|"
          }

          currentIndex++
        } else {
          // Animation complete
          clearInterval(typewriterInterval)
          editor.textContent = newText

          // Phase 3: Fade back in with final text
          editor.style.opacity = "1"

          // Restore original styles
          setTimeout(() => {
            editor.style.opacity = originalStyles.opacity
            editor.style.transition = originalStyles.transition

            // Dispatch input event to trigger LinkedIn's handlers
            const inputEvent = new Event("input", { bubbles: true })
            editor.dispatchEvent(inputEvent)

            // Show success indicator
            showTemporaryMessage(editor, "✨ Text improved!", "success")

            resolve()
          }, 300)
        }
      }, 30) // Adjust speed here (lower = faster)
    }, 300)

  })
}

/**
 * Shows a temporary message above the editor with a fade-in and fade-out animation.
 *
 * @param {HTMLElement} editor - The editor element to position the message relative to.
 * @param {string} message - The message to display.
 * @param {"info"|"success"|"error"} [type="info"] - The type of message to display.
 *   Determines the background color of the message.
 */
function showTemporaryMessage(editor, message, type = "info") {
  const messageEl = document.createElement("div")
  messageEl.style.cssText = `
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#0a66c2"};
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    z-index: 10001;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    white-space: nowrap;
  `
  messageEl.textContent = message

  // Position relative to editor
  const editorParent = editor.parentElement
  editorParent.style.position = "relative"
  editorParent.appendChild(messageEl)

  // Animate in
  setTimeout(() => (messageEl.style.opacity = "1"), 10)

  // Remove after delay
  setTimeout(() => {
    messageEl.style.opacity = "0"
    setTimeout(() => messageEl.remove(), 300)
  }, 3000)
}

function getPostContext() {
  // Try to get context from the page (like hashtags, trending topics, etc.)
  const context = {
    industry: settings.tone,
    recentTopics: [],
  }

  // Look for trending topics or hashtags
  const trendingElements = document.querySelectorAll(
    ".feed-shared-news-module__headline, .feed-shared-news-module__sub-headline",
  )
  trendingElements.forEach((element) => {
    if (element.textContent.trim()) {
      context.recentTopics.push(element.textContent.trim())
    }
  })

  return context
}

function getCommentContext(commentInput) {
  const context = {
    postContent: "",
    previousComments: [],
    postWriter: ""
  }

  if (window.location.href.includes("linkedin.com/pulse/")) {
    /** we are in the articles page */

    // Try to get the original article content
    const articleContainer = document.querySelector('.reader-article-content')
    const articleHeaderTitle = document.querySelector('.reader-article-header__title')
    //const postCreatorContainer = articleContainer.querySelector(".update-components-actor__meta")
    
    if (articleContainer) {
      const contentContext = `
        ${articleHeaderTitle.innerText}
        ${articleContainer.innerText}
        `
      context.postContent = contentContext
    }

    // Try to get previous comments
    const commentsContainer = document.querySelector(".reader-social-details__comments-list, .comments-comments-list")
    if (commentsContainer) {
      const commentElementsContainer = commentsContainer.querySelectorAll(".comments-comment-entity")
      commentElementsContainer.forEach((comment) => {
        const commentElement = comment.querySelector(".comments-comment-item__main-content")
        const commenter = comment.querySelector(".comments-comment-meta__description-title")

        const commentContext = `
          ${commenter.innerText} said: 
          ${commentElement.innerText}
        `
        context.previousComments.push(commentContext)
      })
    }

    // Try to get article writer
    const articleWriterContainer = document.querySelector(".reader-author-info__content")
    if (articleWriterContainer) {
      const creatorFullname = articleWriterContainer.querySelector("div a").innerText
      context.postWriter = creatorFullname
    }

    const replyContext = {
      postContent: context.postContent,
      commenterName: "",
      commentReply: "",
      previousRepliesOnComment: [],
      previousComments: context.previousComments,
      isReplyingToComment: true,
      isReplyingTo: "",
      isSubReplyingTo: false // replying to a reply on a comment
    }

    // check if the ai reply button is in a comment input replying to a comment

    const commentMainContainer = commentInput.closest(".comments-comment-entity")
    let commentSocailActivity = null;
    if (commentMainContainer) {
      commentSocailActivity = commentMainContainer.querySelector(".comment-social-activity")
    } else { // we are in pulse article comments
      commentSocailActivity = commentInput.closest(".comments-social-activity")
    }

    if (commentSocailActivity) { 
      // we are in a comment input replying to a comment
      // also I need it to find all the previous comments on that comment

      // the comment that was made on the post that the user is replying to
      const commentCommenterMeta = commentMainContainer.querySelector('.comments-comment-meta__container .comments-comment-meta__description')
      const commentContentElement = commentMainContainer.querySelector('.comments-thread-entity')

      // structure the context
      const commenterName = commentCommenterMeta.querySelector('.comments-comment-meta__description-title').innerText

      // get content in ql editor because sometimes linkedin will append the person you're replying to in it after clicking reply
      // we need it to tell the ai who to reply to
      const currentContent = commentInput.querySelector('.ql-editor').textContent
      // remove duplicate words in currentContent because sometime there are
      // duplicate words in currentContent
      const currentContentWords = currentContent.split(' ')
      const uniqueCurrentContentWords = [...new Set(currentContentWords)]
      const uniqueCurrentContent = uniqueCurrentContentWords.join(' ')
      
      replyContext.isReplyingTo = uniqueCurrentContent.trim()

      const commentReplyContext = `
      ${commentContentElement.innerText} -- replied by ${commenterName}
      `

      // push to context
      replyContext.commenterName = commenterName
      replyContext.commentReply = commentReplyContext

      // get previous reply that was made on that comment
      const previousReplyContainer = commentSocailActivity.querySelector(".comments-replies-list")
      if (!previousReplyContainer) { // no one has replied to this comment yet
        // return the reply context with no previous replies
        replyContext.previousRepliesOnComment = []
        replyContext.replyContext = true

        return replyContext;
      }
      
      const previousReplyElements = previousReplyContainer.querySelectorAll(".comments-thread-entity")
      previousReplyElements.forEach((reply) => {
        const replyElement = reply.querySelector(".comments-comment-entity .comments-thread-entity")
        const replier = reply.querySelector(".comments-comment-entity .comments-comment-meta__container")
        
        if (replyElement && replier) {
          const replyOnCommentContext = `
            ${replier.querySelector('.comments-comment-meta__description-container .comments-comment-meta__description').innerText} replied: 
            ${replyElement.innerText}
          `
          replyContext.previousRepliesOnComment.push(replyOnCommentContext)
        }
      })

      // loop through previous reply on comment if it contains replyContext.isReplyingTo
      // then change replyContext.commentReply to that comment
      replyContext.previousRepliesOnComment.forEach((reply) => {
        if (reply.includes((replyContext.isReplyingTo + ' replied'))) {
          replyContext.commentReply = reply
          replyContext.isSubReplyingTo = true
          return
        }
      })

      replyContext.replyContext = true
      return replyContext;
    }

    return context
  } else {
    //* we are in feed or somewhere else */

    // Try to get the original post content
    let postContainer = commentInput.closest(".feed-shared-update-v2")
    if (postContainer == null) { // we are in the detail view
      postContainer = commentInput.closest(".feed-shared-update-detail-viewer__content")
    }
    
    if (postContainer) {
      const postTextElement = postContainer.querySelector(".feed-shared-update-v2__description")
      if (postTextElement) {
        context.postContent = postTextElement.textContent.trim()
      }
    }
    
    // Try to get previous comments
    const commentsContainer = postContainer.querySelector(".reader-social-details__comments-list, .comments-comments-list")
    if (commentsContainer) {
      const commentElementsContainer = commentsContainer.querySelectorAll(".comments-comment-entity")
      commentElementsContainer.forEach((comment) => {
        const commentElement = comment.querySelector(".comments-comment-item__main-content")
        const commenter = comment.querySelector(".comments-comment-meta__description-title")
        
        const commentContext = `
        ${commenter.innerText} said: 
        ${commentElement.innerText}
        `
        context.previousComments.push(commentContext)
      })
    }
    
    // Try to get post writer
    const postCreatorContainer = postContainer.querySelector(".update-components-actor__container")
    const postCreator = postCreatorContainer.querySelector(".update-components-actor__title")
    if (postCreatorContainer) {
      const creatorFullname = postCreator.querySelector('span').innerText
      context.postWriter = creatorFullname
    }

    const replyContext = {
      postContent: context.postContent,
      commenterName: "",
      commentReply: "",
      previousRepliesOnComment: [],
      previousComments: context.previousComments,
      isReplyingToComment: true,
      isReplyingTo: "",
      isSubReplyingTo: false // replying to a reply on a comment
    }

    // check if the ai reply button is in a comment input replying to a comment

    const commentMainContainer = commentInput.closest(".comments-comment-entity")
    const commentSocailActivity = commentInput.closest(".comment-social-activity")
    if (commentSocailActivity) { 
      // we are in a comment input replying to a comment
      // also I need it to find all the previous comments on that comment

      // the comment that was made on the post that the user is replying to
      const commentCommenterMeta = commentMainContainer.querySelector('.comments-comment-meta__container .comments-comment-meta__description')
      const commentContentElement = commentMainContainer.querySelector('.comments-thread-entity')

      // structure the context
      const commenterName = commentCommenterMeta.querySelector('.comments-comment-meta__description-title').innerText

      // get content in ql editor because sometimes linkedin will append the person you're replying to in it after clicking reply
      // we need it to tell the ai who to reply to
      const currentContent = commentInput.querySelector('.ql-editor').textContent
      // remove duplicate words in currentContent because sometime there are
      // duplicate words in currentContent
      const currentContentWords = currentContent.split(' ')
      const uniqueCurrentContentWords = [...new Set(currentContentWords)]
      const uniqueCurrentContent = uniqueCurrentContentWords.join(' ')

      replyContext.isReplyingTo = uniqueCurrentContent.trim()

      const commentReplyContext = `
      ${commentContentElement.innerText}. The comment was posted by "${commenterName}"
      `

      // push to context
      replyContext.commenterName = commenterName
      replyContext.commentReply = commentReplyContext

      // get previous reply that was made on that comment
      const previousReplyContainer = commentSocailActivity.querySelector(".comments-replies-list")
      if (!previousReplyContainer) { // no one has replied to this comment yet
        // return the reply context with no previous replies
        replyContext.previousRepliesOnComment = []
        replyContext.replyContext = true

        return replyContext;
      }
      
      const previousReplyElements = previousReplyContainer.querySelectorAll(".comments-thread-entity")
      previousReplyElements.forEach((reply) => {
        const replyElement = reply.querySelector(".comments-comment-entity .comments-thread-entity")
        const replier = reply.querySelector(".comments-comment-entity .comments-comment-meta__container")
        
        if (replyElement && replier) {
          const replyOnCommentContext = `
            ${replier.querySelector('.comments-comment-meta__description-container .comments-comment-meta__description').innerText} replied: 
            ${replyElement.innerText}
          `
          replyContext.previousRepliesOnComment.push(replyOnCommentContext)
        }
      })

      // loop through previous reply on comment if it contains replyContext.isReplyingTo
      // then change replyContext.commentReply to that comment
      replyContext.previousRepliesOnComment.forEach((reply) => {
        if (reply.includes(replyContext.isReplyingTo)) {
          replyContext.commentReply = reply
          replyContext.isSubReplyingTo = true
          return
        }
      })

      replyContext.replyContext = true
      return replyContext;
    }


    return context
  }

  
}

async function generatePostSuggestions(postContent, context) {
  // Check if API key is available

  if (!settings.post_enabled) return;

  // check if acces_token is available
  const { refresh_token } = await chrome.storage.local.get(['refresh_token']);
  if (refresh_token == null) {
    throw new Error("Please Sign in to continue")
  };

  // Prepare the prompt
  let prompt = `Generate 3 professional LinkedIn post suggestions`

  if (postContent) {

    prompt += ` based on this draft: "${postContent}" written by ${context.postWriter}`
  } else {
    prompt += ` for a ${settings.industry} professional`
  }

  prompt += `. The tone should be ${settings.tone}.`

  if (context.recentTopics && context.recentTopics.length > 0) {
    prompt += ` Consider these trending topics: ${context.recentTopics.join(", ")}.`
  }

  prompt += ` Each post should be concise (under 200 words), engaging, and include relevant hashtags.`

  // Call the OpenAI API
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await accessToken()}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a professional LinkedIn content assistant. You help create engaging, professional posts for the ${settings.industry} industry in a ${settings.tone} tone.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to generate suggestions")
  }

  // Parse the response to extract the suggestions
  const content = data.choices[0].message.content

  // Split the content into separate suggestions
  const suggestions = content
    .split(/\d+\.\s+/)
    .filter(Boolean)
    .map((s) => s.trim())

  return suggestions
}

async function generateCommentSuggestions(context) {
  // check if comment suggestions enabled by user
  if (!settings.reply_enabled) return;

  // check if acces_token is available
  const { refresh_token } = await chrome.storage.local.get(['refresh_token']);
  if (refresh_token == null) {
    throw new Error("Please Sign in to continue")
  };

  // Prepare the prompt
  let prompt = `Generate 3 LinkedIn comment replies that are playful, smart, and thoughtful, they should feel natural - like something a sharp professional would say in public:`

  if (context.postContent) {
    prompt += ` The post says: "${context.postContent}"`
  }

  if (context.postWriter) {
    prompt += `. Written by ${context.postWriter}`
  }


  if (context.previousComments && context.previousComments.length > 0) {
    prompt += `. Look at these previous comments as inspiration for tone, vibe, or topic: ${context.previousComments.join(" | ")}`
  }

  prompt += `. The tone should be ${settings.tone}. And industry should be ${settings.industry}`
  prompt += ` Write each reply:
  - Under 20 words
  - Distinct in voice or viewpoint
  - Without hastags
  - Without starting with "Your"
  - Without sounding like an AI or bot
  - Feel free to be slightly opinionated, clever, or relatable`

  async function generate() {
    const response = await fetch ("https://api.getlia.live/api/prompt/suggest-reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await accessToken()}`,
      },
      body: JSON.stringify({
        comment_text: prompt,
        userInfo: {...linkedinUserInfo}
      })
    })

    

    return await response.json()
  }

  let data = await generate()

  if (data.error && data.message === 'Invalid Token') {
    // refresh the token
    const { refresh_token } = await chrome.storage.local.get(['refresh_token']);
    await refreshToken(refresh_token);

    // retry again
    const new_data = await generate();
    data = new_data

  }

  if (data.error) {
    throw new Error(data.error?.message || "Failed to generate suggestions")
  }

  const suggestions = data.suggestions;

  return suggestions
}

async function generateReplyToCommentSuggestions(context) {
  // check if comment suggestions enabled by user
  if (!settings.reply_enabled) return;

  // check if acces_token is available
  const { refresh_token } = await chrome.storage.local.get(['refresh_token']);
  if (refresh_token == null) {
    throw new Error("Please Sign in to continue")
  };

  // Prepare the prompt
  let prompt = `You are replying to a **comment** on a LinkedIn post. Generate 3 thoughtful and human-sounding LinkedIn replies`;

  if (context.commentReply) {
    prompt += ` to this comment${context.isSubReplyingTo ? " (a nested reply - a reply to another reply)" : ""}: "${context.commentReply}"`;
  }
  
  if (context.postContent) {
    prompt += `. The original post is: "${context.postContent}"`;
  }
  
  if (context.postWriter) {
    prompt += `. The original post was written by ${context.postWriter}`;
  }
  
  if (context.previousRepliesOnComment && context.previousRepliesOnComment.length > 0) {
    prompt += `. Consider these previous replies to that comment: ${context.previousRepliesOnComment.join(" | ")}`;
  }
  
  prompt += `. The tone should be ${settings.tone}, but you may also use an encouraging, clarifying, or dialogue-inviting tone depending on context.`;
  
  prompt += ` Respond from either the perspective of the **author replying to a comment**, or a **regular user replying to another user** — whichever fits the situation. Vary the tone and style across the 3 replies.`;
  
  prompt += ` Each suggestion should:
  - Be under 15 words
  - Feel human and natural
  - Add value to the conversation
  - Include no hashtags
  - Use no emojis
  - Never start with "Your" or use "Your [something] is..."
  - Avoid generic or robotic responses`;
  
  prompt += `
  
  Only return the 3 replies. No explanation or extra formatting.`;
  

  async function generate() {
    const response = await fetch ("https://api.getlia.live/api/prompt/suggest-reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await accessToken()}`,
      },
      body: JSON.stringify({
        comment_text: prompt,
        userInfo: {...linkedinUserInfo}
      })
    })

    

    return await response.json()
  }

  let data = await generate()

  if (data.error && data.message === 'Invalid Token') {
    // refresh the token
    const { refresh_token } = await chrome.storage.local.get(['refresh_token']);
    await refreshToken(refresh_token);

    // retry again
    const new_data = await generate();
    data = new_data

  }

  if (data.error) {
    throw new Error(data.error?.message || "Failed to generate suggestions")
  }

  const suggestions = data.suggestions;

  return suggestions
}

function displayPostSuggestions(container, suggestions, editor) {
  container.innerHTML = `
    <h3>AI Post Suggestions</h3>
    <div class="linkedin-ai-suggestion-list">
      ${suggestions
        .map(
          (suggestion, index) => `
        <div class="linkedin-ai-suggestion" data-index="${index}">
          ${suggestion}
        </div>
      `,
        )
        .join("")}
    </div>
    <div class="linkedin-ai-actions">
      <button class="linkedin-ai-dismiss">Dismiss</button>
      <button class="linkedin-ai-regenerate">Regenerate</button>
    </div>
  `

  // Add click event to suggestions
  const suggestionElements = container.querySelectorAll(".linkedin-ai-suggestion")
  suggestionElements.forEach((element) => {
    element.addEventListener("click", function () {
      const index = this.getAttribute("data-index")
      const suggestion = suggestions[index]

      // Insert the suggestion into the editor
      const editorBox = editor.querySelector('.share-box-feed-entry__top-bar .artdeco-button')
      insertTextIntoEditor(editorBox, suggestion)

      // Remove the suggestions container
      container.remove()
    })
  })

  // Add click event to dismiss button
  const dismissButton = container.querySelector(".linkedin-ai-dismiss")
  dismissButton.addEventListener("click", () => {
    container.remove()
  })

  // Add click event to regenerate button
  const regenerateButton = container.querySelector(".linkedin-ai-regenerate")
  regenerateButton.addEventListener("click", () => {
    const aiPostInput = container.parentElement.querySelector(".linkedin-ai-post-input")
    const content = aiPostInput.value
    handlepost_enabledant(editor, content)
  })
}

function displayCommentSuggestions(container, suggestions, commentInput) {
  container.innerHTML = `
    <h3>AI Reply Suggestions</h3>
    <div class="linkedin-ai-suggestion-list">
      ${suggestions
        .map(
          (suggestion, index) => `
        <div class="linkedin-ai-suggestion" data-index="${index}">
          ${suggestion}
        </div>
      `,
        )
        .join("")}
    </div>
    <div class="linkedin-ai-actions">
      <button class="linkedin-ai-dismiss">Dismiss</button>
      <button class="linkedin-ai-regenerate">Regenerate</button>
    </div>
  `

  // Add click event to suggestions
  const suggestionElements = container.querySelectorAll(".linkedin-ai-suggestion")
  suggestionElements.forEach((element) => {
    element.addEventListener("click", function () {
      const index = this.getAttribute("data-index")
      const suggestion = suggestions[index]

      // Insert the suggestion into the comment input
      const commentInputEditor = commentInput.querySelector('.ql-editor')
      insertTextIntoEditor(commentInputEditor, suggestion)

      // Remove the suggestions container
      container.remove()
    })
  })

  // Add click event to dismiss button
  const dismissButton = container.querySelector(".linkedin-ai-dismiss")
  dismissButton.addEventListener("click", () => {
    container.remove()
  })

  // Add click event to regenerate button
  const regenerateButton = container.querySelector(".linkedin-ai-regenerate")
  regenerateButton.addEventListener("click", () => {
    handlereply_enabledant(commentInput)
  })
}

function insertTextIntoEditor(editor, text) {
  // For contentEditable elements
  if (editor.isContentEditable) {
    editor.textContent = text.replaceAll('"', '')

    // Dispatch input event to trigger LinkedIn's event handlers
    const inputEvent = new Event("input", { bubbles: true })
    editor.dispatchEvent(inputEvent)
  }
  // For textarea elements
  else if (editor.tagName === "TEXTAREA") {
    editor.value = text

    // Dispatch input event
    const inputEvent = new Event("input", { bubbles: true })
    editor.dispatchEvent(inputEvent)
  } else {
    editor.textContent = text
  }
}

// helper functions
const refreshToken = async () => {
  const refresh_token = await getRefreshToken();
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

  // helper function to fetch access token in chrome storage
  const accessToken = async () => {
    const { access_token } = await chrome.storage.local.get(['access_token']);
    if (!access_token) {
      throw new Error("Please Sign in to continue")
    }
    return access_token;
  }

  const getRefreshToken = async () => {
    const { refresh_token } = await chrome.storage.local.get(['refresh_token']);
    if (!refresh_token) {
      throw new Error("Please Sign in to continue")
    }
    return refresh_token;
  }

  // ===== CHATBOT SYSTEM =====
  const chatbotState = {
    isOpen: false,
    isMinimized: false,
    sidebarCollapsed: false,
    conversations: [],
    currentConversationId: null,
    position: { x: window.innerWidth - 80, y: window.innerHeight - 80 },
    referenceMode: false,
    referencedContent: null,
  }
  /*
  referencedContent: {
    type: "unknown",
    author: "",
    text: "",
    engagement: {},
    timestamp: "",
    url: window.location.href,
  }
  */

  function initializeChatbot() {
    if (window.location.href.includes("linkedin.com")) {
      createChatbotButton()
      createChatbotInterface()
      loadChatHistory()
      //makeChatbotDraggable() remove dragging feature for now
    }
  }

  function createChatbotButton() {
    // Remove existing button if it exists
    const existingButton = document.getElementById("lia-chatbot-button")
    if (existingButton) existingButton.remove()

    const chatbotButton = document.createElement("div")
    chatbotButton.id = "lia-chatbot-button"
    chatbotButton.innerHTML = `
    <div class="lia-logo-container">
      <svg class="lia-logo" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
        <circle cx="16" cy="4" r="2" fill="#ffffff"/>
        <path d="M12 8a4 4 0 0 1 4-4" stroke="#ffffff"/>
      </svg>
      <div class="lia-pulse-ring"></div>
      <div class="lia-pulse-ring-2"></div>
      <div class="lia-notification-dot"></div>
    </div>
  `

    chatbotButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #0a66c2, #004182);
    border-radius: 50%;
    cursor: pointer;
    z-index: 10000;
    box-shadow: 0 4px 20px rgba(10, 102, 194, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(255, 255, 255, 0.2);
    overflow: hidden;
  `

    // Add hover effects
    chatbotButton.addEventListener("mouseenter", () => {
      chatbotButton.style.transform = "scale(1.1) rotate(5deg)"
      chatbotButton.style.boxShadow = "0 6px 25px rgba(10, 102, 194, 0.4)"
    })

    chatbotButton.addEventListener("mouseleave", () => {
      chatbotButton.style.transform = "scale(1) rotate(0deg)"
      chatbotButton.style.boxShadow = "0 4px 20px rgba(10, 102, 194, 0.3)"
    })

    chatbotButton.addEventListener("click", toggleChatbot)

    document.body.appendChild(chatbotButton)

    // Add CSS animations
    addChatbotStyles()
  }

  function addChatbotStyles() {
    if (document.getElementById("lia-chatbot-styles")) return

    const styles = document.createElement("style")
    styles.id = "lia-chatbot-styles"
    styles.textContent = `
    .lia-logo-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lia-logo {
      animation: liaFloat 4s ease-in-out infinite;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
      transform-origin: center;
    }

    .lia-pulse-ring {
      position: absolute;
      width: 80px;
      height: 80px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      animation: liaPulse 3s ease-out infinite;
    }

    .lia-pulse-ring-2 {
      position: absolute;
      width: 80px;
      height: 80px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      animation: liaPulse 3s ease-out infinite 1.5s;
    }

    .lia-notification-dot {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 12px;
      height: 12px;
      background: #ff4757;
      border-radius: 50%;
      border: 2px solid white;
      animation: liaNotificationPulse 2s ease-in-out infinite;
      opacity: 0;
    }

    .lia-notification-dot.show {
      opacity: 1;
    }

    @keyframes liaFloat {
      0%, 100% { 
        transform: translateY(0px) rotate(0deg) scale(1); 
      }
      25% { 
        transform: translateY(-4px) rotate(2deg) scale(1.05); 
      }
      50% { 
        transform: translateY(-8px) rotate(0deg) scale(1.1); 
      }
      75% { 
        transform: translateY(-4px) rotate(-2deg) scale(1.05); 
      }
    }

    @keyframes liaPulse {
      0% {
        transform: scale(0.8);
        opacity: 1;
      }
      100% {
        transform: scale(1.4);
        opacity: 0;
      }
    }

    @keyframes liaNotificationPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    .lia-chatbot-interface {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 420px;
      height: 500px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
      z-index: 100000;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: scale(0) translateY(20px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(0, 0, 0, 0.08);
      backdrop-filter: blur(20px);

      border-bottom-right-radius: 0;
    }

    .lia-chatbot-interface.right-radius-bottom-and-width {
      border-bottom-right-radius: 20px;
      bottom: 20px;
      width: calc(420px/2)
    }

    .lia-chatbot-interface.open {
      transform: scale(1) translateY(0);
      opacity: 1;
    }

    .lia-chatbot-interface.minimized {
      height: 60px;
      overflow: hidden;
    }

    .lia-chatbot-header {
      background: linear-gradient(135deg, #0a66c2, #004182);
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 20px 20px 0 0;
      position: relative;
      overflow: hidden;
    }

    .lia-chatbot-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
      transform: translateX(-100%);
      animation: headerShine 3s ease-in-out infinite;
    }

    .lia-chatbot-header:hover {
      cursor: grab;
    }

    @keyframes headerShine {
      0% { transform: translateX(-100%); }
      50% { transform: translateX(100%); }
      100% { transform: translateX(100%); }
    }

    .lia-chatbot-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 600;
      font-size: 16px;
      z-index: 1;
      cursor: pointer;
    }

    .lia-chatbot-title svg {
      /* animation: titleLogoSpin 6s linear infinite; */
    }

    @keyframes titleLogoSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .lia-chatbot-controls {
      display: flex;
      gap: 8px;
      z-index: 1;
    }

    .lia-control-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      backdrop-filter: blur(10px);
    }

    .lia-control-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: scale(1.1);
    }

    .lia-control-btn:active {
      transform: scale(0.95);
    }

    .lia-chatbot-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .lia-chat-sidebar {
      width: 140px;
      background: linear-gradient(180deg, #f8f9fa, #e9ecef);
      border-right: 1px solid #dee2e6;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
      position: relative;
    }

    .lia-chat-sidebar.collapsed {
      width: 0;
      border-right: none;
      overflow: hidden;
    }

    .lia-sidebar-toggle {
      position: absolute;
      right: -12px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 40px;
      background: #0a66c2;
      border: none;
      border-radius: 0 8px 8px 0;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: all 0.3s ease;
      box-shadow: 2px 0 8px rgba(0,0,0,0.1);
    }

    .lia-sidebar-toggle:hover {
      background: #004182;
      transform: translateY(-50%) scale(1.1);
    }

    .lia-sidebar-toggle svg {
      transition: transform 0.3s ease;
    }

    .lia-chat-sidebar.collapsed .lia-sidebar-toggle svg {
      transform: rotate(180deg);
    }

    .lia-sidebar-header {
      padding: 16px 12px 12px;
      border-bottom: 1px solid #dee2e6;
      font-size: 11px;
      font-weight: 700;
      color: #6c757d;
      text-transform: uppercase;
      letter-spacing: 1px;
      background: linear-gradient(135deg, #ffffff, #f8f9fa);
    }

    .lia-conversation-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      scrollbar-width: thin;
      scrollbar-color: #dee2e6 transparent;
    }

    .lia-conversation-list::-webkit-scrollbar {
      width: 4px;
    }

    .lia-conversation-list::-webkit-scrollbar-track {
      background: transparent;
    }

    .lia-conversation-list::-webkit-scrollbar-thumb {
      background: #dee2e6;
      border-radius: 2px;
    }

    .lia-conversation-item {
      padding: 10px 12px;
      margin-bottom: 6px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 12px;
      color: #495057;
      transition: all 0.2s;
      border: 1px solid transparent;
      position: relative;
      overflow: hidden;
    }

    .lia-conversation-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(10, 102, 194, 0.1), transparent);
      transition: left 0.5s;
    }

    .lia-conversation-item:hover::before {
      left: 100%;
    }

    .lia-conversation-item:hover {
      background: #e9ecef;
      transform: translateX(4px);
      border-color: #0a66c2;
    }

    .lia-conversation-item.active {
      background: linear-gradient(135deg, #0a66c2, #004182);
      color: white;
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(10, 102, 194, 0.3);
    }

    .lia-new-chat-btn {
      margin: 8px;
      padding: 12px;
      background: linear-gradient(135deg, #0a66c2, #004182);
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }

    .lia-new-chat-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    .lia-new-chat-btn:hover::before {
      left: 100%;
    }

    .lia-new-chat-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(10, 102, 194, 0.4);
    }

    .lia-chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .lia-messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      scrollbar-width: thin;
      scrollbar-color: #dee2e6 transparent;
    }

    .lia-messages-container::-webkit-scrollbar {
      width: 6px;
    }

    .lia-messages-container::-webkit-scrollbar-track {
      background: transparent;
    }

    .lia-messages-container::-webkit-scrollbar-thumb {
      background: #dee2e6;
      border-radius: 3px;
    }

    .lia-message {
      display: flex;
      gap: 12px;
      animation: messageSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0;
      animation-fill-mode: forwards;
    }

    .lia-message.user {
      flex-direction: row-reverse;
    }

    .lia-message-avatar {
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }

    .lia-message.user .lia-message-avatar {
      color: #0a66c2;
    }

    .lia-message.assistant .lia-message-avatar {
      color: #0a66c2;
      animation: avatarPulse 2s ease-in-out infinite;
    }

    @keyframes avatarPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .lia-message-content {
      max-width: 75%;
      padding: 14px 18px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.5;
      position: relative;
      word-wrap: break-word;
    }

    .lia-message.user .lia-message-content .lia-paragraph {
      color: #fff !important;
    }

    .lia-message.assistant .lia-message-content .lia-paragraph {
      color: #333 !important;
    }

    .lia-message.user .lia-message-content {
      background: linear-gradient(135deg, #0a66c2, #004182);
      color: white !important;
      border-bottom-right-radius: 6px;
      box-shadow: 0 4px 12px rgba(10, 102, 194, 0.2);
    }

    .lia-message.assistant .lia-message-content {
      background: linear-gradient(135deg, #f8f9fa, #ffffff);
      color: #333 !important;
      border-bottom-left-radius: 6px;
      border: 1px solid #e9ecef;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    }

    .lia-input-container {
      padding: 20px;
      border-top: 1px solid #e9ecef;
      background: linear-gradient(180deg, #ffffff, #f8f9fa);
    }

    .lia-input-wrapper {
      display: flex;
      gap: 12px;
      align-items: flex-end;
      background: white;
      border-radius: 25px;
      padding: 8px;
      border: 2px solid #e9ecef;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .lia-input-wrapper:focus-within {
      border-color: #0a66c2;
      box-shadow: 0 4px 20px rgba(10, 102, 194, 0.15);
    }

    .lia-message-input {
      flex: 1;
      border: none;
      border-radius: 20px;
      padding: 12px 16px;
      font-size: 14px;
      resize: none;
      max-height: 120px;
      min-height: 20px;
      outline: none;
      background: transparent;
      font-family: inherit;

      scrollbar-width: thin;
      scrollbar-color: #0a66c2 #e9ecef;

      &::-webkit-scrollbar {
        width: 2px;
        height: 2px;
      }
    }

    .lia-send-btn {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #0a66c2, #004182);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }

    .lia-send-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.5s;
    }

    .lia-send-btn:hover::before {
      left: 100%;
    }

    .lia-send-btn:hover {
      transform: scale(1.1) rotate(15deg);
      box-shadow: 0 6px 20px rgba(10, 102, 194, 0.4);
    }

    .lia-send-btn:active {
      transform: scale(0.95) rotate(15deg);
    }

    .lia-send-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }

    .lia-send-btn:disabled::before {
      display: none;
    }

    .lia-typing-indicator {
      display: flex;
      gap: 6px;
      padding: 14px 18px;
    }

    .lia-typing-dot {
      width: 8px;
      height: 8px;
      background: #0a66c2;
      border-radius: 50%;
      animation: typingBounce 1.4s ease-in-out infinite both;
    }

    .lia-typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .lia-typing-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes messageSlideIn {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes typingBounce {
      0%, 80%, 100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .lia-chatbot-interface {
        width: calc(100vw - 40px);
        height: 70vh;
        right: 20px;
        left: 20px;
        bottom: 100px;
      }
      
      .lia-chat-sidebar {
        width: 0;
        border-right: none;
        overflow: hidden;
      }

      .lia-chat-sidebar.collapsed {
        width: 0;
      }

      .lia-sidebar-toggle {
        display: none;
      }
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    .lia-control-btn.reference-active {
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
    }

    .lia-reference-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(10, 102, 194, 0.1), rgba(16, 185, 129, 0.1));
      border: 2px solid #0a66c2;
      border-radius: 8px;
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transition: all 0.3s ease;
      backdrop-filter: blur(1px);
      pointer-events: all;
    }

    .lia-reference-overlay.show {
      opacity: 1;
    }

    .lia-reference-overlay::before {
      content: '📎 Click to Reference';
      position: absolute;
      top: 8px;
      left: 8px;
      background: #0a66c2;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .linkedin-post-hoverable {
      position: relative;
      cursor: pointer;
    }

    .linkedin-post-hoverable:hover .lia-reference-overlay {
      opacity: 1;
    }

    .lia-referenced-content {
      background: linear-gradient(135deg, #e7f3ff, #f0f9ff);
      border: 1px solid #0a66c2;
      border-radius: 8px;
      padding: 12px;
      margin: 8px 0;
      font-size: 12px;
    }

    .lia-referenced-content-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-weight: 600;
      color: #0a66c2;
    }

    .lia-referenced-content-preview {
      color: #666;
      font-style: italic;
      max-height: 60px;
      overflow: hidden;
      position: relative;
    }

    .lia-referenced-content-preview::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 20px;
      background: linear-gradient(transparent, #f0f9ff);
    }

    .lia-clear-reference {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      font-size: 12px;
      margin-left: auto;
    }
  `

    document.head.appendChild(styles)
  }

  function createChatbotInterface() {
    // Remove existing interface if it exists
    const existingInterface = document.getElementById("lia-chatbot-interface")
    if (existingInterface) existingInterface.remove()

    const chatbotInterface = document.createElement("div")
    chatbotInterface.id = "lia-chatbot-interface"
    chatbotInterface.className = "lia-chatbot-interface"

    chatbotInterface.innerHTML = `
    <div class="lia-chatbot-header">
      <div class="lia-chatbot-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
          <circle cx="16" cy="4" r="2" fill="currentColor"/>
          <path d="M12 8a4 4 0 0 1 4-4" stroke="currentColor"/>
        </svg>
        LIA
      </div>
      <div class="lia-chatbot-controls">
        <button class="lia-control-btn" id="lia-reference-toggle" title="Reference Mode (Pro)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>
        <button class="lia-control-btn" id="lia-minimize-btn" title="Minimize">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button class="lia-control-btn" id="lia-close-btn" title="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="lia-chatbot-body">
      <div class="lia-chat-sidebar" id="lia-chat-sidebar">
        <button class="lia-sidebar-toggle" id="lia-sidebar-toggle" title="Toggle Sidebar">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>
        <div class="lia-sidebar-header">Recent Chats</div>
        <div class="lia-conversation-list" id="lia-conversation-list">
          <!-- Conversations will be populated here -->
        </div>
        <button class="lia-new-chat-btn" id="lia-new-chat-btn">+ New Chat</button>
      </div>
      
      <div class="lia-chat-main">
        <div class="lia-messages-container" id="lia-messages-container">
          <div class="lia-message assistant">
            <div class="lia-message-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
                <circle cx="16" cy="4" r="2" fill="#0a66c2"/>
                <path d="M12 8a4 4 0 0 1 4-4" stroke="#0a66c2"/>
              </svg>
            </div>
            <div class="lia-message-content">
              Hi! I'm Lia, your LinkedIn Intelligence Assistant. <br/><br/> I'm here to help you write posts, polish comments, and improve your content. <br/><br/>What can I assist you with today?
            </div>
          </div>
        </div>
        
        <div class="lia-input-container">
          <div class="lia-input-wrapper">
            <textarea 
              class="lia-message-input" 
              id="lia-message-input"
              placeholder="What do you want to post?"
              rows="1"
            ></textarea>
            <button class="lia-send-btn" id="lia-send-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `

    document.body.appendChild(chatbotInterface)

    // Setup event listeners
    setupChatbotEventListeners()
  }

  function setupChatbotEventListeners() {
    const messageInput = document.getElementById("lia-message-input")
    const sendBtn = document.getElementById("lia-send-btn")
    const minimizeBtn = document.getElementById("lia-minimize-btn")
    const closeBtn = document.getElementById("lia-close-btn")
    const sidebarToggle = document.getElementById("lia-sidebar-toggle")
    const sidebar = document.getElementById("lia-chat-sidebar")
    const newChatBtn = document.getElementById("lia-new-chat-btn")
    const liaChatbotTitle = document.querySelector(".lia-chatbot-title")
    const referenceToggle = document.getElementById("lia-reference-toggle")

    // set default to collapsed
    sidebar.classList.add("collapsed")

    // Auto-resize textarea
    messageInput.addEventListener("input", function () {
      this.style.height = "auto"
      this.style.height = Math.min(this.scrollHeight, 120) + "px"
    })

    // Send message on Enter (but not Shift+Enter)
    messageInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    })

    // Enable/disable send button based on input
    messageInput.addEventListener("input", function () {
      sendBtn.disabled = !this.value.trim()
    })

    // Control buttons
    minimizeBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      minimizeChatbot()
    })

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      closeChatbot()
    })

    // Sidebar toggle
    sidebarToggle.addEventListener("click", (e) => {
      e.stopPropagation()
      toggleSidebar()
    })

    // show sidebar when chatbot title is hovered upon
    liaChatbotTitle.addEventListener("mouseover", (e) => {
      e.stopPropagation()

      // toggle sidebar
      toggleSidebar()
    })

    // hide side bar on mouseout
    liaChatbotTitle.addEventListener("mouseout", (e) => {
      e.stopPropagation()
      // toggle sidebar
      toggleSidebar()
    })

    // continue showing sidebar if mouse is on it
    sidebar.addEventListener("mouseover", (e) => {
      e.stopPropagation()
      // toggle sidebar
      showSidebar()
    })


    // New chat button
    newChatBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      startNewConversation()
    })

    // Send button
    sendBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      sendMessage()
    })

    // Reference mode toggle
    referenceToggle.addEventListener("click", (e) => {
      e.stopPropagation()
      toggleReferenceMode()
    })

  }

  function toggleChatbot() {
    if (chatbotState.isOpen) {
      closeChatbot()
    } else {
      openChatbot()
    }
  }

  async function openChatbot() {
    const chatbotInterface = document.getElementById("lia-chatbot-interface")
    chatbotInterface.classList.add("open")
    chatbotInterface.classList.remove("minimized")
    chatbotState.isOpen = true
    chatbotState.isMinimized = false

    await updateConversationList()
    const conversations = document.querySelectorAll(".lia-conversation-item")
    if (conversations.length > 0) {
      // Select the first conversation if available
      // and it's id from data and load it
      const firstConversation = conversations[0]
      firstConversation.classList.add("active")
      chatbotState.currentConversationId = firstConversation.dataset.id
    }
    await loadConversation(chatbotState.currentConversationId)

    // Focus on input
    setTimeout(() => {
      document.getElementById("lia-message-input").focus()
    }, 400)

    // Show notification dot briefly
    showNotificationDot()
  }

  function closeChatbot() {
    const chatbotInterface = document.getElementById("lia-chatbot-interface")
    chatbotInterface.classList.remove("open")
    chatbotInterface.classList.remove("minimized")
    chatbotState.isOpen = false
    chatbotState.isMinimized = false

    // set the radius again
    chatbotInterface.classList.remove('right-radius-bottom-and-width')

  }

  function minimizeChatbot() {
    const chatbotInterface = document.getElementById("lia-chatbot-interface")
    

    // set the radius again
    chatbotInterface.classList.toggle('right-radius-bottom-and-width')

    // positioned bottom right
    // first check if chatbotInterface has left and top styles
    // then we can set minize values cause it distort in initial position
    if (chatbotInterface.style.left && !chatbotInterface.classList.contains('minimized')) {
     
      chatbotInterface.style.left = `84.5%`;
    } 
    if (chatbotInterface.style.top && !chatbotInterface.classList.contains('minimized')) {
     
      chatbotInterface.style.top = `89.5%`;
    } 

    chatbotInterface.classList.toggle("minimized")
    chatbotState.isMinimized = true

    
    

    // Auto-restore after 3 seconds
    /*setTimeout(() => {
      if (chatbotState.isMinimized && chatbotState.isOpen) {
        chatbotInterface.classList.remove("minimized")
        chatbotState.isMinimized = false

        // set the radius again
        chatbotInterface.classList.toggle('right-radius-bottom-and-width')
      }
    }, 60000)*/
    
  }

  function showSidebar() {
    const sidebar = document.getElementById("lia-chat-sidebar")
    sidebar.classList.remove("collapsed")
  }

  function toggleSidebar() {
    const sidebar = document.getElementById("lia-chat-sidebar")
    sidebar.classList.toggle("collapsed")
    chatbotState.sidebarCollapsed = !chatbotState.sidebarCollapsed
  }

  function showNotificationDot() {
    const notificationDot = document.querySelector(".lia-notification-dot")
    if (notificationDot) {
      notificationDot.classList.add("show")
      setTimeout(() => {
        notificationDot.classList.remove("show")
      }, 2000)
    }
  }

  async function sendMessage() {
    const messageInput = document.getElementById("lia-message-input")
    const message = messageInput.value.trim()

    if (!message) return

    // Clear input
    messageInput.value = ""
    messageInput.style.height = "auto"
    document.getElementById("lia-send-btn").disabled = true

    // Add user message to chat
    addMessageToChat("user", message)

    // Show typing indicator
    showTypingIndicator()

    try {
      // Generate AI response
      let response;
      try {
        response = await generateChatResponse(message)
      } catch (error) {
        console.error("Error generating chat response:", error)

        if (response && response.error.includes('missing plan')) {
          // Remove typing indicator
          hideTypingIndicator()
          addMessageToChat('assistant', 'Please upgrade your plan to use this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Upgrade Now</a>')
          return
        }
        // try refreshing the token
        try {
          await refreshToken()
          response = await generateChatResponse(message) // try again after refreshing token
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError)
          response = "Sorry, I encountered an error while trying to generate a response. Please try again later. 😔"
        }
        throw new Error("Failed to generate response from AI")
      }

      // Remove typing indicator
      hideTypingIndicator()

      // Add AI response to chat
      addMessageToChat("assistant", response)

    } catch (error) {
      hideTypingIndicator()
      addMessageToChat("assistant", "Sorry, I encountered an error. Please try again. 😔\n Try Signin in again if the error continues - <a href='https://getlia.live/login' target='_blank' style='color: blue'>here</a>")
      console.error("Chat error:", error)
    }
  }

  function addMessageToChat(role, content) {
    const messagesContainer = document.getElementById("lia-messages-container")

    const messageDiv = document.createElement("div")
    messageDiv.className = `lia-message ${role}`

    // Enhanced helpers
    function formatLinks(text) {
    // Avoid touching existing anchor tags by splitting on them
      return text.replace(/(<a [^>]+>.*?<\/a>)|(\bhttps?:\/\/[^\s<]+)/g, (match, anchor, url) => {
        if (anchor) return anchor; // return existing anchor tags untouched
        if (url) {
          return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="lia-link">${url} <span class="lia-link-icon">🔗</span></a>`;
        }
        return match;
      });
    }

    if (role === "assistant") {
      // Process content with formatting
      let processedContent = formatLinks(content);
      processedContent = formatMarkdown(processedContent);

      // Create message structure
      messageDiv.innerHTML = `
        <div class="lia-message-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect x="2" y="9" width="4" height="12"/>
            <circle cx="4" cy="4" r="2"/>
            <circle cx="16" cy="4" r="2" fill="#0a66c2"/>
            <path d="M12 8a4 4 0 0 1 4-4" stroke="#0a66c2"/>
          </svg>
        </div>
        <div class="lia-message-content" style="position: relative;"></div>
      `;

      const contentDiv = messageDiv.querySelector('.lia-message-content');

      if (content.includes("Unable to load conversations") || content.includes("Unable to create new chat")) {
        // Error messages display immediately
        contentDiv.innerHTML = processedContent;
      } else {
        // Typewriter effect for normal responses
        let i = 0;
        const plainContent = content; // Keep original for typewriter
        
        function typeWriter() {
          if (i <= plainContent.length) {
            const currentText = plainContent.slice(0, i);
            const formattedText = formatMarkdown(formatLinks(currentText));
            contentDiv.innerHTML = formattedText + (i < plainContent.length ? '<span class="lia-cursor">|</span>' : '');
            i++;
            setTimeout(typeWriter, 20);
          } else {
            // Final formatting
            contentDiv.innerHTML = processedContent;
            
            // Add action buttons for longer responses
            if (content.length > 50) {
              const copyBtn = createCopyButton(content);
              const regenBtn = createRegenerateButton();
              
              contentDiv.appendChild(copyBtn);
              //contentDiv.appendChild(regenBtn);

              // Show buttons on hover
              messageDiv.addEventListener("mouseenter", () => {
                copyBtn.style.opacity = "1";
                regenBtn.style.opacity = "1";
              });
              
              messageDiv.addEventListener("mouseleave", () => {
                copyBtn.style.opacity = "0";
                regenBtn.style.opacity = "0";
              });
            }
          }
        }
        typeWriter();
      }
    } else {
      // User messages
      messageDiv.innerHTML = `
        <div class="lia-message-avatar">U</div>
        <div class="lia-message-content">${formatLinks(content)}</div>
      `;
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Trigger animation
    setTimeout(() => {
      messageDiv.style.opacity = "1";
    }, 50);
  }

  function showTypingIndicator() {
    const messagesContainer = document.getElementById("lia-messages-container")

    const typingDiv = document.createElement("div")
    typingDiv.className = "lia-message assistant"
    typingDiv.id = "lia-typing-indicator"

    typingDiv.innerHTML = `
    <div class="lia-message-avatar">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
        <circle cx="16" cy="4" r="2" fill="#0a66c2"/>
        <path d="M12 8a4 4 0 0 1 4-4" stroke="#0a66c2"/>
      </svg>
    </div>
    <div class="lia-message-content">
      <div class="lia-typing-indicator">
        <div class="lia-typing-dot"></div>
        <div class="lia-typing-dot"></div>
        <div class="lia-typing-dot"></div>
      </div>
    </div>
  `

    messagesContainer.appendChild(typingDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  function hideTypingIndicator() {
    const typingIndicator = document.getElementById("lia-typing-indicator")
    if (typingIndicator) {
      typingIndicator.remove()
    }
  }

  async function generateChatResponse(message) {
    // check if post suggestion enabled
    if (!settings.post_enabled) return

    // Create body for request
    const body = {
      message: message,
      reference: chatbotState.referencedContent,
      userInfo: {...linkedinUserInfo}
    }

    const response = await fetch(`https://api.getlia.live/api/chat/${chatbotState.currentConversationId}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await accessToken()}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to generate response")
    }

    return data.reply
  }

  async function startNewConversation() {
    // Clear current chat
    const messagesContainer = document.getElementById("lia-messages-container")
    messagesContainer.innerHTML = `
    <div class="lia-message assistant">
      <div class="lia-message-avatar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
          <circle cx="16" cy="4" r="2" fill="#0a66c2"/>
          <path d="M12 8a4 4 0 0 1 4-4" stroke="#0a66c2"/>
        </svg>
      </div>
      <div class="lia-message-content">
      Hi! I'm Lia, your LinkedIn Intelligence Assistant. <br/><br/> I'm here to help you write posts, polish comments, and improve your content. <br/><br/>What can I assist you with today?
      </div>
    </div>
  `

    // now instead of creating a new conversation, we will create a new chat in api server
    async function createNewChat() {
      const response = await fetch(`https://api.getlia.live/api/chat/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await accessToken()}`,
        },
        body: JSON.stringify({
          title: "New Chat",
        }),
        credentials: "include",
      })
      const chat = await response.json()
      if (!response.ok) {
        throw new Error(chat.error?.message || "Failed to create new chat")
      }
      chatbotState.currentConversationId = chat.id
      return chat
    }

    try {
      await createNewChat()
    } catch (error) {
      console.error("Error creating new chat:", error)
      // try refreshing the token

      try {
        await refreshToken()
        createNewChat() // try again after refreshing token
      } catch (error) {
        console.error("Error refreshing token:", error)
        // Couldn't refresh token, couldn't create new chat
        // Give up and show error message to user
        addMessageToChat("assistant", "Unable to create new chat. Please check your connection or try signing in again <a href='https://www.getlia.live/login' target='_blank'> here</a> ")
        throw new Error("Unable to create new chat. Please check your connection or try signing in again.")
        
      }
    }

    // Update conversation list
    await updateConversationList()

    // Focus on input
    document.getElementById("lia-message-input").focus()

    // clear referenced content
    chatbotState.referencedContent = null

  }

  async function loadChatHistory() {
    //let conversations = JSON.parse(localStorage.getItem("lia-conversations") || "[]")
    let conversations = []

    // load conversations from API server
    try {
      const chats = await loadConversations()
      conversations = chats
    } catch (error) {
      console.error("Error loading conversations:", error)
      // try refreshing the token
      try {
      await refreshToken()
        conversations = await loadConversations()
      } catch {
        console.error("Error refreshing token:", error)
        // If refresh fails, fallback to localStorage
        //conversations = JSON.parse(localStorage.getItem("lia-conversations") || "[]")
        addMessageToChat("assistant", "Unable to load conversations. Please check your connection or try signing in again <a href='https://www.getlia.live/login' target='_blank' style='color:blue'> here </a>")
        throw new Error("Unable to load conversations. Please check your connection or try signing in again.")
      }
    }

    chatbotState.conversations = conversations
    if (chatbotState.conversations.length === 0) {
      //addMessageToChat("assistant", "No conversations found. Start a new chat to begin!")
      startNewConversation()
      return
    }

    updateConversationList()
    
    if (conversations.length > 0) {
      chatbotState.currentConversationId = conversations[0].id
      
      loadConversation(chatbotState.currentConversationId)
    }

  }

  async function updateConversationList() {
    const conversationList = document.getElementById("lia-conversation-list")
    //let conversations = JSON.parse(localStorage.getItem("lia-conversations") || "[]")

    let conversations = []

    // load conversations from API server
    try {
      const chats = await loadConversations()
      conversations = chats
    } catch (error) {
      console.error("Error loading conversations:", error)
      // try refreshing the token
      try {
      await refreshToken()
        conversations = await loadConversations()
      } catch {
        console.error("Error refreshing token:", error)
      }
    }


    conversationList.innerHTML = conversations
      .map(
        (conv) => {
          const truncatedTitle = conv.title.slice(0, 10) + (conv.title.length > 15 ? "..." : "");
          return `
            <div class="lia-conversation-item-wrapper" style="position: relative;">
              <div class="lia-conversation-item ${conv.id === chatbotState.currentConversationId ? "active" : ""}" 
                  data-id="${conv.id}" title="${conv.title}" style="cursor: pointer; padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between;">
                <span style="flex: 1; overflow: hidden;" class='truncatedTitle'>${truncatedTitle}</span>
                <span class="lia-menu-trigger" style="cursor: pointer; padding: 4px; border-radius: 4px; opacity: 0.7; transition: opacity 0.2s;">⋯</span>
              </div>
              <div class="lia-menu" style="display: none; position: absolute; right: 0; top: 100%; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; min-width: 120px; overflow: hidden;">
                <button class="lia-rename-chat-btn" data-id="${conv.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                  <span style="margin-right: 8px;">✏️</span>Rename
                </button>
                ${/*<button class="lia-duplicate-chat-btn" data-id="${conv.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                  <span style="margin-right: 8px;">📋</span>Duplicate
                </button>
                <button class="lia-export-chat-btn" data-id="${conv.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                  <span style="margin-right: 8px;">💾</span>Export
                </button>*/ ""}
                <div style="height: 1px; background: #e0e0e0; margin: 4px 0;"></div>
                <button class="lia-delete-chat-btn" data-id="${conv.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #dc3545; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                  <span style="margin-right: 8px;">🗑️</span>Delete Chat
                </button>
              </div>
            </div>
          `;
        }
      )
      .join("");

    // Add hover effects for menu items
    const style = document.createElement('style');
    style.textContent = `
      .lia-conversation-item:hover .lia-menu-trigger {
        opacity: 1 !important;
        background-color: rgba(0,0,0,0.1);
      }
      .lia-menu button:hover {
        background-color: #f5f5f5 !important;
      }
      .lia-delete-chat-btn:hover {
        background-color: #fff5f5 !important;
      }
    `;
    document.head.appendChild(style);

    // Add click to load conversation
    document.querySelectorAll(".lia-conversation-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        // Prevent menu trigger click from also loading conversation
        if (e.target.classList.contains("lia-menu-trigger")) return;
        loadConversation(item.dataset.id);
      });
    });

    // Add menu toggle
    document.querySelectorAll(".lia-menu-trigger").forEach((menuBtn) => {
      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const menu = menuBtn.closest('.lia-conversation-item-wrapper').querySelector('.lia-menu');
        // Close other menus
        document.querySelectorAll(".lia-menu").forEach(m => {
          if (m !== menu) m.style.display = "none";
        });
        menu.style.display = menu.style.display === "block" ? "none" : "block";
      });
    });

    // Add rename chat action
    document.querySelectorAll(".lia-rename-chat-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const conv = conversations.find(c => c.id === id);
        if (conv) {
          const truncatedTitleSpan = btn.closest('.lia-conversation-item-wrapper').querySelector('.truncatedTitle');
          if (truncatedTitleSpan) {
            truncatedTitleSpan.contentEditable = "true";
            truncatedTitleSpan.focus();

            // Move cursor to end
            document.execCommand('selectAll', false, null);
            document.getSelection().collapseToEnd();

            // Save on Enter or blur
            function finishEdit(e) {
              if (e.type === "keydown" && e.key !== "Enter") return;
              e.preventDefault();
              truncatedTitleSpan.contentEditable = "false";
              const newTitle = truncatedTitleSpan.textContent.trim();
              if (newTitle && newTitle !== conv.title) {
                renameConversation(id, newTitle);
              }
              truncatedTitleSpan.removeEventListener("keydown", finishEdit);
              truncatedTitleSpan.removeEventListener("blur", finishEdit);
            }
            truncatedTitleSpan.addEventListener("keydown", finishEdit);
            truncatedTitleSpan.addEventListener("blur", finishEdit);
          }
        }
        // Close menu
        document.querySelectorAll(".lia-menu").forEach(m => m.style.display = "none");
      });
    });

    // Add duplicate chat action
    document.querySelectorAll(".lia-duplicate-chat-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        duplicateConversation(id); // Implement this function
        // Close menu
        document.querySelectorAll(".lia-menu").forEach(m => m.style.display = "none");
      });
    });

    // Add export chat action
    document.querySelectorAll(".lia-export-chat-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        exportConversation(id); // Implement this function
        // Close menu
        document.querySelectorAll(".lia-menu").forEach(m => m.style.display = "none");
      });
    });

    // Add delete chat action
    document.querySelectorAll(".lia-delete-chat-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        deleteConversation(id);
        
        // Close menu
        document.querySelectorAll(".lia-menu").forEach(m => m.style.display = "none");
      });
    });

    // Close menu when clicking elsewhere
    document.addEventListener("click", (e) => {
      if (!e.target.closest('.lia-menu') && !e.target.classList.contains('lia-menu-trigger')) {
        document.querySelectorAll(".lia-menu").forEach(m => m.style.display = "none");
      }
    });
  }

  // chat actions
  function deleteConversation(id) {

    // Remove from API server
    async function deleteChat() {
      const response = await fetch(`https://api.getlia.live/api/chat/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await accessToken()}`,
        },
        credentials: "include",
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error?.message || "Failed to delete conversation")
      }
      return result
    }

    deleteChat()
      .then(() => {
        const chatbotStateConvId = chatbotState.currentConversationId
        // updateConversationList()
        if (chatbotStateConvId == id) {
          // Remove from local state
          chatbotState.currentConversationId = null
          startNewConversation() // Start a new conversation if current is deleted
        } else {
          updateConversationList() // Just update the list if another conversation is deleted
        }
      })
      .catch((error) => {
        console.error("Error deleting conversation:", error)
        addMessageToChat("assistant", "Unable to delete conversation. Please check your connection or try signing in again <a href='https://www.getlia.live/login' target='_blank'> here </a>")
      })
  };

  function renameConversation(id, newTitle) {
    // Update in API server
    async function renameChat() {
      const response = await fetch(`https://api.getlia.live/api/chat/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await accessToken()}`,
        },
        body: JSON.stringify({ title: newTitle }),
        credentials: "include",
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error?.message || "Failed to rename conversation")
      }
      return result
    }

    renameChat()
      .then(() => {
        updateConversationList() // Refresh the conversation list
      })
      .catch((error) => {
        console.error("Error renaming conversation:", error)
        addMessageToChat("assistant", "Unable to rename conversation. Please check your connection or try signing in again <a href='https://www.getlia.live/login' target='_blank'> here </a>")
      })
  }
  

  async function loadConversation(conversationId) {
    //const conversations = JSON.parse(localStorage.getItem("lia-conversations") || "[]")
    //let conversation = conversations.find((c) => c.id === conversationId)

    let conversation = null

    // load conversation form API server
    async function loadChats () {
      const response = await fetch(`https://api.getlia.live/api/chat/${conversationId}/messages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await accessToken()}`,
        },
        credentials: "include",
      })
      const chats = await response.json()
      if (!response.ok) {
        throw new Error(chats.error?.message || "Failed to load conversation")
      }
      return chats
    }

    try {
      const chats = await loadChats()
      conversation = chats
    } catch (error) {
      console.error("Error loading conversation:", error)
      // try refreshing the token
      try {
        await refreshToken()
        const chats = await loadChats()
        conversation = chats
      }
      catch (refreshError) {
        console.error("Error refreshing token:", refreshError)
        // fails to refresh token, fails to load conversation
        // Give up and show error message to user
        throw new Error("Unable to load conversation. Please check your connection or try signing in again.")
      }
    }

    if (!conversation) return

    chatbotState.currentConversationId = conversationId

    const messagesContainer = document.getElementById("lia-messages-container")
    messagesContainer.innerHTML = conversation.messages
      .map(
        (msg) => {
          if (msg.role === "reference") {
            const refContent = JSON.parse(msg.content)
            return `
                  <div class="lia-referenced-content">
                    <div class="lia-referenced-content-header">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                      </svg>
                      Referenced ${refContent.type}
                      ${refContent.author ? `by ${refContent.author}` : ""}
                      <button class="lia-clear-reference" onclick="clearReferencedContent()">×</button>
                    </div>
                    <div class="lia-referenced-content-preview">
                      ${refContent.text.substring(0, 150)}${refContent.text.length > 150 ? "..." : ""}
                    </div>
                  </div>
                `
          } else {
          
            return `
                <div class="lia-message ${msg.role}">
                  <div class="lia-message-avatar">${msg.role === "user" ? "U" : `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/>
                      <circle cx="4" cy="4" r="2"/>
                      <circle cx="16" cy="4" r="2" fill="#0a66c2"/>
                      <path d="M12 8a4 4 0 0 1 4-4" stroke="#0a66c2"/>
                    </svg>
                  `}</div>
                  <div class="lia-message-content" ${msg.role === "user" ? `style='color: #fff;'` : ""}>
                    ${formatMessage(msg.content)}
                  </div>
                </div>
              `
          }
        },
      )
      .join("")

    messagesContainer.scrollTop = messagesContainer.scrollHeight
    updateConversationList()
  }

  // Make functions globally available for onclick handlers
  window.loadConversation = loadConversation

  // ===== RERERENCE MODE SYSTEM =====
  async function toggleReferenceMode() {
    // Check if user has pro access
    const proAccess = await checkProAccess()
    if (!proAccess) {
      showProUpgradeModal()
      return
    }
    chatbotState.referenceMode = !chatbotState.referenceMode
    const toggleBtn = document.getElementById("lia-reference-toggle")
    if (chatbotState.referenceMode) {
      toggleBtn.classList.add("reference-active")
      toggleBtn.title = "Reference Mode: ON (Click posts to reference)"
      initializeReferenceMode()
      showTemporaryNotification("📎 Reference Mode ON - Click any post to reference it", "success")
    } else {
      toggleBtn.classList.remove("reference-active")
      toggleBtn.title = "Reference Mode (Pro)"
      disableReferenceMode()
      showTemporaryNotification("Reference Mode OFF", "info")
    }
  }

  async function checkProAccess() {
    // For now, return true for demo. In production, check user's subscription status
    //return true
    // Production implementation:
    // const { access_token } = await chrome.storage.local.get(['access_token'])
    // if (!access_token) return false
    //
    let response = await fetch('https://api.getlia.live/api/user/subscription', {
      headers: { Authorization: `Bearer ${await accessToken()}` },
      credentials: "include"
    })
    let data = await response.json()

    // try to refresh the token
    if (data.error) {
      await refreshToken()

      // fetching again
      response = await fetch('https://api.getlia.live/api/user/subscription', {
        headers: { Authorization: `Bearer ${await accessToken()}` },
        credentials: "include"
      })
      data = await response.json()
    }

    // return plan
    return data.isPro
  }

  function showProUpgradeModal() {
    const modal = document.createElement("div")
    modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100001;
  `
    modal.innerHTML = `
    <div style="
      background: white;
      padding: 32px;
      border-radius: 16px;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
    ">
      <div style="font-size: 48px; margin-bottom: 16px;">:rocket:</div>
      <h2 style="margin: 0 0 16px 0; color: #0A66C2;">Upgrade to Pro</h2>
      <p style="margin: 0 0 24px 0; color: #666;">
        Reference Mode lets you click any LinkedIn post to analyze it with AI.
        Get insights, summaries, and contextual responses!
      </p>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button class='reference-modal-cancel-button' style="
          padding: 12px 24px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 8px;
          cursor: pointer;
        ">Maybe Later</button>
        <button class='reference-modal-upgrade-button' style="
          padding: 12px 24px;
          background: linear-gradient(135deg, #0A66C2, #004182);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        ">Upgrade Now</button>
      </div>
    </div>
  `
    document.body.appendChild(modal)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove()
      }
    })

    // open pricing page when upgrad button is clicked
    document.querySelector(".reference-modal-upgrade-button").addEventListener("click", () => {
      window.open("https://getlia.live/pricing", "_blank")
      modal.remove()
    })

    // close modal on cancel
    document.querySelector(".reference-modal-cancel-button").addEventListener("click", () => {
      modal.remove()
    })
  }
  function initializeReferenceMode() {
    // Add hover listeners to LinkedIn posts
    addReferenceListeners()
    // Add reference mode indicator
    showReferenceIndicator()
  }
  function disableReferenceMode() {
    // Remove all reference overlays and listeners
    document.querySelectorAll(".lia-reference-overlay").forEach((el) => el.remove())
    document.querySelectorAll(".linkedin-post-hoverable").forEach((el) => {
      el.classList.remove("linkedin-post-hoverable")
    })
    hideReferenceIndicator()
  }
  function addReferenceListeners() {
    // LinkedIn post selectors
    const postSelectors = [
      ".feed-shared-update-v2",
      ".feed-shared-update-detail-viewer__content",
      ".reader-article-content",
      ".comments-comment-item",
    ]
    postSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((post) => {
        if (post.classList.contains("linkedin-post-hoverable")) return
        post.classList.add("linkedin-post-hoverable")
        // Create overlay
        const overlay = document.createElement("div")
        overlay.className = "lia-reference-overlay"
        post.style.position = "relative"
        post.appendChild(overlay)
        // Add click listener
        post.addEventListener("click", (e) => {
          if (chatbotState.referenceMode) {
            e.preventDefault()
            e.stopPropagation()
            capturePostReference(post)
          }
        })
      })
    })

    // Add click listener to clear reference
    const clearReferenceBtn = document.querySelector(".lia-clear-reference")
    if (clearReferenceBtn) {
      clearReferenceBtn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        clearReferencedContent()
      })
    }
  }
  function capturePostReference(postElement) {
    const content = extractPostContent(postElement)
    if (content) {
      chatbotState.referencedContent = content
      showReferencedContent()
      showTemporaryNotification("✔ Content Referenced! Ask me about it.", "success")
      // Auto-focus chat input
      const chatInput = document.getElementById("lia-message-input")
      if (chatInput) {
        chatInput.focus()
        chatInput.placeholder = "Ask me about the referenced content..."
      }
    }
  }
  function extractPostContent(element) {
    try {
      const content = {
        type: "unknown",
        author: "",
        text: "",
        engagement: {},
        timestamp: "",
        url: window.location.href,
      }
      // Detect content type and extract accordingly
      if (element.classList.contains("feed-shared-update-v2") || element.classList.contains("feed-shared-update-detail-viewer__content")) {
        // Regular LinkedIn post
        content.type = "post"
        // Extract author
        const authorElement = element.querySelector(".update-components-actor__title span span span:not(.visually-hidden)")
        if (authorElement) {
          content.author = authorElement.textContent.trim()
        }
        // Extract post text
        const textElement = element.querySelector(".feed-shared-update-v2__description")
        if (textElement) {
          content.text = textElement.textContent.trim()
        }
        // Extract engagement
        const likeElement = element.querySelector(".social-details-social-counts__reactions")
        if (likeElement) {
          content.engagement.likes = likeElement.textContent.trim()
        }
        const commentElement = element.querySelector(".social-details-social-counts__comments")
        if (commentElement) {
          content.engagement.comments = commentElement.textContent.trim()
        }
      } else if (element.classList.contains("reader-article-content")) {
        // LinkedIn article
        content.type = "article"
        const titleElement = document.querySelector(".reader-article-header__title")
        if (titleElement) {
          content.title = titleElement.textContent.trim()
        }
        const authorElement = document.querySelector(".reader-author-info__content")
        if (authorElement) {
          content.author = authorElement.textContent.trim()
        }
        content.text = element.textContent.trim().substring(0, 1000) + "..."
      } else if (element.classList.contains("comments-comment-item")) {
        // Comment
        content.type = "comment"
        const authorElement = element.querySelector(".comments-comment-meta__description-title")
        if (authorElement) {
          content.author = authorElement.textContent.trim()
        }
        const textElement = element.querySelector(".comments-comment-item__main-content")
        if (textElement) {
          content.text = textElement.textContent.trim()
        }
      }
      return content
    } catch (error) {
      console.error("Error extracting post content:", error)
      return null
    }
  }
  function showReferencedContent() {
    const messagesContainer = document.getElementById("lia-messages-container")
    if (!messagesContainer || !chatbotState.referencedContent) return
    // Remove existing reference display
    const existingRef = messagesContainer.querySelector(".lia-referenced-content")
    if (existingRef) existingRef.remove()
    const refDiv = document.createElement("div")
    refDiv.className = "lia-referenced-content"
    refDiv.innerHTML = `
    <div class="lia-referenced-content-header">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
      </svg>
      Referenced ${chatbotState.referencedContent.type}
      ${chatbotState.referencedContent.author ? `by ${chatbotState.referencedContent.author}` : ""}
      <button class="lia-clear-reference">×</button>
    </div>
    <div class="lia-referenced-content-preview">
      ${chatbotState.referencedContent.text.substring(0, 150)}${chatbotState.referencedContent.text.length > 150 ? "..." : ""}
    </div>`
    messagesContainer.appendChild(refDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  function clearReferencedContent() {
    chatbotState.referencedContent = null
    const refDiv = document.querySelector(".lia-referenced-content")
    if (refDiv) refDiv.remove()
    const chatInput = document.getElementById("lia-message-input")
    if (chatInput) {
      chatInput.placeholder = "What do you want to post?"
    }
  }

  function showReferenceIndicator() {
    const indicator = document.createElement("div")
    indicator.id = "lia-reference-indicator"
    indicator.style.cssText = `
    position: fixed;
    top: 45px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #0A66C2, #004182);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    z-index: 10001;
    box-shadow: 0 4px 12px rgba(10, 102, 194, 0.3);
    animation: slideInDown 0.3s ease;
  `
    indicator.textContent = "📎 Reference Mode Active - Click any post to analyze it"
    document.body.appendChild(indicator)
  }
  function hideReferenceIndicator() {
    const indicator = document.getElementById("lia-reference-indicator")
    if (indicator) indicator.remove()
  }
  function showTemporaryNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.style.cssText = `
    position: fixed;
    top: 18%;
    right: 20px;
    background: ${type === "success" ? "#10B981" : type === "error" ? "#EF4444" : "#0A66C2"};
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 10002;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: slideInRight 0.3s ease;
    max-width: 300px;
  `
    notification.textContent = message
    document.body.appendChild(notification)
    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease"
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }
  // Make function globally available
  window.clearReferencedContent = clearReferencedContent
 

  // Make the chatbot interface draggable
  function makeChatbotDraggable() {
    const chatbotInterface = document.getElementById('lia-chatbot-interface');
    let offsetX, offsetY;

    chatbotInterface.addEventListener('mousedown', (e) => {
      offsetX = e.clientX - chatbotInterface.getBoundingClientRect().left;
      offsetY = e.clientY - chatbotInterface.getBoundingClientRect().top;

      function onMouseMove(e) {
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;

        // Ensure the chatbot stays within the viewport
        const maxX = window.innerWidth - chatbotInterface.offsetWidth;
        const maxY = window.innerHeight - chatbotInterface.offsetHeight;

        chatbotInterface.style.left = `${Math.min(Math.max(0, newX), maxX)}px`;
        chatbotInterface.style.top = `${Math.min(Math.max(0, newY), maxY)}px`;
      }

      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      e.preventDefault();
    });
  }

  // chatbot helper functions
  async function loadConversations() {
    const access_token = await accessToken()
    const response = await fetch(`https://api.getlia.live/api/chat/history`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      credentials: "include",
    })
    const chats = await response.json()
    if (!response.ok) {
      throw new Error(chats.error?.message || "Failed to load conversations")
    }
    return chats
  }

  // helper function for farmating chat conversations
  function formatMessage(message) {
    let formattedMessage = formatLinks(message)
    formattedMessage = formatMarkdown(formattedMessage)

    return formattedMessage
  }

  // format links
  function formatLinks(text) {
    // Avoid touching existing anchor tags by splitting on them
    return text.replace(/(<a [^>]+>.*?<\/a>)|(\bhttps?:\/\/[^\s<]+)/g, (match, anchor, url) => {
      if (anchor) return anchor; // return existing anchor tags untouched
      if (url) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="lia-link">${url} <span class="lia-link-icon">🔗</span></a>`;
      }
      return match;
    });
  }

  function formatMarkdown(text) {
    // Headers
    text = text.replace(/^### (.*$)/gm, '<h3 class="lia-h3">$1</h3>');
    text = text.replace(/^## (.*$)/gm, '<h2 class="lia-h2">$1</h2>');
    text = text.replace(/^# (.*$)/gm, '<h1 class="lia-h1">$1</h1>');

    // Bold text **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic text *text*
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Code blocks ```code```
    text = text.replace(/```([\s\S]*?)```/g, function(match, code) {
      // Escape HTML in code
      // Remove HTML tags and their content (e.g., <a>...</a>)
      // This will remove tags and their inner text
      return `<pre class="lia-code-block" style='position: relative'><code>${code}</code></pre>`;
    });

    // Inline code `code`
    text = text.replace(/`([^`]+)`/g, '<code class="lia-inline-code">$1</code>');

    // Unordered lists
    text = text.replace(/^\* (.*$)/gm, '<li class="lia-list-item">$1</li>');
    text = text.replace(/(<li class="lia-list-item">.*<\/li>)/s, '<ul class="lia-list">$1</ul>');

    // Ordered lists  
    text = text.replace(/^\d+\. (.*$)/gm, '<li class="lia-ordered-item">$1</li>');
    text = text.replace(/(<li class="lia-ordered-item">.*<\/li>)/s, '<ol class="lia-ordered-list">$1</ol>');

    // Line breaks (double newlines become paragraphs)
    text = text.replace(/\n\n/g, '</p><p class="lia-paragraph">');
    text = '<p class="lia-paragraph">' + text + '</p>';

    // Single line breaks
    text = text.replace(/\n/g, '<br>');

    return text;
  }

  function createCopyButton(content) {
    const copyBtn = document.createElement("button");
    copyBtn.className = "lia-copy-btn";
    copyBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
    `;
    copyBtn.title = "Copy message";
    copyBtn.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 6px;
      cursor: pointer;
      opacity: 0;
      transition: all 0.2s ease;
      z-index: 10;
      backdrop-filter: blur(4px);
    `;

    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(content.trim());
        copyBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
        `;
        copyBtn.style.background = "#f0fdf4";
        copyBtn.style.borderColor = "#10b981";
        
        setTimeout(() => {
          copyBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          `;
          copyBtn.style.background = "rgba(255, 255, 255, 0.9)";
          copyBtn.style.borderColor = "#e9ecef";
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    });

    return copyBtn;
  }

  function createRegenerateButton() {
    const regenBtn = document.createElement("button");
    regenBtn.className = "lia-regenerate-btn";
    regenBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="23,4 23,10 17,10"/>
        <polyline points="1,20 1,14 7,14"/>
        <path d="M20.49,9A9,9,0,0,0,5.64,5.64L1,10m22,4L18.36,18.36A9,9,0,0,1,3.51,15"/>
      </svg>
    `;
    regenBtn.title = "Regenerate response";
    regenBtn.style.cssText = `
      position: absolute;
      top: 8px;
      right: 50px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 6px;
      cursor: pointer;
      opacity: 0;
      transition: all 0.2s ease;
      z-index: 10;
      backdrop-filter: blur(4px);
    `;

    regenBtn.addEventListener("click", () => {
      // Add regenerate functionality here
      console.log("Regenerate response");
      // You can call your AI generation function again
    });

    return regenBtn;
  }
  
  // Initialize chatbot when extension loads
  initializeChatbot()
})()
