(() => {

  let settings = {
    tone: "professional",
    industry: "technology",
    chatbot_enabled: true,
    reply_enabled: true,
    rewrite_enabled: true,
    isRewriting: false,
    linkedinTheme: "light",

    // personas
    selectedPersona: "professional",
    selectedTemplate: null
  }

  let liaUser = null;

  // number of conversations to load for pagination
  let numberOfConversationsToLoad = 10;
  // number of notes to load
  let numberOfNotesToLoad = 10;

  const getUserAvatar = () => {
    if (liaUser && liaUser.profile_picture_url) {
      return `<img class="lia-chat-user-avatar" src="${liaUser.profile_picture_url}" alt="User Avatar" />`;
    }
    return 'U';
  }

  // Load settings when content script initializes
  chrome.storage.sync.get(["tone", "industry", "chatbot_enabled", "reply_enabled", "rewrite_enabled", "linkedinTheme", "selectedPersona"], (data) => {
    settings = { ...settings, ...data }
    initializeExtension()
  })

  // Listen for settings updates
  chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "settingsUpdated") {
      await chrome.storage.sync.get(["tone", "industry", "chatbot_enabled", "reply_enabled", "rewrite_enabled", "linkedinTheme", "selectedPersona"], (data) => {
        settings = { ...settings, ...data }
      })
      initializeExtension()
    }
  })

  // Listen for auth tokens after sign-in or signup on the website
  window.addEventListener('message', async (event) => {
    if (event.origin !== 'https://www.getlia.live') return;
    if (event.source !== window) return;

    if (event.data.type === 'SEND_JWTs') {
      chrome.runtime.sendMessage({
        type: 'STORE_JWTs',
        access_token: event.data.access_token,
        refresh_token: event.data.refresh_token
      });
      liaUser = await window.getLiaUserInfo()
      initializeChatbot()
    }

    // clear tokens when logout on the website
    if (event.data.type === 'CLEAR_JWTs') {
      await window.lia_clearTokens();

      liaUser = null;
    }
  });

  // utility functions

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

  async function initializeExtension() {
    // detect theme first
    const theme = await window.detectLinkedInTheme();
    settings.linkedinTheme = theme || 'light'

    // Initialize the extension functionality
    setupCommentReplyAssistant()
    setuprewrite_enabledment()
    setupTextSelectionToolbar()

    // lia user
    liaUser = await window.getLiaUserInfo()
    if (!liaUser) {
      console.warn('LIA user not found, user might not be authenticated');
    }

    let mutationTimeout

    // Set up mutation observer to detect new elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        clearTimeout(mutationTimeout)
        mutationTimeout = setTimeout(async () => {
          if (mutation.addedNodes.length) {
            try {
              // detect theme first
              const theme = await window.detectLinkedInTheme()
              settings.linkedinTheme = theme || 'light'

              setupCommentReplyAssistant()
              setuprewrite_enabledment()
              setupTextSelectionToolbar()

              if (liaUser === null) {
                liaUser = await window.getLiaUserInfo()
              }

              if (chatbotState.referenceMode) {
                // Re-add reference listeners if in reference mode
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

  // Check if all characters in the string are bold Unicode
  function isBoldUnicode(text) {
    return [...text].every(char => {
      const code = char.codePointAt(0);
      return (
        (code >= 0x1D400 && code <= 0x1D419) || // bold A-Z
        (code >= 0x1D41A && code <= 0x1D433) || // bold a-z
        (code >= 0x1D7CE && code <= 0x1D7D7)    // bold 0-9
      );
    });
  }

  // Check if all characters in the string are italic Unicode
  function isItalicUnicode(text) {
    return [...text].every(char => {
      const code = char.codePointAt(0);
      return (
        (code >= 0x1D434 && code <= 0x1D44D) || // italic A-Z
        (code >= 0x1D44E && code <= 0x1D467) || // italic a-z
        char === 'ℎ' // special italic h
      );
    });
  }

  function setupTextSelectionToolbar() {

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

    const logoContainer = document.createElement("div")
    logoContainer.className = "toolbar-logo"
    logoContainer.style.cssText = `
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0a66c2, #004182);
      border-radius: 8px 0 0 8px;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    `
  
    logoContainer.innerHTML = `
    <svg class="lia-logo" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
        <circle cx="16" cy="4" r="2" fill="#ffffff"/>
        <path d="M12 8a4 4 0 0 1 4-4" stroke="#ffffff"/>
      </svg>
    `

    toolbar.appendChild(logoContainer)

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
    const selectedText = selection.toString()
   
    if (!selectedText) return

    let formattedText = selectedText

    switch (type) {
      case 'bold':
        if (isItalicUnicode(selectedText.trim())) {
          formattedText = fromUnicodeToNormal(selectedText, 'italic') // convert to normal
        } if (isUnicode(selectedText.trim())) {
          formattedText = fromUnicodeToNormal(selectedText, 'bold') // convert to normal text
        } else {
          // Use Unicode bold characters or formatting symbols
          formattedText = toUnicodeStyle(selectedText) // convert to unicode bold
        }
        break
      case 'italic':
        if (isBoldUnicode(selectedText.trim())) {
          formattedText = fromUnicodeToNormal(selectedText, 'bold') // convert to normal text
        } if (isUnicode(selectedText.trim())) {
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
      transformedText = await generateRewrittenText(selectedText, type)
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

      let rewrittenText = await generateRewrittenText(fullSentence, 'rewrite');
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

    const response = await window.lia_fetchWithAuth('https://api.getlia.live/api/prompt/improve', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await accessToken()}`,
      },
      credentials: 'include',
      body: JSON.stringify({prompt, type}),
    })

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to transform text")
    }
    
    const data = await response.json()

    return data.response
  }

  function replaceSelectedText(newText) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    if (!selectedText) return;

    // Replace exactly what's selected
    range.deleteContents();
    const textNode = document.createTextNode(newText);
    range.insertNode(textNode);

    // Move caret after inserted text
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);

    // Dispatch input event
    let editor = textNode.parentElement;
    while (editor && !editor.isContentEditable) {
      editor = editor.parentElement;
    }

    if (editor) {
      const inputEvent = new Event('input', { bubbles: true });
      editor.dispatchEvent(inputEvent);
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

  function setupCommentReplyAssistant() {
    if (!settings.reply_enabled) return

    // Find all comment input areas
    const commentInputs = document.querySelectorAll(".comments-comment-texteditor")

    commentInputs.forEach((input) => {
      // Check if we've already added our button
      /*if (input.querySelector(".linkedin-ai-button")) return

      // Find the comment actions area
      const actionsArea = input.querySelector(".comments-comment-box-comment__text-editor")

      if (actionsArea) {
        // Create AI assistant button
        const aiButton = document.createElement("button")
        aiButton.className = "linkedin-ai-button"

        // setup background color based on the current theme
        if (settings.linkedinTheme === 'dark') {
          aiButton.style.backgroundColor = '#71b7fb'
        }
        
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
      }*/

      addReplyAssistant(input)
    })
  }

  /*function setupCommentReplyAssistant() {
    if (!settings.reply_enabled) return

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Look for comment input areas
            const commentInputs = node.querySelectorAll('.comments-comment-texteditor, .ql-editor[data-placeholder*="comment"]')
            commentInputs.forEach(addReplyAssistant)
            
            // Also check the node itself
            if (node.matches && node.matches('.comments-comment-texteditor, .ql-editor[data-placeholder*="comment"]')) {
              addReplyAssistant(node)
            }
          }
        })
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Add to existing comment inputs
    document.querySelectorAll('.comments-comment-texteditor, .ql-editor[data-placeholder*="comment"]').forEach(addReplyAssistant)
  }*/

  function addReplyAssistant(commentInput) {
    if (commentInput.querySelector('.lia-reply-assistant')) return

    // Find the comment actions area
      const actionsArea = commentInput.querySelector(".comments-comment-box-comment__text-editor")

    if (!actionsArea) return

    const assistantContainer = document.createElement('div')
    assistantContainer.className = `lia-reply-assistant ${settings.linkedinTheme === 'dark' ? 'dark' : ''}`
    assistantContainer.innerHTML = `
      <button class="linkedin-ai-button ${settings.linkedinTheme === 'dark' ? 'dark' : ''}" title="Generate AI Reply" style="font-size: 12px; padding: 4px 8px;" >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Zm0 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
        </svg>
        AI Reply
      </button>
      <div class="lia-persona-selector">
        <button class="lia-persona-btn" id="lia-persona-${Date.now()}" style="font-size: 12px; padding: 4px 8px;">
          <span class="lia-persona-icon">${PERSONAS[settings.selectedPersona].icon}</span>
          <!--<span class="lia-persona-name">${PERSONAS[settings.selectedPersona].name}</span>-->
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </button>
        <div class="lia-persona-dropdown" style="display: none;">
          ${Object.entries(PERSONAS).map(([key, persona]) => `
            <div class="lia-persona-option ${key === settings.selectedPersona ? 'active' : ''}" data-persona="${key}">
              <span class="lia-persona-icon">${persona.icon}</span>
              <div class="lia-persona-info">
                <div class="lia-persona-name">${persona.name}</div>
                <div class="lia-persona-desc">${persona.description}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `

    // Add button to actions area
    actionsArea.prepend(assistantContainer)

    // Add event listeners
    const personaBtn = assistantContainer.querySelector('.lia-persona-btn')
    const personaDropdown = assistantContainer.querySelector('.lia-persona-dropdown')
    const replyBtn = assistantContainer.querySelector('.linkedin-ai-button')

    personaBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      e.preventDefault()
      personaDropdown.style.display = personaDropdown.style.display === 'none' ? 'block' : 'none'
    })

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      personaDropdown.style.display = 'none'
    })

    // Handle persona selection
    assistantContainer.querySelectorAll('.lia-persona-option').forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation()
        const personaKey = option.dataset.persona
        selectPersona(personaKey, assistantContainer)
        personaDropdown.style.display = 'none'
      })
    })

    replyBtn.addEventListener('click', (e) => {
      e.preventDefault()
      handlereply_enabledant(commentInput)
    })
  }

  async function selectPersona(personaKey, container) {
    settings.selectedPersona = personaKey
    await chrome.storage.sync.set({ selectedPersona: personaKey })
    console.log('awesome')
    
    const persona = PERSONAS[personaKey]
    const personaBtn = container.querySelector('.lia-persona-btn')
    personaBtn.innerHTML = `
      <span class="lia-persona-icon">${persona.icon}</span>
      <!--<span class="lia-persona-name">${persona.name}</span>-->
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6,9 12,15 18,9"/>
      </svg>
    `
    
    // Update active state in dropdown
    container.querySelectorAll('.lia-persona-option').forEach(option => {
      option.classList.remove('active')
    })
    container.querySelector(`[data-persona="${personaKey}"]`).classList.add('active')
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
        // setup background color based on the current theme
        if (settings.linkedinTheme === 'dark') {
          aiButton.style.backgroundColor = '#71b7fb'
        }
        
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
            showTemporaryMessage(qlEditor, "LIA is rewriting text. Please wait for the process is complete.")
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

    // adapt background color based on the current linkedin theme
    if (settings.linkedinTheme === 'dark') {
      suggestionsContainer.style.backgroundColor = "#293139"
      suggestionsContainer.style.border = "0"
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
          if (suggestions && suggestions.error && suggestions.error.includes('missing plan')) {
            suggestionsContainer.innerHTML = `
            <div style="color: red; padding: 10px;">
            Please upgrade your plan to use this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Upgrade Now</a>
            </div>
            `
            return
          } else if (suggestions && suggestions.error && suggestions.error.includes('Plan expired')) {
            suggestionsContainer.innerHTML = `
            <div style="color: red; padding: 10px;">
            Your plan has expired. Please renew your subscription to continue using this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Renew Now</a>
            </div>
            `
            return
          } 
        } catch (error) {
            console.error("Error generating reply suggestions:", error)
            throw new Error("Failed to generate suggestions")
        }
      } else {
        // we are replying to a post

        // Generate suggestions

        try {
          suggestions = await generateCommentSuggestions(context)
          if (suggestions && suggestions.error && suggestions.error.includes('missing plan')) {
            suggestionsContainer.innerHTML = `
            <div style="color: red; padding: 10px;">
            Please upgrade your plan to use this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Upgrade Now</a>
            </div>
            `
            return
          } else if (suggestions && suggestions.error && suggestions.error.includes('Plan expired')) {
            suggestionsContainer.innerHTML = `
            <div style="color: red; padding: 10px;">
            Your plan has expired. Please renew your subscription to continue using this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Renew Now</a>
            </div>
            `
            return
          } /*else if (suggestions && suggestions.error && suggestions.error.includes('Invalid or expired token')) {
              // try refreshing the token
              try {
                await refreshToken()
                suggestions = await generateCommentSuggestions(context)
              } catch (error) {
                console.error("Error refreshing token:", error)
                suggestionsContainer.innerHTML = `
                <div style="color: red; padding: 10px;">
                Error: ${error.message || "Failed to generate suggestions"}, maybe your session has expired. Please try signing in again, <a href='https://getlia.live' target='_blank'>here</a>.
                </div>
                `
              }
          }*/
        } catch (error) {
          console.error("Error generating comment suggestions:", error)
          throw new Error("Failed to generate suggestions")
        }
      }

      // set the ql-editor container to empty
      commentInputEditor.textContent = ''

      // Display suggestions
      displayCommentSuggestions(suggestionsContainer, suggestions, commentInput)
    } catch (error) {
      suggestionsContainer.innerHTML = `
        <div style="color: red; padding: 10px;">
        ${error || "Failed to generate suggestions"}
        </div>
        `
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
    // show temporary message of LIA is rewriting
    showTemporaryMessage(editor, 'LIA is rewriting..')

    try {
      // Generate improved version

      let improvedText = null;
      let improvements = []; // array improvements that was made on the post
      const response = await generateImprovedText(currentText)

      if (response.error && response.error.includes('missing plan')) {
        loadingOverlay.remove()
        showTemporaryMessage(editor, "Please upgrade your plan to use this feature. <a href='https://www.getlia.live/pricing' target='_blank'>Upgrade Now</a>", "error")
        settings.isRewriting = false; // reset the flag
        return
      } else if (response.error && response.error.includes('Plan expired')) {
        loadingOverlay.remove()
        showTemporaryMessage(editor, "Your plan has expired. Please renew your subscription to continue using this feature. <a href='https://www.getlia.live/pricing' target='_blank'>Renew Now</a>", "error")
        settings.isRewriting = false; // reset the flag
        return
      } else if (response.error && response.error.includes('Invalid or expired token')) {
        loadingOverlay.remove()
        showTemporaryMessage(editor, "Your session has expired. Please sign in again to continue using this feature.", "error")
        settings.isRewriting = false; // reset the flag
        return
      }

      improvedText = window.cleanAIResponse(response.response) || null
      improvements = response.improvements || []
      /*try {
        const response = await generateImprovedText(currentText)
        improvedText = window.cleanAIResponse(response.response) || null
        improvements = response.improvements || []
      } catch (error) {
        try { // call generateImprovedText again after refresh
          await refreshToken() // refresh the token
          const response = await generateImprovedText(currentText)
          improvedText = window.cleanAIResponse(response.response) || null
          improvements = response.improvements || []
        } catch (retryError) {
          throw retryError // pass it to outer catch
        }
      }*/

      // Remove loading overlay
      loadingOverlay.remove()
      if (improvedText) {
        // Perform the in-place rewrite with animation
        //await animateTextRewrite(editor, currentText, improvedText)
        await window.animateTextRewriteWithMentions(editor, currentText, improvedText, improvements)
        settings.isRewriting = false; // reset the flag
        // Show improvements made in a card like form
        window.showImprovementsMade(editor, improvements, currentText)
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
    const editorParent = editor.closest('.share-box')
    editorParent.style.position = "relative"
    editorParent.appendChild(overlay)

    return overlay
  }

  async function generateImprovedText(originalText) {

    if (!settings.rewrite_enabled) return;

    // setup prompt
    const prompt = `Improve and rewrite the following LinkedIn post to make it more engaging, professional, and impactful. Keep the core message but enhance clarity, flow, and engagement. Maintain the same tone (${settings.tone}) and make it suitable for the ${settings.industry} industry:

    "${originalText}"

    Return only the improved text without any explanations or quotes. Include proper line breaks and formatting as needed - whitespaces.`

    // fetch the response from api-server
    const response = await window.lia_fetchWithAuth("https://api.getlia.live/api/prompt/rewrite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await accessToken()}`,
      },
      credentials: 'include',
      body: JSON.stringify({prompt, originalText}),
    })

    // get the json response
    const data = await response.json()

    if (!response.ok) {
      return data
    }

    return data
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
    const container = document.createElement("div")
    container.style.cssText = `
      position: absolute;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: flex-start;
      gap: 12px;
      z-index: 10001;
      pointer-events: none;
    `

    // Color schemes
    const colors = {
      success: { avatar: "#10b981", bubble: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
      error: { avatar: "#ef4444", bubble: "#fef2f2", text: "#991b1b", border: "#fecaca" },
      info: { avatar: "#0a66c2", bubble: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
      warning: { avatar: "#f59e0b", bubble: "#fffbeb", text: "#92400e", border: "#fed7aa" },
    }

    const colorScheme = colors[type] || colors.info

    // Avatar with pulsing effect
    const avatarContainer = document.createElement("div")
    avatarContainer.style.cssText = `
      width: 44px;
      height: 44px;
      background: ${colorScheme.avatar};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px ${colorScheme.avatar}40;
      opacity: 0;
      transform: scale(0);
      transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      flex-shrink: 0;
      position: relative;
    `

    // Add pulsing ring
    const pulseRing = document.createElement("div")
    pulseRing.style.cssText = `
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border: 2px solid ${colorScheme.avatar};
      border-radius: 50%;
      opacity: 0;
      animation: pulse 2s infinite;
    `

    const pulseStyle = document.createElement("style")
    pulseStyle.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.7; }
        100% { transform: scale(1.2); opacity: 0; }
      }
    `
    document.head.appendChild(pulseStyle)

    avatarContainer.appendChild(pulseRing)
    avatarContainer.innerHTML += `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
        <circle cx="16" cy="4" r="2" fill="white"/>
        <path d="M12 8a4 4 0 0 1 4-4" stroke="white"/>
      </svg>
    `

    // Modern speech bubble
    const speechBubble = document.createElement("div")
    speechBubble.style.cssText = `
      position: relative;
      background: ${colorScheme.bubble};
      color: ${colorScheme.text};
      padding: 14px 18px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      border: 1px solid ${colorScheme.border};
      max-width: 280px;
      opacity: 0;
      transform: scale(0.7) translateY(15px);
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      backdrop-filter: blur(10px);
    `

    // Curved tail for modern look
    const bubbleTail = document.createElement("div")
    bubbleTail.style.cssText = `
      position: absolute;
      left: -8px;
      top: 15px;
      width: 20px;
      height: 20px;
      background: ${colorScheme.bubble};
      border: 1px solid ${colorScheme.border};
      border-right: none;
      border-bottom: none;
      transform: rotate(-45deg);
      border-radius: 4px 0 0 0;
    `

    const messageText = document.createElement("span")
    speechBubble.appendChild(bubbleTail)
    speechBubble.appendChild(messageText)

    container.appendChild(avatarContainer)
    container.appendChild(speechBubble)

    const editorParent = editor.closest('.share-box')
    editorParent.style.position = "relative"
    editorParent.appendChild(container)

    // Animation sequence
    setTimeout(() => {
      avatarContainer.style.opacity = "1"
      avatarContainer.style.transform = "scale(1)"
    }, 100)

    setTimeout(() => {
      speechBubble.style.opacity = "1"
      speechBubble.style.transform = "scale(1) translateY(0)"
    }, 400)

    setTimeout(() => {
      let i = 0
      const typeMessage = () => {
        if (i <= message.length) {
          messageText.textContent = message.substring(0, i) + (i < message.length ? "▋" : "")
          i++
          setTimeout(typeMessage, 40)
        }
      }
      typeMessage()
    }, 700)

    // Cleanup
    setTimeout(() => {
      container.style.transform = "translateX(-50%) scale(0.8)"
      container.style.opacity = "0"
      setTimeout(() => {
        container.remove()
        pulseStyle.remove()
      }, 1500)
    }, 4500)
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
        ${commentContentElement.innerText} -- by ${commenterName}
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

  async function generateCommentSuggestions(context) {
    // check if comment suggestions enabled by user
    if (!settings.reply_enabled) return;

    // check if acces_token is available
    const { access_token } = await chrome.storage.local.get(['access_token']);
    if (access_token == null) {
      throw new Error("Please Sign in to continue")
    };

    // Prepare the prompt
    let prompt = `Generate 3 LinkedIn comment replies that are playful, smart, and thoughtful, they should feel natural - like something a sharp professional would say in public:`
    
    let persona = {
      //name
      //description
      //icon
      //prompt
    }
      
    // Add persona context for replies
    if (settings.selectedPersona && PERSONAS[settings.selectedPersona]) {
      persona = PERSONAS[settings.selectedPersona]
    }

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
    - Without hashtags
    - Without starting with "Your"
    - Use emojis cautiously so it doesn't sound too robotic
    - Without sounding like an AI or bot
    - Avoid generic responses
    - Feel free to be slightly opinionated, clever, or relatable
    
    IMPORTANT: In addition to the instruction above the user has also selected a persona for you to follow while generating the replies. Please make sure to follow the persona instructions closely.
    PERSONA:
      Name: ${persona.name || 'N/A'}
      Description: ${persona.description || 'N/A'}
      Prompt: ${persona.prompt || 'N/A'}`

    async function generate() {
      const response = await window.lia_fetchWithAuth("https://api.getlia.live/api/prompt/suggest-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await accessToken()}`,
        },
        body: JSON.stringify({
          comment_text: prompt,
          ...(persona && { persona: persona })
        })
      })

      return await response.json()
    }

    let data = await generate()

    /*if (data.error && data.message === 'Invalid Token') {
      // refresh the token
      const { access_token } = await chrome.storage.local.get(['access_token']);
      await refreshToken(access_token);

      // retry again
      const new_data = await generate();
      data = new_data

    }*/

    if (data.error) {
      //throw new Error(data.error?.message || "Failed to generate suggestions")
      return data
    }

    const suggestions = data.suggestions;

    return suggestions
  }

  async function generateReplyToCommentSuggestions(context) {
    // check if comment suggestions enabled by user
    if (!settings.reply_enabled) return;

    // check if acces_token is available
    const { access_token } = await chrome.storage.local.get(['access_token']);
    if (access_token == null) {
      throw new Error("Please Sign in to continue")
    };

    // Prepare the prompt
    let prompt = `You are replying to a **comment** on a LinkedIn post. Generate 3 thoughtful and human-sounding LinkedIn replies`;

    let persona = {
      //name
      //description
      //icon
      //prompt
    }
      
    // Add persona context for replies
    if (settings.selectedPersona && PERSONAS[settings.selectedPersona]) {
      persona = PERSONAS[settings.selectedPersona]
    }
    
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
    
    prompt += `. The tone should be ${settings.tone} and industry should be ${settings.industry}`;
    
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
    
    Only return the 3 replies. No explanation, no intro-text or extra formatting.
    
    IMPORTANT: In addition to the instruction above the user has also selected a persona for you to follow while generating the replies. Please make sure to follow the persona instructions closely.
    PERSONA:
      Name: ${persona.name || 'N/A'}
      Description: ${persona.description || 'N/A'}
      Prompt: ${persona.prompt || 'N/A'}`;
    

    async function generate() {
      const response = await window.lia_fetchWithAuth("https://api.getlia.live/api/prompt/suggest-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await accessToken()}`,
        },
        body: JSON.stringify({
          comment_text: prompt,
          persona: persona
        })
      })  

      return await response.json()
    }

    let data = await generate()

    if (data.error) {
      //throw new Error(data.error?.message || "Failed to generate suggestions")
      return data
    }

    const suggestions = data.suggestions;

    return suggestions
  }

  function displayCommentSuggestions(container, suggestions, commentInput) {
    container.innerHTML = `
      <h3 style=${settings.linkedinTheme === 'dark' ? 'color: #71b7fb' : ''}>AI Reply Suggestions</h3>
      <div class="linkedin-ai-suggestion-list">
        ${suggestions
          .map(
            (suggestion, index) => `
          <div class="linkedin-ai-suggestion" data-index="${index}" style="${settings.linkedinTheme === 'dark' ? 'background-color: #1B1F23; color: #BEBEBE; border: 0;' : ""}">
            ${suggestion}
          </div>
        `,
          )
          .join("")}
      </div>
      <div class="linkedin-ai-actions">
        <button class="linkedin-ai-dismiss" style=${settings.linkedinTheme === 'dark' ? 'color: #71b7fb' : ''}>Dismiss</button>
        <button class="linkedin-ai-regenerate" style=${settings.linkedinTheme === 'dark' ? 'color: #71b7fb' : ''}>Regenerate</button>
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
    regenerateButton.addEventListener("click", (e) => {
      e.preventDefault()
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

  // helper function to fetch access token in chrome storage
  const accessToken = async () => {
    const { access_token } = await chrome.storage.local.get(['access_token']);
    if (!access_token) {
      throw new Error("Please Sign in to continue")
    }
    return access_token;
  }

  const PERSONAS = {
    professional: {
      name: "Professional",
      description: "Formal, industry-focused responses",
      icon: "💼",
      prompt: "Respond in a professional, formal tone suitable for business networking"
    },
    conversational: {
      name: "Conversational", 
      description: "Friendly, approachable tone",
      icon: "💬",
      prompt: "Respond in a friendly, conversational tone that builds rapport"
    },
    thoughtLeader: {
      name: "Thought Leader",
      description: "Insightful, question-provoking responses",
      icon: "🧠",
      prompt: "Respond as a thought leader with insightful, authoritative, strategic perspectives"
    },
    supportive: {
      name: "Supportive",
      description: "Encouraging, positive reinforcement",
      icon: "🤝",
      prompt: "Respond with encouragement and positive reinforcement"
    },
    analytical: {
      name: "Analytical",
      description: "Data-driven, logical responses",
      icon: "📊",
      prompt: "Respond with analytical, data-driven insights and logical reasoning"
    },
    networking: {
      name: "Networking",
      description: "Connection-building, relationship-focused",
      icon: "🌐",
      prompt: "Respond with a focus on building connections and relationships"
    },
    conciseExpert: {
      name: "Concise Expert",
      description: "Short, direct, minimal words but maximum insight",
      icon: "🎯",
      prompt: "Respond as a concise expert: use minimal words, be direct, and deliver maximum insight in each reply"
    },
  }

  let TEMPLATES = {
    microContent: {
      name: "Micro-Content",
      description: "Very short sentences. Each on new line. Maximum impact.",
      icon: "⚡",
      example: {
        author: "Sarah Chen",
        content: "Just shipped our biggest feature yet.\n\n6 months of work.\n\n3 failed attempts.\n\n1 breakthrough moment.\n\nSometimes persistence is everything.\n\nWhat's your biggest win this quarter?",
        engagement: { likes: "847", comments: "23" }
      },
      prompt: "Write in micro-content style with very short sentences, each on a new line for maximum impact"
    },
    storyArc: {
      name: "Story Arc", 
      description: "Hook → Context → Challenge → Resolution → Lesson",
      icon: "📖",
      example: {
        author: "Marcus Rodriguez",
        content: "I almost quit my job last month.\n\nAfter 3 years at the company, I felt stuck. No growth, same tasks, same meetings. The Sunday scaries were real.\n\nThen my manager pulled me aside: \"We're launching a new division. Want to lead it?\"\n\nSometimes the breakthrough comes right when you're about to give up.\n\nLesson: Have the difficult conversations before making big decisions.",
        engagement: { likes: "1.2K", comments: "67" }
      },
      prompt: "Structure your post as a story with a clear hook, context, challenge, resolution, and lesson learned"
    },
    listFormat: {
      name: "List Format",
      description: "Numbered insights, bullet points, structured takeaways",
      icon: "📝",
      example: {
        author: "Jennifer Park",
        content: "5 things I learned building a remote team:\n\n1. Overcommunicate everything\n2. Document decisions in writing\n3. Create virtual water cooler moments\n4. Respect time zones religiously\n5. Invest in good tools\n\nRemote work isn't just office work from home.\n\nIt's a completely different operating system.\n\nWhat would you add to this list?",
        engagement: { likes: "923", comments: "45" }
      },
      prompt: "Structure your content as a numbered list or bullet points with clear takeaways"
    },
    questionDriven: {
      name: "Question-Driven",
      description: "Starts with provocative question, builds to answer",
      icon: "❓",
      example: {
        author: "David Kim",
        content: "What if I told you the best networking happens when you're not trying to network?\n\nLast week at a coffee shop, I helped someone with their laptop. No business cards exchanged. No LinkedIn requests.\n\nJust one human helping another.\n\n3 days later, they introduced me to their CEO.\n\nAuthentic relationships > transactional connections.\n\nWhen did you last help someone without expecting anything back?",
        engagement: { likes: "1.5K", comments: "89" }
      },
      prompt: "Start with a provocative question and build your narrative around answering it"
    },
    vulnerableLeader: {
      name: "Vulnerable Leader",
      description: "Shares failures/struggles, shows humanity",
      icon: "💝",
      example: {
        author: "Rachel Thompson",
        content: "I made a $50K mistake last quarter.\n\nApproved a campaign without proper testing. It flopped spectacularly.\n\nMy first instinct? Hide it. Blame external factors. Make excuses.\n\nInstead, I called an all-hands meeting and owned it completely.\n\nThe team's response surprised me. They shared their own mistakes. We problem-solved together.\n\nVulnerability isn't weakness in leadership.\n\nIt's the foundation of trust.",
        engagement: { likes: "2.1K", comments: "134" }
      },
      prompt: "Share a personal failure or struggle that led to growth, showing vulnerability and humanity"
    },
    contrarian: {
      name: "Contrarian Take",
      description: "Challenges common beliefs, 'unpopular opinion' posts",
      icon: "🔥",
      example: {
        author: "Alex Morgan",
        content: "Unpopular opinion: Most networking events are a waste of time.\n\nHere's why:\n\n→ Surface-level conversations\n→ Everyone's in 'pitch mode'\n→ No real connection happens\n→ Follow-ups feel forced\n\nBetter alternatives:\n\n→ Industry workshops\n→ Volunteer opportunities  \n→ Online communities\n→ One-on-one coffee chats\n\nStop collecting business cards.\n\nStart building real relationships.\n\nAgree or disagree?",
        engagement: { likes: "856", comments: "92" }
      },
      prompt: "Present a contrarian viewpoint that challenges conventional wisdom in your industry"
    }
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

    // New notes functionality
    notesMode: false,
    notes: [],
    currentNoteId: null,
    noteContext: null, // LinkedIn profile context
    
    templateMode: false,
    selectedTemplate: null,
  }

  // save to extension storage
  async function saveChatbotState() {
    await chrome.storage.local.set({ chatbotState });
  }

  // Load state from storage on startup
  chrome.storage.local.get(['chatbotState'], (result) => {
    if (result.chatbotState) {
      Object.assign(chatbotState, result.chatbotState);
    }

  });

  // load chatbot state from storage function
  const loadChatbotState = async () => {
    // Load state from storage
    const result = await chrome.storage.local.get(['chatbotState']);
    if (result.chatbotState) {
      Object.assign(chatbotState, result.chatbotState);
    }

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

  async function initializeChatbot() {
    const { chatbot_enabled } = await chrome.storage.sync.get(["chatbot_enabled"]);
    if (!chatbot_enabled) return;
    if (window.location.href.includes("linkedin.com")) {
      await loadChatbotState()

      createChatbotButton()
      createChatbotInterface()


      if (chatbotState.notesMode) {
        // toggle notes mode for notes ui to show
        chatbotState.notesMode = false
        await toggleNotesMode()
      } else if (chatbotState.templateMode) {
        // toggle template mode for template ui to show
        chatbotState.templateMode = false
        await toggleTemplateMode()
      } else {
        // Load chat history if not in notes mode
        await loadChatHistory()
      }

      hideQuickSuggestions()
      // fetch templates from api-server
      await fetchTemplates()

      // profile url
      getUserAvatar(true)

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

    /* Note Display Styles */
    .lia-message.note {
      background: linear-gradient(135deg, #f8f9fa, #ffffff);
      border: 1px solid #e9ecef;
      border-radius: 12px;
      margin: 12px 0;
      padding: 4px;
    }
    
    .lia-message.note .lia-message-content {
      background: transparent;
      border: none;
      box-shadow: none;
    }
    
    .lia-note-content {
      position: relative;
    }
    
    .lia-note-header {
      display: flex;
      justify-content: space-between;
      width: 100%;
      gap: 12px;
      align-items: center;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e9ecef;
      position: relative;
    }
    
    .lia-note-title {
      font-weight: 600;
      color: #0a66c2;
      font-size: 14px;
    }
    
    .lia-note-timestamp {
      font-size: 11px;
      color: #6c757d;
      white-space: nowrap;
      position: absolute;
      bottom: .5px;
      right: 2px;
    }
    
    .lia-note-body {
      line-height: 1.6;
      margin-bottom: 12px;
      color: #495057;
    }
    
    .lia-note-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;
    }
    
    .lia-tag {
      background: #e7f3ff;
      color: #0a66c2;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
    }
    
    .lia-note-actions {
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.2s;
    }
    
    .lia-message.note:hover .lia-note-actions {
      opacity: 1;
    }
    
    .lia-note-action-btn {
      padding: 6px;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid #dee2e6;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .lia-note-action-btn:hover {
      background: #0a66c2;
      color: white;
      transform: scale(1.1);
    }
    
    .lia-note-action-btn.lia-delete-btn:hover {
      background: #dc3545;
    }

    .lia-input-actions {
      display: flex;
      gap: 8px;
      justify-content: center;
      align-items: center;
      padding: 8px 0;
      flex-direction: column;
      padding-right: 15px;
      border-right: 2px solid #eee;
    }

    .lia-context-info {
      color: #495057;
      margintTop: 5px;
    }
    
    /* Note formatting styles */
    .lia-note-h3 {
      font-size: 16px;
      font-weight: 600;
      color: #0a66c2;
      margin: 12px 0 8px 0;
    }
    
    .lia-note-h4 {
      font-size: 14px;
      font-weight: 600;
      color: #495057;
      margin: 10px 0 6px 0;
    }
    
    .lia-note-ul {
      margin: 8px 0;
      padding-left: 20px;
    }
    
    .lia-note-li {
      margin: 4px 0;
      color: #495057;
    }
    
    /* Loading spinner for notes */
    .lia-loading-spinner {
      border: 2px solid #f3f3f3;
      border-top: 2px solid #0a66c2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Added persona selector styles */
    .lia-reply-assistant {
      display: flex;
      gap: 8px;
      align-items: center;
      z-index: 1000;
    }

    .lia-persona-selector {
      position: relative;
    }

    .lia-persona-btn {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: var(--accent);
      border-radius: 16px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
      color: white;
    }

    .lia-persona-btn:hover, .linkedin-ai-button:hover {
      background: var(--accent-invert);
      color: var(--accent-foreground);
    }

    .lia-persona-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      min-width: 280px;
      background: var(--popover);
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      z-index: 1001;
      margin-top: 4px;
      overflow: hidden;
    }

    .lia-persona-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: all 0.2s;
      border-bottom: 1px solid var(--border);
    }

    .lia-persona-option:last-child {
      border-bottom: none;
    }

    .lia-persona-option:hover {
      background: var(--accent);
      color: var(--accent-foreground);
    }

    .lia-persona-option.active {
      background: var(--primary);
      color: var(--primary-foreground);
    }

    .lia-persona-info {
      flex: 1;
      color: var(--persona-option-color);
    }

    .lia-persona-name {
      font-weight: 600;
      font-size: 12px;
    }

    .lia-persona-desc {
      font-size: 11px;
      opacity: 0.8;
      margin-top: 2px;
    }

    .lia-persona-icon {
      font-size: 12px;
    }

    .lia-reply-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: var(--primary);
      color: var(--primary-foreground);
      border: none;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .lia-reply-btn:hover {
      background: var(--secondary);
      color: var(--secondary-foreground);
    }

    /* Added template styles */
    .lia-template-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      margin-bottom: 6px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;
      color: #495057;
    }

    .lia-template-item:hover {
      background: var(--accent);
      color: var(--accent-foreground);
      transform: translateX(4px);
      border-color: var(--primary);
    }

    .lia-template-item.active {
      background: var(--primary);
      color: var(--primary-foreground);
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(22, 78, 99, 0.3);
    }

    .lia-template-icon {
      font-size: 18px;
      flex-shrink: 0;
    }

    .lia-template-info {
      flex: 1;
      min-width: 0;
    }

    .lia-template-name {
      font-weight: 600;
      font-size: 12px;
      margin-bottom: 2px;
    }

    .lia-template-description {
      font-size: 10px;
      opacity: 0.8;
      line-height: 1.3;
    }

    .lia-template-example {
      margin: 16px 0;
    }

    .lia-linkedin-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      max-width: 500px;
    }

    .lia-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .lia-card-avatar {
      width: 48px;
      height: 48px;
      background: var(--primary);
      color: var(--primary-foreground);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 18px;
    }

    .lia-card-info {
      flex: 1;
    }

    .lia-card-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--card-foreground);
    }

    .lia-card-title {
      font-size: 12px;
      color: var(--muted-foreground);
      margin: 2px 0;
    }

    .lia-card-time {
      font-size: 11px;
      color: var(--muted-foreground);
    }

    .lia-card-content {
      font-size: 14px;
      line-height: 1.5;
      color: var(--card-foreground);
      margin-bottom: 12px;
      white-space: pre-line;
    }

    .lia-card-engagement {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: var(--muted-foreground);
      padding-top: 8px;
      border-top: 1px solid var(--border);
    }

    /*.lia-mode-badge {
      background: var(--accent);
      color: var(--accent-foreground);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 600;
    }*/

    /* Quick suggestions slider styles */
    .lia-quick-suggestions {
      position: relative;
      background: linear-gradient(135deg, #f8f9fa, #ffffff);
      border: 1px solid #e9ecef;
      border-radius: 12px;
      padding: 12px;
      margin-bottom: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .lia-quick-suggestions.hidden {
      opacity: 0;
      transform: translateY(-10px);
      max-height: 0;
      padding: 0;
      margin: 0;
    }

    .lia-suggestions-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .lia-suggestions-title {
      font-size: 13px;
      font-weight: 600;
      color: #0a66c2;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .lia-suggestions-close {
      background: none;
      border: none;
      color: #6c757d;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .lia-suggestions-close:hover {
      background: #e9ecef;
      color: #495057;
    }

    .lia-suggestions-slider {
      position: relative;
    }

    .lia-suggestions-track {
      display: flex;
      gap: 12px;
      transition: transform 0.3s ease;
      padding: 4px 0;
    }

    .lia-suggestion-card {
      display: flex;
      gap: 15px;
      min-width: 200px;
      max-width: 250px;
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .lia-suggestion-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(10, 102, 194, 0.1), transparent);
      transition: left 0.5s;
    }

    .lia-suggestion-card:hover::before {
      left: 100%;
    }

    .lia-suggestion-card:hover {
      border-color: #0a66c2;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(10, 102, 194, 0.15);
    }

    .lia-suggestion-icon {
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #0a66c2, #004182);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    }

    .lia-suggestion-text {
      font-size: 12px;
      color: #495057;
      line-height: 1.4;
      margin-bottom: 8px;
    }

    .lia-suggestion-action {
      font-size: 11px;
      color: #0a66c2;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .lia-suggestions-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #dee2e6;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      backdrop-filter: blur(10px);
      z-index: 10;
    }

    .lia-suggestions-nav:hover {
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-50%) scale(1.1);
    }

    .lia-suggestions-nav.prev {
      left: -7px;
    }

    .lia-suggestions-nav.next {
      right: -7px;
    }

    .lia-suggestions-nav:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: translateY(-50%) scale(1);
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .lia-input-actions {
        flex-wrap: wrap;
      }
      
      .lia-action-btn {
        flex: 1;
        min-width: 0;
        justify-content: center;
      }
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

    @keyframes messageSlideIn {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    @keyframes avatarPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
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
      transform: scale(0) translateY(20px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(0, 0, 0, 0.08);
      backdrop-filter: blur(20px);

      /*border-bottom-right-radius: 0;*/
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
      width: ${chatbotState.notesMode ? '305' : (chatbotState.templateMode ? '320' : '290')}px;
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
      border-bottom-left-radius: 20px;
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

    .lia-load-more-btn {
      padding: 8px 12px;
      border-radius: 8px;
      color: #0a66c2;
      font-weight: 600;
      cursor: pointer;
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

    .lia-message.user .lia-chat-user-avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
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
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
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
      border: none !important;
      border-radius: 20px;
      padding: 12px 16px;
      font-size: 14px;
      resize: none;
      max-height: 120px;
      min-height: 20px;
      outline: none !important;
      background: transparent;
      font-family: inherit;
      color: #333333;
      
      scrollbar-width: thin;
      scrollbar-color: #0a66c2 #e9ecef;

      &::placeholder {
        color: #888888;
      }
      
      &::-webkit-scrollbar {
        width: 2px;
        height: 2px;
      }
    }

    .lia-message-input:active {
      background: none !important;
      border: none !important;
      outline: none !important;
    }

    .lia-message-input:focus {
      border: none;
      background: none;
      outline: none;
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

    .lia-control-btn.reference-active,
    .lia-control-btn.notes-active,
    .lia-control-btn.template-active {
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
    chatbotInterface.className = `lia-chatbot-interface ${chatbotState.isOpen ? 'open' : ''}`

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
        <span id="lia-mode-title">LIA</span>
        <div id="lia-mode-indicator" style="display: none; margin-left: 8px;">
          <div class="lia-mode-badge" id="lia-template-badge" style="display: none;">Template</div>
          <div class="lia-mode-badge" id="lia-notes-badge" style="display: none;">Notes</div>
        </div>
      </div>
      <div class="lia-chatbot-controls">
        <button class="lia-control-btn ${chatbotState.templateMode ? 'template-active' : ''}" id="lia-template-toggle" title="Template Mode: OFF">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="9" x2="15" y2="9"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
        </button>
        <button class="lia-control-btn ${chatbotState.notesMode ? 'notes-active' : ''}" id="lia-notes-toggle" title="Notes Mode: OFF">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        </button>
        <button class="lia-control-btn ${chatbotState.referenceMode ? 'reference-active' : ''}" id="lia-reference-toggle" title="Reference Mode (Pro): OFF">
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
        <div class="lia-sidebar-header" id="lia-sidebar-header">Recent Chats</div>
        <div class="lia-conversation-list" id="lia-conversation-list">
          <!-- Conversations/Notes will be populated here -->
        </div>
        <button class="lia-load-more-btn" id="lia-load-more-btn">Load more</button>
        <button class="lia-new-chat-btn" id="lia-new-chat-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Chat
        </button>
        <!-- Profile Card Component -->
        <div id="lia-profile-card" class="lia-profile-card">
          <!-- Dropdown Menu -->
          <div id="profile-menu" class="profile-menu hidden">
            <div class="menu-item" data-action="upgrade">
              <span class="menu-icon">⬆️</span>
              <span><a href="https://www.getlia.live/pricing" target="_blank" class='menu-link'>Upgrade plan</a></span>
            </div>
            <div class="menu-item" data-action="customize">
              <span class="menu-icon">🎨</span>
              <span>Customize LIA</span>
            </div>
            <div class="menu-item" data-action="settings">
              <span class="menu-icon">⚙️</span>
              <span>Settings</span>
            </div>
            <div class="menu-item submenu-parent" data-action="help">
              <span class="menu-icon">❓</span>
              <span>Help</span>
              <span class="submenu-arrow">›</span>
              
              <!-- Help Submenu -->
              <div class="submenu">
                <div class="menu-item" data-action="help-center">
                  <span class="menu-icon">❓</span>
                  <span><a href="https://www.getlia.live/support?from=extension" target="_blank" class='menu-link'>Help center</a></span>
                </div>
                <div class="menu-item" data-action="release-notes">
                  <span class="menu-icon">📝</span>
                  <span><a href="https://www.getlia.live/release-notes" target="_blank" class='menu-link'>Release notes</a></span>
                </div>
                <div class="menu-item" data-action="terms">
                  <span class="menu-icon">📋</span>
                  <span><a href="https://www.getlia.live/terms" target="_blank"  class='menu-link'>Terms & policies</a></span>
                </div>
                <div class="menu-item" data-action="report-bug">
                  <span class="menu-icon">🐛</span>
                  <span><a href="https://www.getlia.live/feedback?from=extension" target="_blank" class='menu-link'>Report Bug</a></span>
                </div>
              </div>
            </div>
            <div class="menu-item" data-action="logout">
              <span class="menu-icon">🚪</span>
              <span><a href="https://www.getlia.live/logout" target="_blank" class='menu-link'>Log out</a></span>
            </div>
          </div>
          <div class="profile-info" title='click to open menu'>
            <img src="${liaUser?.profile_picture_url}" alt="Profile" class="profile-avatar" id="profile-avatar">
            <div class="profile-details">
              <span class="profile-name" id="profile-name">User</span>
              <span class="profile-status">Free</span>
            </div>
          </div>
        </div>
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
              Hi! I'm Lia, your LinkedIn Intelligent Assistant. <br/><br/> I'm here to help you write posts, polish comments, and improve your content. <br/><br/>What can I assist you with today?
            </div>
          </div>
        </div>

        <div class="lia-input-container">
          <!-- Quick suggestion area for reference mode in chat mode -->

          <div class="lia-quick-suggestions hidden" id="lia-quick-suggestions">
            <div class="lia-suggestions-header">
              <div class="lia-suggestions-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                Quick Suggestions
              </div>
              <button class="lia-suggestions-close" id="lia-suggestions-close">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="lia-suggestions-slider">
              <div class="lia-suggestions-track" id="lia-suggestions-track">
                 Suggestions will be populated here 
              </div>
              <button class="lia-suggestions-nav prev" id="lia-suggestions-prev" disabled>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
              </button>
              <button class="lia-suggestions-nav next" id="lia-suggestions-next">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Enhanced input area with mode-specific features -->
          <div class="lia-input-wrapper">
            <div class="lia-input-actions" id="lia-input-actions" style="display: none;">
              <!-- Note enhancement buttons -->
              <button class="lia-action-btn" id="lia-structure-note" title="Structure Note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </button>
              <button class="lia-action-btn" id="lia-summarize-note" title="Summarize">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </button>
              <button class="lia-action-btn" id="lia-expand-note" title="Expand Details">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15,3 21,3 21,9"/>
                  <polyline points="9,21 3,21 3,15"/>
                  <line x1="21" y1="3" x2="14" y2="10"/>
                  <line x1="3" y1="21" x2="10" y2="14"/>
                </svg>
              </button>
              <button class="lia-action-btn" id="lia-add-tags" title="Add Tags">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
              </button>
            </div>
            <textarea
              style="border: none; outline: none;" 
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
          <div class="lia-notes-mode-indicator" id="lia-notes-mode-indicator">
            <!-- <span class="lia-mode-text">Notes Mode Active</span> -->
            <div class="lia-context-info" id="lia-context-info"></div>
            <div class="lia-notes-info" id="lia-notes-info" title="Notes are stored locally, you must sync to save them.">
              
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Customization Modal -->
    <div id="customization-modal" class="modal-overlay hidden">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Customize LIA</h2>
          <button class="close-btn" id="close-modal">×</button>
        </div>
        
        <div class="modal-body">
          <p class="modal-subtitle">Introduce yourself to get better, more personalized responses</p>
          
          <div class="form-group">
            <label>What should LIA call you?</label>
            <input type="text" id="nickname" placeholder="Nickname" class="form-input">
          </div>
          
          <div class="form-group">
            <label>What do you do?</label>
            <input type="text" id="occupation" placeholder="Professional cat herder" class="form-input">
          </div>
          
          <div class="form-group">
            <label>What personality should LIA have?</label>
            <select id="personality" class="form-select">
              <option value="default">Default</option>
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>What traits should LIA have?</label>
            <div class="traits-container">
              <div class="trait-tag" data-trait="chatty" id="trait-chatty">+ Chatty</div>
              <div class="trait-tag" data-trait="witty" id="trait-witty">+ Witty</div>
              <div class="trait-tag" data-trait="straight-shooting" id="trait-straight-shooting">+ Straight shooting</div>
              <div class="trait-tag" data-trait="encouraging" id="trait-encouraging">+ Encouraging</div>
              <div class="trait-tag" data-trait="gen-z" id="trait-gen-z">+ Gen Z</div>
              <div class="trait-tag" data-trait="traditional" id="trait-traditional">+ Traditional</div>
              <div class="trait-tag" data-trait="forward-thinking" id="trait-forward-thinking">+ Forward thinking</div>
            </div>
            <textarea id="custom-traits" placeholder="Describe or select traits" class="form-textarea"></textarea>
          </div>
          
          <div class="form-group">
            <label>Anything else LIA should know about you?</label>
            <textarea id="additional-info" placeholder="Interests, values, or preferences to keep in mind" class="form-textarea"></textarea>
          </div>
          
          <!--<div class="form-group">
            <label class="toggle-label">
              <input type="checkbox" id="enable-new-chats" checked>
              <span class="toggle-slider"></span>
              Enable for new chats
            </label>
          </div>-->
        </div>
        
        <div class="modal-footer">
          <button class="btn-secondary" id="cancel-btn">Cancel</button>
          <button class="btn-primary" id="save-btn">Save</button>
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
    const loadMoreBtn = document.getElementById("lia-load-more-btn")
    const newChatBtn = document.getElementById("lia-new-chat-btn")
    const liaChatbotTitle = document.querySelector(".lia-chatbot-title")
    const referenceToggle = document.getElementById("lia-reference-toggle")
    const notesToggle = document.getElementById("lia-notes-toggle")
    const templateToggle = document.getElementById("lia-template-toggle")

    // Notes action buttons
    const structureBtn = document.getElementById("lia-structure-note")
    const summarizeBtn = document.getElementById("lia-summarize-note")
    const expandBtn = document.getElementById("lia-expand-note")
    const addTagsBtn = document.getElementById("lia-add-tags")

    // Quick suggestions elements
    const quickSuggestions = document.getElementById("lia-quick-suggestions")
    const suggestionsClose = document.getElementById("lia-suggestions-close")
    const suggestionsTrack = document.getElementById("lia-suggestions-track")
    const suggestionsPrev = document.getElementById("lia-suggestions-prev")
    const suggestionsNext = document.getElementById("lia-suggestions-next")

    // set default to collapsed
    sidebar.classList.add("collapsed")

    // Auto focus
    messageInput.focus()

    // Auto-resize textarea
    messageInput.addEventListener("input", function () {
      this.style.height = "auto"
      this.style.height = Math.min(this.scrollHeight, 120) + "px"
    })

    // Send message on Enter (but not Shift+Enter)
    messageInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        if (chatbotState.notesMode) {
          saveNote()
        } else {
          sendMessage()
        }
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

    // loadmore for pagination
    loadMoreBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      loadMore()
    })


    // New chat/note button
    newChatBtn.addEventListener("click", async (e) => {
      e.stopPropagation()
      if (chatbotState.notesMode) {
        // if notes mode enabled, start a new note
        startNewNote()
      } else {
        await startNewConversation()
      }
    })

    // Send button
    sendBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      if (chatbotState.notesMode) {
        saveNote()
      } else {
        sendMessage()
      }
    })

    // Reference mode toggle
    referenceToggle.addEventListener("click", (e) => {
      e.stopPropagation()
      toggleReferenceMode()
    })

    // Notes mode toggle
    notesToggle.addEventListener("click", (e) => {
      e.stopPropagation()
      toggleNotesMode()
    })

    // Template mode toggle
    templateToggle.addEventListener("click", (e) => {
      e.stopPropagation()
      toggleTemplateMode()
    })

    // Notes action buttons
    structureBtn?.addEventListener("click", (e) => {
      e.stopPropagation()
      enhanceNote("structure")
    })

    summarizeBtn?.addEventListener("click", (e) => {
      e.stopPropagation()
      enhanceNote("summarize")
    })

    expandBtn?.addEventListener("click", (e) => {
      e.stopPropagation()
      enhanceNote("expand")
    })

    addTagsBtn?.addEventListener("click", (e) => {
      e.stopPropagation()
      enhanceNote("tags")
    })

    // Quick suggestions event listeners
    suggestionsClose?.addEventListener("click", (e) => {
      e.stopPropagation()
      hideQuickSuggestions()
    })

    suggestionsPrev?.addEventListener("click", (e) => {
      e.stopPropagation()
      scrollSuggestions('prev')
    })

    suggestionsNext?.addEventListener("click", (e) => {
      e.stopPropagation()
      scrollSuggestions('next')
    })

    // Initialize quick suggestions based on current state
    updateQuickSuggestions()

    // profile card
    new window.Lia_ProfileCard('lia-chat-sidebar')

    // customization
    new window.Lia_CustomizationModal()
  }

  async function toggleTemplateMode() {
    chatbotState.templateMode = !chatbotState.templateMode
    const templateToggle = document.getElementById("lia-template-toggle")
    const modeTitle = document.getElementById("lia-mode-title")
    const sidebarHeader = document.getElementById("lia-sidebar-header")
    const newChatBtn = document.getElementById("lia-new-chat-btn")
    const messageInput = document.getElementById("lia-message-input")
    const modeIndicator = document.getElementById("lia-mode-indicator")
    const loadMoreBtn = document.getElementById("lia-load-more-btn")
    const notesToggle = document.getElementById("lia-notes-toggle")
  
    //const templateBadge = document.getElementById("lia-template-badge")
    
    try{modeIndicator.style.display = "flex"} catch{}

    if (chatbotState.templateMode) {
      // Turn off other modes
      // reset pagination
      numberOfConversationsToLoad = 10
      numberOfNotesToLoad = 10
      if (chatbotState.notesMode) {
        /*chatbotState.notesMode = false
        document.getElementById("lia-notes-toggle").classList.remove("notes-active")
        document.getElementById("lia-notes-badge").style.display = "none"*/
        chatbotState.notesMode = !chatbotState.notesMode
        notesToggle.classList.remove("notes-active")
      }

      // Switch to Template Mode
      templateToggle.classList.add("template-active")
      templateToggle.title = "Template Mode: ON"
      //templateBadge.style.display = "block"

      window.typeWriter("LIA Templates", modeTitle)
      sidebarHeader.textContent = "Writing Styles"
      newChatBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New Post
      `
      messageInput.placeholder = "What would you like to write about?"
      
      // Clear conversation list
      const conversationList = document.getElementById("lia-conversation-list")
      conversationList.innerHTML = ""
      
      // Load templates in sidebar
      await loadTemplates()
      hideQuickSuggestions()

      loadMoreBtn.style.display = "none"
      
    } else {
      numberOfConversationsToLoad = 10
      numberOfNotesToLoad = 10
      // Switch back to normal mode
      templateToggle.classList.remove("template-active")
      templateToggle.title = "Template Mode: OFF"
      //templateBadge.style.display = "none"
      
      if (!chatbotState.notesMode) {
        try{modeIndicator.style.display = "none"}catch{}
      }

      window.typeWriter("LIA", modeTitle)
      sidebarHeader.textContent = "Conversations"
      newChatBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New Chat
      `
      messageInput.placeholder = "What do you want to post?"

      // Load regular conversations
      loadChatHistory()

      loadMoreBtn.style.display = "block"
    }

    await saveChatbotState()
  }

  async function loadTemplates() {
    const conversationList = document.getElementById("lia-conversation-list")
    if (!conversationList) return

    // fetch templates from api-server
    await fetchTemplates()

    conversationList.innerHTML = Object.entries(TEMPLATES).map(([key, template]) => `
      <div class="lia-template-item ${chatbotState.selectedTemplate === key ? 'active' : ''}" data-template="${key}">
        <div class="lia-template-icon">${template.icon}</div>
        <div class="lia-template-info">
          <div class="lia-template-name">${template.name}</div>
          <div class="lia-template-description">${template.description}</div>
        </div>
      </div>
    `).join('')

    // Add click listeners to template items
    conversationList.querySelectorAll('.lia-template-item').forEach(item => {
      item.addEventListener('click', () => {
        const templateKey = item.dataset.template
        selectTemplate(templateKey)
      })
    })

    if (chatbotState.selectedTemplate) {
      chatbotState.currentConversationId = null; // Clear current conversation
      selectTemplate(chatbotState.selectedTemplate)
    }
  }

  function selectTemplate(templateKey) {
    chatbotState.selectedTemplate = templateKey;
    chatbotState.currentConversationId = null; // Clear current conversation
    chatbotState.conversations = []; // Clear conversations list
    const template = TEMPLATES[templateKey];

    // Update active state in sidebar
    document.querySelectorAll('.lia-template-item').forEach(item => {
      item.classList.remove('active')
    })
    document.querySelector(`[data-template="${templateKey}"]`).classList.add('active')
    
    // Clear messages and show template info
    const messagesContainer = document.getElementById("lia-messages-container")
    messagesContainer.innerHTML = `
      <div class="lia-welcome-message">
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
            Hi! I'm Lia, your LinkedIn Intelligent Assistant.<br/><br/>
            You're using <strong>${template.name}</strong> - posts will be written like the example below:<br/><br/>
            <div class="lia-template-example">
              <div class="lia-linkedin-card">
                <div class="lia-card-header">
                  <div class="lia-card-avatar">${template.example.author.charAt(0)}</div>
                  <div class="lia-card-info">
                    <div class="lia-card-name">${template.example.author}</div>
                    <div class="lia-card-title">Product Manager • 2nd</div>
                    <div class="lia-card-time">2h • 🌍</div>
                  </div>
                </div>
                <div class="lia-card-content">${template.example.content.replace(/\n/g, '<br>')}</div>
                <div class="lia-card-engagement">
                  <span>👍 ${template.example.engagement.likes}</span>
                  <span>💬 ${template.example.engagement.comments}</span>
                  <span>🔄 12</span>
                </div>
              </div>
            </div>
            <br/>This style works great for:<br/>
            • ${template.description}<br/>
            • Building engagement through ${template.name.toLowerCase()} content<br/><br/>
            What would you like to write about today?
          </div>
        </div>
      </div>
    `

    // make backend api requests to create chat
    
    
    saveChatbotState()
  }

  const fetchTemplates = async () => {
    try {
      const response = await window.lia_fetchWithAuth('https://api.getlia.live/api/chat/templates', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await accessToken()}`,
        },
        credentials: 'include',
      })
      const data = await response.json()
      console.log('Fetched templates:', data)
      if (response.ok) {
        // Update templates in state
        // filter out normal templates
        TEMPLATES = data.templates.filter(template => template.key !== "normal").reduce((acc, template) => {
          acc[template.key] = template
          return acc
        }, {})
      } else {
        console.error('Failed to fetch templates:', data.error)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  // Quick Suggestions Functions
  function updateQuickSuggestions() {
    const quickSuggestions = document.getElementById("lia-quick-suggestions")
    const suggestionsTrack = document.getElementById("lia-suggestions-track")
    
    if (!quickSuggestions || !suggestionsTrack) return

    // Show suggestions only in chat mode when reference mode is active or when there's referenced content
    if (!chatbotState.notesMode && (chatbotState.referenceMode || chatbotState.referencedContent)) {
      const suggestions = generateContextualSuggestions()
      renderQuickSuggestions(suggestions)
      showQuickSuggestions()
    } else {
      hideQuickSuggestions()
    }
  }

  function generateContextualSuggestions() {
    const suggestions = []

    // Base suggestions for reference mode
    if (chatbotState.referenceMode) {
      suggestions.push(
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M9 11H1l8-8 8 8"/>
            <path d="M9 11v10"/>
          </svg>`,
          text: "Summarize this content",
          action: "Summarize the key points from the referenced content"
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
          </svg>`,
          text: "What's your take on this?",
          action: "What's your professional opinion on this content?"
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>`,
          text: "Write a thoughtful comment",
          action: "Help me write a thoughtful comment on this post"
        }
      )
    }

    // Add suggestions based on referenced content type
    if (chatbotState.referencedContent) {
      const contentType = chatbotState.referencedContent.type
      
      if (contentType === "post") {
        suggestions.push(
          {
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>`,
            text: "Create a similar post",
            action: "Help me create a similar post with my own perspective"
          },
          {
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>`,
            text: "Extract key insights",
            action: "What are the key business insights from this post?"
          }
        )
      } else if (contentType === "article") {
        suggestions.push(
          {
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>`,
            text: "Article summary",
            action: "Provide a concise summary of this article"
          },
          {
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>`,
            text: "Rate and review",
            action: "What's your professional assessment of this article?"
          }
        )
      }

      // Add industry-specific suggestions
      if (settings.industry === "technology") {
        suggestions.push({
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>`,
          text: "Tech implications",
          action: "What are the technology implications of this content?"
        })
      }
    }

    return suggestions.slice(0, 6) // Limit to 6 suggestions
  }

  function renderQuickSuggestions(suggestions) {
    const suggestionsTrack = document.getElementById("lia-suggestions-track")
    if (!suggestionsTrack) return

    suggestionsTrack.innerHTML = suggestions.map(suggestion => `
      <div class="lia-suggestion-card" data-action="${suggestion.action}" title='Click to use'>
        <div class="lia-suggestion-icon">
          ${suggestion.icon}
        </div>
        <div class="lia-suggestion-text">${suggestion.text}</div>
        <!--<div class="lia-suggestion-action">Click to use</div>-->
      </div>
    `).join('')

    // Add click listeners to suggestion cards
    suggestionsTrack.querySelectorAll('.lia-suggestion-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.stopPropagation()
        const action = card.dataset.action
        sendMessage(action) // Send the action directly
        hideQuickSuggestions()
      })
    })

    // Update navigation buttons
    updateSuggestionsNavigation()
  }

  function showQuickSuggestions() {
    const quickSuggestions = document.getElementById("lia-quick-suggestions")
    if (quickSuggestions) {
      quickSuggestions.classList.remove("hidden")
    }
  }

  function hideQuickSuggestions() {
    const quickSuggestions = document.getElementById("lia-quick-suggestions")
    if (quickSuggestions) {
      quickSuggestions.classList.add("hidden")
    }
  }

  function scrollSuggestions(direction) {
    const suggestionsTrack = document.getElementById("lia-suggestions-track")
    if (!suggestionsTrack) return

    const cardWidth = 212 // 200px + 12px gap
    const currentTransform = suggestionsTrack.style.transform
    const currentTranslate = currentTransform ? Number.parseInt(currentTransform.match(/-?\d+/)?.[0] || 0) : 0
    
    let newTranslate = currentTranslate
    if (direction === 'next') {
      newTranslate = currentTranslate - cardWidth
    } else {
      newTranslate = currentTranslate + cardWidth
    }

    // Constrain the translation
    const maxTranslate = 0
    const minTranslate = -(suggestionsTrack.children.length - 2) * cardWidth
    newTranslate = Math.max(minTranslate, Math.min(maxTranslate, newTranslate))

    suggestionsTrack.style.transform = `translateX(${newTranslate}px)`
    updateSuggestionsNavigation()
  }

  function updateSuggestionsNavigation() {
    const suggestionsTrack = document.getElementById("lia-suggestions-track")
    const suggestionsPrev = document.getElementById("lia-suggestions-prev")
    const suggestionsNext = document.getElementById("lia-suggestions-next")
    
    if (!suggestionsTrack || !suggestionsPrev || !suggestionsNext) return

    const currentTransform = suggestionsTrack.style.transform
    const currentTranslate = currentTransform ? Number.parseInt(currentTransform.match(/-?\d+/)?.[0] || 0) : 0
    const cardWidth = 212
    const maxTranslate = 0
    const minTranslate = -(suggestionsTrack.children.length - 2) * cardWidth

    suggestionsPrev.disabled = currentTranslate >= maxTranslate
    suggestionsNext.disabled = currentTranslate <= minTranslate
  }

  // Notes Mode Functions
  async function toggleNotesMode() {
    chatbotState.notesMode = !chatbotState.notesMode
    const notesToggle = document.getElementById("lia-notes-toggle")
    const modeTitle = document.getElementById("lia-mode-title")
    const sidebarHeader = document.getElementById("lia-sidebar-header")
    const newChatBtn = document.getElementById("lia-new-chat-btn")
    const messageInput = document.getElementById("lia-message-input")
    const inputActions = document.getElementById("lia-input-actions")
    const modeIndicator = document.getElementById("lia-notes-mode-indicator")
    const liaSendBtn = document.getElementById("lia-send-btn")
    const loadMoreBtn = document.getElementById("lia-load-more-btn")
    try{loadMoreBtn.style.display = "block"} catch{}
    try{modeIndicator.style.display = "flex"} catch{}

    const syncButton = document.createElement('button')
    syncButton.classList.add('sync-note-btn')
    syncButton.textContent = 'Sync Notes'

    syncButton.addEventListener('click', async () => {
      showTemporaryNotification('Syncing notes...', 'info')
      // Sync notes with server
      const body = {notes: await getNotesFromStorage()}
      const syncNotes = async () => {
        // save notes to server inorder to sync
        const response = await window.lia_fetchWithAuth('https://api.getlia.live/api/note/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await accessToken()}`,
          },
          credentials: 'include',
          body: JSON.stringify(body)
        })

        if (!response.ok) {
          console.error('Error syncing notes:', response.statusText)
          throw new Error('Failed to sync notes')
        }

        const data = await response.json()
        if (data.success) {
          console.log('Notes synced successfully')
          showTemporaryNotification('Notes synced successfully', 'success')
        }

        if (!data.success) {
          throw new Error('Failed to sync notes')
        }
        return data.success;
      }

      await syncNotes()
    })

    messageInput.value = ""

    if (chatbotState.templateMode) {
      //turn templatemode off
      chatbotState.templateMode = !chatbotState.templateMode
      document.getElementById("lia-template-toggle").classList.remove("template-active")
    }

    if (chatbotState.notesMode) {
      // fetch notes from server
      const fetchNotes = async (limit) => {
        const start = limit < 10 ? 0 : limit - 10;

        // fetch notes from server
        const response = await window.lia_fetchWithAuth(`https://api.getlia.live/api/note/notes?limit=${limit}&start=${start}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await accessToken()}`,
          },
          credentials: 'include',
        })

        if (!response.ok) {
          console.error('Error fetching notes:', response.statusText)
          throw new Error('Failed to fetch notes')
        }

        const notes = await response.json()
        if (notes) {
          console.log('Notes fetched successfully')
          
          // update notes in storage
          chatbotState.notes = notes
          saveChatbotState()

          showTemporaryNotification('Notes fetched successfully', 'success')
          return notes
        }

        if (!notes) {
          console.log('Failed to fetch notes')
          throw new Error('Failed to fetch notes')
        }
      }

      // Clear conversation list
      const conversationList = document.getElementById("lia-conversation-list")
      conversationList.innerHTML = ""

      numberOfNotesToLoad = 10

      const notes = await fetchNotes(numberOfNotesToLoad)
      numberOfNotesToLoad += 10 // increment
        
      // Hide quick suggestions
      hideQuickSuggestions()

      // reset number of conversations to load
      numberOfConversationsToLoad = 10

      // Switch to Notes Mode
      notesToggle.classList.add("notes-active")
      notesToggle.title = "Notes Mode: ON"

      //modeTitle.textContent = "LIA Notes"

      // typeWriter effect for modeTitle
      window.typeWriter("LIA Notes", modeTitle)

      sidebarHeader.textContent = "Recent Notes"
      newChatBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="12" y1="11" x2="12" y2="17"/>
          <line x1="9" y1="14" x2="15" y2="14"/>
        </svg>
        New Note
      `
      messageInput.placeholder = "Write your note here..."
      messageInput.setAttribute("rows", "3")
      inputActions.style.display = "flex"

      // Lia Send Button inner html should be change to the correct svg for note
      liaSendBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="12" y1="11" x2="12" y2="17"/>
          <line x1="9" y1="14" x2="15" y2="14"/>
        </svg>
      `

      // Update context info
      updateNoteContext()

      // Load notes
      showNotesWelcome()
      await loadNotes()

      // Add sync button to mode indicator
      try{
        const notesInfoContainer = modeIndicator.querySelector('.lia-notes-info');
        if (notesInfoContainer) {
          notesInfoContainer.appendChild(syncButton)
        }
      } catch {}
      

      showTemporaryNotification("📝 Notes Mode ON - Capture and organize your thoughts", "success")

      console.log('this is the notes', notes)
      // load note list
      conversationList.innerHTML = notes
      .map((note) => {
        const truncatedTitle = note.title.slice(0, 15) + (note.title.length > 15 ? "..." : "")
        const contextIcon = getContextIcon(note.context?.type)

        return `
          <div class="lia-conversation-item-wrapper" style="position: relative;">
            <div class="lia-conversation-item ${note.id === chatbotState.currentNoteId ? "active" : ""}"
                data-id="${note.id}" title="${note.title}" style="cursor: pointer; padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between;">
              <div style="flex: 1; overflow: hidden;">
                <div class="truncatedTitle" style="font-size: 12px; font-weight: 500;">${contextIcon} ${truncatedTitle}</div>
                <div style="font-size: 10px; color: #a9d2f3ff; margin-top: 2px;">${formatTimestamp(note.lastModified)}</div>
              </div>
              <span class="lia-menu-trigger" style="cursor: pointer; padding: 4px; border-radius: 4px; opacity: 0.7; transition: opacity 0.2s;">⋯</span>
            </div>
            <div class="lia-menu" style="display: none; position: absolute; right: 0; top: 100%; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; min-width: 120px; overflow: hidden;">
              <button class="lia-edit-note-btn" data-id="${note.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                <span style="margin-right: 8px;">✏️</span>Edit
              </button>
              <button class="lia-duplicate-note-btn" data-id="${note.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                <span style="margin-right: 8px;">📋</span>Duplicate
              </button>
              <div style="height: 1px; background: #e0e0e0; margin: 4px 0;"></div>
              <button class="lia-delete-note-btn" data-id="${note.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #dc3545; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                <span style="margin-right: 8px;">🗑️</span>Delete
              </button>
            </div>
          </div>
        `
      })
      .join("")

      setupNoteEventListeners()
    } else {
      // reset number of notes to load
      numberOfNotesToLoad = 10
      numberOfConversationsToLoad = 10

      // Switch back to Chat Mode
      notesToggle.classList.remove("notes-active")
      notesToggle.title = "Notes Mode: OFF"
      
      //modeTitle.textContent = "LIA"

      // Typewriter effect for mode title
      window.typeWriter("LIA", modeTitle)

      sidebarHeader.textContent = "Recent Chats"
      newChatBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg> New Chat`
      messageInput.placeholder = "What do you want to post?"
      messageInput.setAttribute("rows", "1")
      inputActions.style.display = "none"
      try{modeIndicator.style.display = "none"}catch{}

      liaSendBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22,2 15,22 11,13 2,9"></polygon>
        </svg>`

      // Load conversations
      showChatWelcome()

      await loadChatHistory()

      try {modeIndicator.querySelector('.sync-note-btn').remove()} catch{}

      showTemporaryNotification("💬 Chat Mode ON", "info")
    }

    // save chatbot state
    await saveChatbotState()
  }

  function updateNoteContext() {
    const contextInfo = document.getElementById("lia-context-info")
    let context = ""

    // Detect LinkedIn context
    if (window.location.href.includes("linkedin.com/in/")) {
      const match = window.location.pathname.match(/\/in\/([^/]+)/)
      const profileSegment = match ? match[1] : null
      if (profileSegment) {
        context = `📋 Profile: ${profileSegment}`
        chatbotState.noteContext = {
          type: "profile",
          identifier: profileSegment,
          url: window.location.href,
        }
      }
    } else if (window.location.href.includes("linkedin.com/feed")) {
      context = "📰 LinkedIn Feed"
      chatbotState.noteContext = {
        type: "feed",
        identifier: "feed",
        url: window.location.href,
      }
    } else if (window.location.href.includes("linkedin.com/pulse")) {
      context = "📖 LinkedIn Article"
      chatbotState.noteContext = {
        type: "article",
        identifier: "article",
        url: window.location.href,
      }
    } else {
      context = "🌐 General Note"
      chatbotState.noteContext = {
        type: "general",
        identifier: "general",
        url: window.location.href,
      }
    }

    contextInfo.textContent = context
  }

  function showNotesWelcome() {
    const messagesContainer = document.getElementById("lia-messages-container")
    messagesContainer.innerHTML = `
      <div class="lia-message assistant">
        <div class="lia-message-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <div class="lia-message-content">
          📝 <strong>Welcome to Notes Mode!</strong><br/><br/>
          I can help you:<br/>
          • <strong>Structure</strong> your thoughts into organized notes<br/>
          • <strong>Summarize</strong> long content into key points<br/>
          • <strong>Expand</strong> brief ideas into detailed notes<br/>
          • <strong>Tag</strong> and categorize your notes<br/><br/>
          Start typing your note below, or use the action buttons to enhance existing content!
        </div>
      </div>
    `
  }

  function showChatWelcome() {
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
          Hi! I'm Lia, your LinkedIn Intelligent Assistant. <br/><br/> I'm here to help you write posts, polish comments, and improve your content. <br/><br/>What can I assist you with today?
        </div>
      </div>
    `
  }

  async function startNewNote() {
    // Clear current note display
    const messagesContainer = document.getElementById("lia-messages-container")
    document.querySelector(".lia-message-input").value = ""
    showNotesWelcome()

    // Create new note
    const newNote = {
      id: generateNoteId(),
      title: "New Note",
      content: "",
      tags: [],
      context: chatbotState.noteContext,
      timestamp: Date.now(),
      lastModified: Date.now(),
    }

    chatbotState.currentNoteId = newNote.id

    // Save to storage
    await saveNoteToStorage(newNote)

    // Update notes list
    await updateConversationList()

    // Focus on input
    document.getElementById("lia-message-input").focus()
  }

  async function saveNote() {
    const messageInput = document.getElementById("lia-message-input")
    const content = messageInput.value.trim()

    if (!content) return

    const noteId = chatbotState.currentNoteId || generateNoteId()

    // Prepare note content as an array of message objects
    let noteContent = [];
    // If editing an existing note, preserve previous content
    const prevNote = await getNoteFromStorage(noteId);
    if (prevNote && Array.isArray(prevNote.content)) {
      noteContent = [...prevNote.content];
    }

    // Add new content as a message object
    if (content) {
      if (typeof content === "string") {
      noteContent.push({
        contentId: generateContentId(),
        type: "text",
        text: content,
      });
      } else if (typeof content === "object" && content.type === "reference") {
      noteContent.push({
        contentId: generateContentId(),
        type: "reference",
        content: content,
      });
      }
    }

    const note = {
      id: noteId,
      title: await generateNoteTitle(content),
      content: noteContent,
      tags: extractHashtags(typeof content === "string" ? content : ""),
      context: chatbotState.noteContext,
      timestamp: chatbotState.currentNoteId ? (prevNote?.timestamp || Date.now()) : Date.now(),
      lastModified: Date.now(),
    }

    chatbotState.currentNoteId = noteId

    // Display note in chat-like format
    addNoteToDisplay(note)

    // Clear input
    messageInput.value = ""
    messageInput.style.height = "auto"

    // Save to storage
    await saveNoteToStorage(note)

    // Update notes list
    await updateConversationList()

    showTemporaryNotification("📝 Note saved!", "success")
  }

  function addNoteToDisplay(note) {
    const messagesContainer = document.getElementById("lia-messages-container")
    messagesContainer.style.opacity = "0.5" // Fade out for smooth transition

    // Clear welcome message if it exists
    const welcomeMsg = messagesContainer.querySelector(".lia-message.assistant")
    if (welcomeMsg && welcomeMsg.textContent.includes("Welcome to Notes Mode")) {
      welcomeMsg.remove()
    }
    
    // Remove hashtags from each message object in note.content for display
    let displayContent = note.content;
    if (Array.isArray(displayContent)) {
      displayContent = displayContent.map(msgObj => {
      if (msgObj.type === "text" && typeof msgObj.text === "string") {
        let text = msgObj.text;
        if (note.tags && note.tags.length > 0) {
        note.tags.forEach(tag => {
          text = text.replace(new RegExp(`#${tag}\\b`, "g"), "");
        });
        }
        return { ...msgObj, text: text.trim() };
      }
      return msgObj;
      });
    }

    // Generate tags HTML
    const tagsHtml =
      note.tags.length > 0
      ? `<div class="lia-note-tags">${note.tags.map((tag) => `<span class="lia-tag">${tag}</span>`).join("")}</div>`
      : "";


    // note.content is now an array of message objects (type: "text" or "reference")
    let formattedContent = "";
    if (Array.isArray(displayContent)) {
      formattedContent = displayContent
      .map(msgObj => {
        if (msgObj.type === "text") {
        return `
          <div class="lia-message note" data-note-id="${note.id}" data-content-note-id="${msgObj.contentId}">
            <div class="lia-message-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
              </div>
              <div class="lia-message-content lia-note-content">
              <div class="lia-note-header">
                <span class="lia-note-title">${note.title}</span>
                <span class="lia-note-timestamp">${formatTimestamp(note.lastModified)}</span>
              </div>
              <div class="lia-note-body">
                <div class="lia-note-text">${formatNoteContent(msgObj.text)}</div>
              </div>
              ${tagsHtml}
              <div class="lia-note-actions">
                <!--<button class="lia-note-action-btn lia-edit-note-btn" data-id="${msgObj.contentId}">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>-->
                <button class="lia-note-action-btn lia-duplicate-note-btn" data-id="${msgObj.contentId}">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                </button>
                <button class="lia-note-action-btn lia-delete-note-btn" data-id="${msgObj.contentId}">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>`;
        } else if (msgObj.type === "reference") {
        // Render referenced content (if any)
        const ref = msgObj.content;
        if (ref && typeof ref === "object") {
          return `
          <div class="lia-referenced-content" title="Click to open">
            <div class="lia-referenced-content-header">
              <a href="${chatbotState.referencedContent ? chatbotState.referencedContent.url : ""}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
                Referenced ${ref.type || "content"}${ref.author ? ` by ${ref.author}` : ""}
              </a>
            </div>
            <a href="${chatbotState.referencedContent ? chatbotState.referencedContent.url : ""}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; font-weight: normal" class="lia-referenced-content-preview" title="Click to open">
              ${ref.text ? ref.text.substring(0, 150) : ""}
              ${ref.text && ref.text.length > 150 ? "..." : ""}
            </a>
          </div>
          `;
        }
        return "";
        }
        return "";
      })
      .join("");
    } else {
      // fallback for legacy notes
      formattedContent = formatNoteContent(note.content);
    }

    messagesContainer.innerHTML = formattedContent;
    //messagesContainer.appendChild(noteDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight

    if (note.content === '') {
      showNotesWelcome()
    }
    
    // Trigger animation
    setTimeout(() => {
      messagesContainer.style.opacity = "1"
    }, 50)
  }

  async function enhanceNote(type) {
    const messageInput = document.getElementById("lia-message-input")
    const content = messageInput.value.trim()

    if (!content) {
      showTemporaryNotification("Please write some content first", "warning")
      return
    }

    // Show loading
    const loadingDiv = document.createElement("div")
    loadingDiv.className = "lia-message assistant"
    loadingDiv.innerHTML = `
      <div class="lia-message-avatar">
        <div class="lia-loading-spinner" style="width: 16px; height: 16px;"></div>
      </div>
      <div class="lia-message-content">
        <div class="lia-typing-indicator">
          <div class="lia-typing-dot"></div>
          <div class="lia-typing-dot"></div>
          <div class="lia-typing-dot"></div>
        </div>
      </div>
    `

    const messagesContainer = document.getElementById("lia-messages-container")
    messagesContainer.appendChild(loadingDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight

    try {
      let enhancedContent = ""

      switch (type) {
        case "structure":
          enhancedContent = await enhanceNoteContent(
            type,
            content,
            "Structure this note with clear headings, bullet points, and organized sections",
          )
          break
        case "summarize":
          enhancedContent = await enhanceNoteContent(type, content, "Summarize this content into key points and main takeaways")
          break
        case "expand":
          enhancedContent = await enhanceNoteContent(
            type,
            content,
            "Expand this note with more details, examples, and comprehensive information",
          )
          break
        case "tags":
          const tags = await enhanceNoteContent(
            type,
            content,
            "Generate relevant tags for this content. Return only the content plus the space separated tags (as hashtags - e.g. #tag1 #tag2) one line after the conte",
          )
          enhancedContent = tags
          break
      }

      // Remove loading
      loadingDiv.remove()

      // Update input with enhanced content
      messageInput.value = enhancedContent
      messageInput.style.height = "auto"
      messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + "px"

      showTemporaryNotification(`✨ Note ${type === "tags" ? "tagged" : type + "d"} successfully!`, "success")
    } catch (error) {
      loadingDiv.remove()
      showTemporaryNotification(`Failed to ${type} note`, "error")
      console.error("Note enhancement error:", error)
    }
  }

  async function enhanceNoteContent(type, content, instruction) {
    const prompt = `${instruction}:\n\n"${content}"\n\nReturn only the enhanced content without explanations or appending the type/anything infront of it.`

    const response = await fetch("https://api.getlia.live/api/note/enhance-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await accessToken()}`,
      },
      body: JSON.stringify({
        type,
        prompt,
        content,
        context: chatbotState.noteContext,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to enhance note")
    }

    return data.enhancedNote
  }

  // Note Management Functions
  async function loadNotes() {
    try {
      const notes = await getNotesFromStorage()
      chatbotState.notes = notes

      if (notes.length === 0) {
        startNewNote()
        return
      }
  
      if (notes.length > 0) {
        chatbotState.currentNoteId = notes[0].id
        await loadNote(chatbotState.currentNoteId)
      }
    } catch (error) {
      console.error("Error loading notes:", error)
    }
  }

  async function loadNote(noteId) {
    const note = await getNoteFromStorage(noteId)
    if (!note) return

    chatbotState.currentNoteId = noteId

    const messagesContainer = document.getElementById("lia-messages-container")
    messagesContainer.innerHTML = ""

    addNoteToDisplay(note)

    // Update input with note content for editing
    const messageInput = document.getElementById("lia-message-input")
    
    // Restore hashtags for display in the input
    if (note.tags && note.tags.length > 0) {
      // Find the last text message in note.content
      if (Array.isArray(note.content)) {
      // Find last text message object
      const lastTextMsg = [...note.content].reverse().find(msg => msg.type === "text");
      let text = lastTextMsg ? lastTextMsg.text : "";
      // Append hashtags if not already present
      const tagsLine = note.tags.map(tag => `#${tag}`).join(" ");
      if (tagsLine && !text.includes(tagsLine)) {
        messageInput.value = (text + "\n" + tagsLine).trim();
      } else {
        messageInput.value = text;
      }
      } else {
      // fallback for legacy notes
      let text = typeof note.content === "string" ? note.content : "";
      const tagsLine = note.tags.map(tag => `#${tag}`).join(" ");
      if (tagsLine && !text.includes(tagsLine)) {
        messageInput.value = (text + "\n" + tagsLine).trim();
      } else {
        messageInput.value = text;
      }
      }
    } else {
      // No tags, just restore last text message
      if (Array.isArray(note.content)) {
      const lastTextMsg = [...note.content].reverse().find(msg => msg.type === "text");
      messageInput.value = lastTextMsg ? lastTextMsg.text : "";
      } else {
      messageInput.value = typeof note.content === "string" ? note.content : "";
      }
    }

    //messageInput.value = note.content
    messageInput.style.height = "auto"
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + "px"

    // add active state to the current note that was clicked
    // and remove active state from other notes
    const conversations = document.querySelectorAll(".lia-conversation-item")
    conversations.forEach((conversation) => {
      if (conversation.getAttribute("data-id") === conversationId) {
        conversation.classList.add("active")
      } else {
        conversation.classList.remove("active")
      }
    })
  }

  // Storage Functions
  async function saveNoteToStorage(note) {
    return new Promise((resolve) => {
      chrome.storage.local.get(["lia_notes"], (result) => {
        const notes = result.lia_notes || []
        const existingIndex = notes.findIndex((n) => n.id === note.id)

        if (existingIndex >= 0) {
          notes[existingIndex] = note
        } else {
          notes.unshift(note)
        }

        chrome.storage.local.set({ lia_notes: notes }, resolve)
      })
    })
  }

  async function saveNoteContentToStorage(note, content) {
    return new Promise((resolve) => {
      chrome.storage.local.get(["lia_notes"], (result) => {
        const notes = result.lia_notes || []
        const existingIndex = notes.findIndex((n) => n.id === note.id)

        if (existingIndex >= 0) {
          notes[existingIndex].content.push(content)
        } else {
          notes.unshift(note)
        }

        chrome.storage.local.set({ lia_notes: notes }, resolve)
      })
    })
  }

  async function getNoteFromStorage(noteId) {
    return new Promise((resolve) => {
      chrome.storage.local.get(["lia_notes"], (result) => {
        const notes = result.lia_notes || []
        resolve(notes.find((n) => n.id === noteId))
      })
    })
  }

  async function getNotesFromStorage() {
    return new Promise((resolve) => {
      chrome.storage.local.get(["lia_notes"], (result) => {
        resolve(result.lia_notes || [])
      })
    })
  }

  async function deleteNoteFromStorage(noteId) {
    return new Promise((resolve) => {
      chrome.storage.local.get(["lia_notes"], (result) => {
        const notes = result.lia_notes || []
        const filteredNotes = notes.filter((n) => n.id !== noteId)
        chrome.storage.local.set({ lia_notes: filteredNotes }, resolve)
      })
    })
  }

  async function deleteNoteContentFromStorage(noteId, contentId) {
    return new Promise((resolve) => {
      chrome.storage.local.get(["lia_notes"], (result) => {
        const notes = result.lia_notes || []
        const noteIndex = notes.findIndex((n) => n.id === noteId)
        if (noteIndex >= 0) {
          const note = notes[noteIndex]
          note.content = note.content.filter((msg) => msg.contentId !== contentId)

          // If no content left, delete the note
          if (note.content.length === 0) {
            notes.splice(noteIndex, 1)
          } else {
            notes[noteIndex] = note
          }

          chrome.storage.local.set({ lia_notes: notes }, resolve)
        } else {
          resolve()
        }
      })
    })
  }

  // Utility Functions
  function generateNoteId() {
    return "note_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
  }

  function generateContentId() {
    return "content_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
  }

  async function generateNoteTitle(content) {
    if (!content || content.trim().length === 0) {
      return "Untitled Note"
    }

    // fetch title from API
    const response = await fetch("https://api.getlia.live/api/note/generate-title", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await accessToken()}`,
      },
      body: JSON.stringify({ content }),
    })

    // falback
    function fallbackTitle() {
      const firstLine = content.split("\n")[0].trim()
      if (firstLine.length > 50) {
        return firstLine.substring(0, 47) + "..."
      }
      return firstLine || "Untitled Note"
    }

    if (!response.ok) {
      return fallbackTitle() // fallback to normal note titling
    }

    const data = await response.json()

    if (!data.title) {
      return fallbackTitle()
    }
    
    return data.title || "Untitled Note"
    
  }

  function extractHashtags(content) {
    const hashtags = content.match(/#[\w]+/g)
    return hashtags ? hashtags.map((tag) => tag.substring(1)) : []
  }

  function formatNoteContent(content) {
    // Basic markdown-like formatting
    let formatted = content

    // Headers
    formatted = formatted.replace(/^# (.*$)/gm, '<h3 class="lia-note-h3">$1</h3>')
    formatted = formatted.replace(/^## (.*$)/gm, '<h4 class="lia-note-h4">$1</h4>')

    // Bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Italic
    formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>")

    // Lists
    formatted = formatted.replace(/^- (.*$)/gm, '<li class="lia-note-li">$1</li>')
    formatted = formatted.replace(/(<li class="lia-note-li">.*<\/li>)/s, '<ul class="lia-note-ul">$1</ul>')

    // Line breaks
    formatted = formatted.replace(/\n/g, "<br>")

    return formatted
  }

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    if (diff < 60000) return "Just now"
    if (diff < 3600000) return Math.floor(diff / 60000) + "m ago"
    if (diff < 86400000) return Math.floor(diff / 3600000) + "h ago"
    if (diff < 604800000) return Math.floor(diff / 86400000) + "d ago"

    return date.toLocaleDateString()
  }

  // Global functions for note actions
  window.editNote = async (noteId) => {
    await loadNote(noteId)
    document.getElementById("lia-message-input").focus()
    document.getElementById("lia-send-btn").disabled = false
    showTemporaryNotification("📝 Note loaded for editing", "info")
  }

  window.duplicateNote = async (noteId) => {
    const originalNote = await getNoteFromStorage(noteId)
    if (!originalNote) return

    const duplicatedNote = {
      ...originalNote,
      id: generateNoteId(),
      title: originalNote.title + " (Copy)",
      timestamp: Date.now(),
      lastModified: Date.now(),
    }

    await saveNoteToStorage(duplicatedNote)
    await updateConversationList()

    document.getElementById("lia-send-btn").disabled = true
    document.getElementById("lia-message-input").value = ""

    showTemporaryNotification("📝 Note duplicated!", "success")
  }

  window.duplicateNoteContent = async (noteId, contentId) => {
    const note = await getNoteFromStorage(noteId)
    if (!note) return

    const content = note.content.find((item) => item.contentId === contentId)
    if (!content) return

    const duplicatedContent = {
      ...content,
      contentId: generateContentId(),
      timestamp: Date.now(),
      lastModified: Date.now(),
    }

    note.content.push(duplicatedContent)
    await saveNoteContentToStorage(note, duplicatedContent)
    await loadNote(noteId)

    showTemporaryNotification("📝 Note content duplicated!", "success")
  }

  window.deleteNote = async (noteId) => {
    await deleteNoteFromStorage(noteId)

    if (chatbotState.currentNoteId === noteId) {
      await startNewNote()
    }

    await updateConversationList()

    document.getElementById("lia-send-btn").disabled = true
    document.getElementById("lia-message-input").value = ""

    showTemporaryNotification("🗑️ Note deleted", "info")
  }

  window.deleteNoteContent = async (noteId, contentId) => {
    await deleteNoteContentFromStorage(noteId, contentId)
    await loadNote(noteId)
    
    showTemporaryNotification("🗑️ Note content deleted", "info")
  }

  async function toggleChatbot() {
    if (chatbotState.isOpen) {
      closeChatbot()
    } else {
      openChatbot()
    }
    // save chatbot state
    await saveChatbotState()
  }

  async function openChatbot() {
    const chatbotInterface = document.getElementById("lia-chatbot-interface")
    chatbotInterface.classList.add("open")
    chatbotInterface.classList.remove("minimized")
    chatbotState.isOpen = true
    chatbotState.isMinimized = false
    liaUser = await window.getLiaUserInfo()

    await loadChatbotState()

    if (chatbotState.notesMode) {
      // If in Notes Mode, load notes
      await loadNotes()
    } else {
      // Load chat history
      await loadChatHistory()
    }

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
    numberOfConversationsToLoad = 10
    numberOfNotesToLoad = 10

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

  async function loadMore() {
    const loadMoreBtn = document.getElementById("lia-load-more-btn")
  
    // Prevent double-click while loading
    if (loadMoreBtn.disabled) return
  
    // Add loading state
    loadMoreBtn.disabled = true
    const originalText = loadMoreBtn.innerHTML
    loadMoreBtn.innerHTML = `
      <svg class="spinner" width="20" height="20" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
    `
  
    // Add spinner CSS (you can place this in your stylesheet instead)
    if (!document.getElementById("spinner-style")) {
      const style = document.createElement("style")
      style.id = "spinner-style"
      style.innerHTML = `
        .spinner {
          animation: rotate 1s linear infinite;
        }
        .path {
          stroke: #4f46e5;
          stroke-linecap: round;
          animation: dash 1.5s ease-in-out infinite;
        }
        @keyframes rotate {
          100% { transform: rotate(360deg); }
        }
        @keyframes dash {
          0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
          100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
        }
      `
      document.head.appendChild(style)
    }
  
    try {
      if (chatbotState.notesMode) {
        // await loadMoreNotes()
      } else {
        numberOfConversationsToLoad += 10
        await updateConversationList()
      }
    } finally {
      // Remove loading state
      loadMoreBtn.disabled = false
      loadMoreBtn.innerHTML = originalText
    }
  }  

  async function loadMoreNotes() {
    //await fetch('https://')
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

  async function sendMessage(_message) {
    const messageInput = document.getElementById("lia-message-input")
    let message = messageInput.value.trim()

    if (!message) {
      message = _message || ""
    }

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

        if (response && response.error && response.error.includes('missing plan')) {
          // Remove typing indicator
          hideTypingIndicator()
          addMessageToChat('assistant', 'Please upgrade your plan to use this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Upgrade Now</a>')
          return
        } else if (response && response.error && response.error.includes('Plan expired')) {
          // Remove typing indicator
          hideTypingIndicator()
          showTemporaryNotification("Your plan has expired. Please renew your subscription.", "error")
          addMessageToChat('assistant', 'Your plan has expired. Please renew your subscription to continue using this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Renew Now</a>')
          return
        }
        // Handle other errors
        throw new Error(response.error || "Failed to generate response from AI")
      } catch (error) {
        console.error("Error generating chat response:", error)
      }

      // hide quick suggestions
      hideQuickSuggestions()

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
        
        async function typeWriter() {
          if (i <= plainContent.length) {
            const currentText = plainContent.slice(0, i);
            const formattedText = formatMarkdown(formatLinks(currentText));
            contentDiv.innerHTML = formattedText + (i < plainContent.length ? '<span class="lia-cursor">|</span>' : '');
            i++;
            setTimeout(typeWriter, 8);
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
        <div class="lia-message-avatar">${getUserAvatar()}</div>
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

  /*async function generateChatResponse(message) {
    // check if post suggestion enabled
    if (!settings.chatbot_enabled) return

    // Create body for request
    const body = {
      message: message,
      reference: chatbotState.referencedContent
    }

    const response = await window.lia_fetchWithAuth(`https://api.getlia.live/api/chat/${chatbotState.currentConversationId}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await accessToken()}`,
      },
      credentials: "include",
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      //throw new Error(data.error?.message || "Failed to generate response")
      return data
    }

    return data.reply
  }*/

  async function generateChatResponse(message) {
    let template_id = null
    // Add template context if in templateMode
    if (chatbotState.templateMode && chatbotState.selectedTemplate && TEMPLATES[chatbotState.selectedTemplate]) {
      template_id = TEMPLATES[chatbotState.selectedTemplate].id
    }
    console.log("Using template_id:", template_id)
    console.log('templates...', TEMPLATES)

    // check if this is the first message the user sending in chat
    if (!chatbotState.currentConversationId) {
      await startNewConversation(template=true);
    }

    const body = {
      message: message,
      tone: settings.tone,
      industry: settings.industry,
      reference: chatbotState.referencedContent || null
    }

    if (template_id) {
      body.template_id = template_id
    }

    const response = await window.lia_fetchWithAuth(`https://api.getlia.live/api/chat/${chatbotState.currentConversationId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await accessToken()}`,
      },
      credentials: 'include',
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      //throw new Error(data.error?.message || "Failed to generate response")
      return data
    }

    if(chatbotState.templatesMode) {
      // exit template mode after first message
      // and becomes a normal chat but still has the template context
      chatbotState.templateMode = false
      chatbotState.selectedTemplate = null
      await saveChatbotState()
      // update UI
      document.getElementById("lia-template-badge").style.display = "none"
      document.getElementById("lia-template-toggle").classList.remove("active")
      document.getElementById("lia-sidebar-header").textContent = "CONVERSATIONS"
      document.getElementById("lia-new-chat-btn").innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New Chat
      `
    }

    return data.reply
  }

  async function startNewConversation(template=false) {
    // Clear current chat
    const messagesContainer = document.getElementById("lia-messages-container")

    if (!template) { // for normal chats
      // Show welcome message from Lia
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
        Hi! I'm Lia, your LinkedIn Intelligent Assistant. <br/><br/> I'm here to help you write posts, polish comments, and improve your content. <br/><br/>What can I assist you with today?
        </div>
      </div>
    `;
    }

    // now instead of creating a new conversation in localStorage, we will create a new chat in api server
    async function createNewChat() {
      const response = await window.lia_fetchWithAuth(`https://api.getlia.live/api/chat/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await accessToken()}`,
        },
        body: JSON.stringify({
          title: "New Chat",
          chat_type: template ? "template" : "normal",
          ...(template && { template_id: TEMPLATES[chatbotState.selectedTemplate].id || null }),
        }),
        credentials: "include",
      })
      const chat = await response.json()
      if (!response.ok) {
        throw new Error(chat.error || chat.message || "Failed to create new chat")
      }
      chatbotState.currentConversationId = chat.id
      return chat
    }

    await createNewChat()

    // Update conversation list
    await updateConversationList()

    // Focus on input
    document.getElementById("lia-message-input").focus()

    // clear referenced content
    chatbotState.referencedContent = null

  }

  async function loadChatHistory() {
    // load conversations from API server
    const conversations = await updateConversationList()
    numberOfConversationsToLoad += 10;

    chatbotState.conversations = conversations
    if (chatbotState.conversations.length === 0) {
      //addMessageToChat("assistant", "No conversations found. Start a new chat to begin!")
      await startNewConversation()
      return
    }
    
    if (conversations.length > 0) {
      chatbotState.currentConversationId = conversations[0].id
      
      loadConversation(chatbotState.currentConversationId)
    }

  }

  async function updateConversationList() {
      const conversationList = document.getElementById("lia-conversation-list")

      if (chatbotState.notesMode) {
        // Load and display notes instead of conversations
        const notes = await getNotesFromStorage()

        if (numberOfNotesToLoad > notes.length || numberOfNotesToLoad > 10) {
          // we're pagination append to conversationList
          conversationList.innerHTML += notes
          .map((note) => {
            const truncatedTitle = note.title.slice(0, 15) + (note.title.length > 15 ? "..." : "")
            const contextIcon = getContextIcon(note.context?.type)

            return `
              <div class="lia-conversation-item-wrapper" style="position: relative;">
                <div class="lia-conversation-item ${note.id === chatbotState.currentNoteId ? "active" : ""}"
                    data-id="${note.id}" title="${note.title}" style="cursor: pointer; padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between;">
                  <div style="flex: 1; overflow: hidden;">
                    <div class="truncatedTitle" style="font-size: 12px; font-weight: 500;">${contextIcon} ${truncatedTitle}</div>
                    <div style="font-size: 10px; color: #a9d2f3ff; margin-top: 2px;">${formatTimestamp(note.lastModified)}</div>
                  </div>
                  <span class="lia-menu-trigger" style="cursor: pointer; padding: 4px; border-radius: 4px; opacity: 0.7; transition: opacity 0.2s;">⋯</span>
                </div>
                <div class="lia-menu" style="display: none; position: absolute; right: 0; top: 100%; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; min-width: 120px; overflow: hidden;">
                  <button class="lia-edit-note-btn" data-id="${note.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                    <span style="margin-right: 8px;">✏️</span>Edit
                  </button>
                  <button class="lia-duplicate-note-btn" data-id="${note.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                    <span style="margin-right: 8px;">📋</span>Duplicate
                  </button>
                  <div style="height: 1px; background: #e0e0e0; margin: 4px 0;"></div>
                  <button class="lia-delete-note-btn" data-id="${note.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #dc3545; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                    <span style="margin-right: 8px;">🗑️</span>Delete
                  </button>
                </div>
              </div>
            `
          })
          .join("")
        } else {
          // not pagination initial fetch
          conversationList.innerHTML = notes
          .map((note) => {
            const truncatedTitle = note.title.slice(0, 15) + (note.title.length > 15 ? "..." : "")
            const contextIcon = getContextIcon(note.context?.type)

            return `
              <div class="lia-conversation-item-wrapper" style="position: relative;">
                <div class="lia-conversation-item ${note.id === chatbotState.currentNoteId ? "active" : ""}"
                    data-id="${note.id}" title="${note.title}" style="cursor: pointer; padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between;">
                  <div style="flex: 1; overflow: hidden;">
                    <div class="truncatedTitle" style="font-size: 12px; font-weight: 500;">${contextIcon} ${truncatedTitle}</div>
                    <div style="font-size: 10px; color: #a9d2f3ff; margin-top: 2px;">${formatTimestamp(note.lastModified)}</div>
                  </div>
                  <span class="lia-menu-trigger" style="cursor: pointer; padding: 4px; border-radius: 4px; opacity: 0.7; transition: opacity 0.2s;">⋯</span>
                </div>
                <div class="lia-menu" style="display: none; position: absolute; right: 0; top: 100%; background: white; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; min-width: 120px; overflow: hidden;">
                  <button class="lia-edit-note-btn" data-id="${note.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                    <span style="margin-right: 8px;">✏️</span>Edit
                  </button>
                  <button class="lia-duplicate-note-btn" data-id="${note.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                    <span style="margin-right: 8px;">📋</span>Duplicate
                  </button>
                  <div style="height: 1px; background: #e0e0e0; margin: 4px 0;"></div>
                  <button class="lia-delete-note-btn" data-id="${note.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #dc3545; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                    <span style="margin-right: 8px;">🗑️</span>Delete
                  </button>
                </div>
              </div>
            `
          })
          .join("")
        }

        // Add note-specific event listeners
        setupNoteEventListeners()
        return notes
      } else {
          // Original chat functionality
          let conversations = []
          // load conversations from API server
          conversations = await loadConversations(numberOfConversationsToLoad)

          if (numberOfConversationsToLoad > conversationList.length || numberOfConversationsToLoad > 10) {
            // then we are paginating so just append to lia-conversation-list
            conversationList.innerHTML += conversations
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
                `
              }
              )
              .join("")

          } else {
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
          }

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

          // chat specific event listeners
          setupChatEventListeners();
          return conversations;
      }
      
  }

  function setupNoteEventListeners() {
    // Add click to load note
    document.querySelectorAll(".lia-conversation-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        if (e.target.classList.contains("lia-menu-trigger")) return
        loadNote(item.dataset.id)
      })
    })

    // Menu toggles and actions
    document.querySelectorAll(".lia-menu-trigger").forEach((menuBtn) => {
      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        const menu = menuBtn.closest(".lia-conversation-item-wrapper").querySelector(".lia-menu")
        document.querySelectorAll(".lia-menu").forEach((m) => {
          if (m !== menu) m.style.display = "none"
        })
        menu.style.display = menu.style.display === "block" ? "none" : "block"
      })
    })

    // Note actions
    document.querySelectorAll(".lia-edit-note-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation()
        window.editNote(btn.dataset.id)
        document.querySelectorAll(".lia-menu").forEach((m) => (m.style.display = "none"))
      })
    })

    document.querySelectorAll(".lia-duplicate-note-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation()

        const noteId = btn.dataset.id
        const parentNode = btn.closest(".lia-message")

        const parentNoteId = parentNode ? parentNode.dataset.noteId : null

        if (parentNoteId === noteId || !parentNoteId) {
          // then duplicate the note by calling window.duplicateNote
          window.duplicateNote(noteId)
          document.querySelectorAll(".lia-menu").forEach((m) => (m.style.display = "none"))
        } else {
          window.duplicateNoteContent(parentNoteId, noteId)
        }

      })
    })

    document.querySelectorAll(".lia-delete-note-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation()

        const noteId = btn.dataset.id
        const parentNode = btn.closest(".lia-message")

        const parentNoteId = parentNode ? parentNode.dataset.noteId : null
        
        if (parentNoteId === noteId || !parentNoteId) {
          // then delete the note by calling window.deleteNote
          window.deleteNote(noteId)
          document.querySelectorAll(".lia-menu").forEach((m) => (m.style.display = "none"))
        } else {
          window.deleteNoteContent(parentNoteId, noteId)
        }
      })
    })
  }

  function setupChatEventListeners() {
    // Original chat event listeners
    document.querySelectorAll(".lia-conversation-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        if (e.target.classList.contains("lia-menu-trigger")) return
        loadConversation(item.dataset.id)
      })
    })
  
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

  function getContextIcon(contextType) {
    switch (contextType) {
      case "profile":
        return "👤"
      case "feed":
        return "📰"
      case "article":
        return "📖"
      case "general":
        return "📝"
      default:
        return "📝"
    }
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
  

   async function loadConversation(conversationId) { // load chat conversations
    let conversation = null

    // load conversation form API server
    async function loadChats () {
      const response = await window.lia_fetchWithAuth(`https://api.getlia.live/api/chat/${conversationId}/messages`, {
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

    const result = await loadChats()
    let chats;
    let template;
    try{
      chats = result.messages;
      template = result.template;
    } catch {
      // pass --> return no errors
    }
    conversation = chats

    if (!conversation) return

    chatbotState.currentConversationId = conversationId

    const messagesContainer = document.getElementById("lia-messages-container")
    messagesContainer.innerHTML = conversation
      .map(
        (msg) => {
          // if template and if this is the first message
          // insert assistant message as template
          if (template && msg.role === "assistant" && conversation.indexOf(msg) === 0) {
            return `
              <div class="lia-welcome-message">
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
                    Hi! I'm Lia, your LinkedIn Intelligent Assistant.<br/><br/>
                    You're using <strong>${template.name}</strong> - posts will be written like the example below:<br/><br/>
                    <div class="lia-template-example">
                      <div class="lia-linkedin-card">
                        <div class="lia-card-header">
                          <div class="lia-card-avatar">${template.example.author.charAt(0)}</div>
                          <div class="lia-card-info">
                            <div class="lia-card-name">${template.example.author}</div>
                            <div class="lia-card-title">Product Manager • 2nd</div>
                            <div class="lia-card-time">2h • 🌍</div>
                          </div>
                        </div>
                        <div class="lia-card-content">${template.example.content.replace(/\n/g, '<br>')}</div>
                        <div class="lia-card-engagement">
                          <span>👍 ${template.example.engagement.likes}</span>
                          <span>💬 ${template.example.engagement.comments}</span>
                          <span>🔄 12</span>
                        </div>
                      </div>
                    </div>
                    <br/>This style works great for:<br/>
                    • ${template.description}<br/>
                    • Building engagement through ${template.name.toLowerCase()} content<br/><br/>
                    What would you like to write about today?
                  </div>
                </div>
              </div>
              `
          }

          if (msg.role === "reference") {
            const refContent = JSON.parse(msg.content)
            return `
                  <div class="lia-referenced-content" title="Click to open">
                    <div class="lia-referenced-content-header">
                      <a href="${chatbotState.referencedContent ? chatbotState.referencedContent.url : ""}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                        </svg>
                        Referenced ${refContent.type}
                        ${refContent.author ? `by ${refContent.author}` : ""}
                      </a>
                    </div>
                    <a href="${chatbotState.referencedContent ? chatbotState.referencedContent.url : ""}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; font-weight: normal" class="lia-referenced-content-preview" title="Click to open">
                      ${refContent.text.substring(0, 150)}${refContent.text.length > 150 ? "..." : ""}
                    </a>
                  </div>
                `
          } else {
          
            return `
                <div class="lia-message ${msg.role}">
                  <div class="lia-message-avatar">${msg.role === "user" ? getUserAvatar() : `
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
    
    // add active state to the current conversation that was clicked
    // and remove active state from other conversations
    const conversations = document.querySelectorAll(".lia-conversation-item")
    conversations.forEach((conversation) => {
      if (conversation.getAttribute("data-id") === conversationId) {
        conversation.classList.add("active")
      } else {
        conversation.classList.remove("active")
      }
    })
  }

  // ===== RERERENCE MODE SYSTEM =====
  async function toggleReferenceMode() {
    // Check if user has pro access
    // only check if reference mode is already off
    if (chatbotState.referenceMode === false) {
      const proAccess = await checkProAccess()
      if (!proAccess && proAccess !== 'Request failed: Unauthorized') {
        showProUpgradeModal()
        return
      
      }
      if (proAccess === 'Request failed: Unauthorized') {
        showTemporaryNotification("Please sign in to access Reference Mode", "error")
        return
      }
    }

    chatbotState.referenceMode = !chatbotState.referenceMode
    const toggleBtn = document.getElementById("lia-reference-toggle")
    if (chatbotState.referenceMode) {
      toggleBtn.classList.add("reference-active")
      toggleBtn.title = "Reference Mode: ON (Click posts to reference)"

      // show different title when notes mode is enabled
      if (chatbotState.notesMode) {
        toggleBtn.title = "Reference Mode (pro): ON (Click any post to save to current note)"
      }
      initializeReferenceMode()
      showTemporaryNotification("📎 Reference Mode ON - Click any post to reference it", "success")

      // show different notification when notes mode is enabled
      if (chatbotState.notesMode) {
        showTemporaryNotification("📎 Reference Mode ON - Click any post to save to current note", "success")
      }
    } else {
      toggleBtn.classList.remove("reference-active")
      toggleBtn.title = "Reference Mode (Pro): OFF"
      disableReferenceMode()
      showTemporaryNotification("Reference Mode OFF", "info")
    }

    // save chatbot state
    await saveChatbotState()
  }

  async function checkProAccess() {
    // For now, return true for demo. In production, check user's subscription status
    //return true
    // Production implementation:
    // const { access_token } = await chrome.storage.local.get(['access_token'])
    // if (!access_token) return false
    //
    let response = await window.lia_fetchWithAuth('https://api.getlia.live/api/user/subscription', {
      headers: { Authorization: `Bearer ${await accessToken()}` },
      credentials: "include"
    })
    let data = await response.json()

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
      <div style="font-size: 48px; margin-bottom: 16px;">🚀</div>
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
        post.addEventListener("click", async (e) => {
          if (chatbotState.referenceMode) {
            e.preventDefault()
            e.stopPropagation()
            await capturePostReference(post)

            // save reference note content to current note in storage
            // if we are in notes mode
            if (chatbotState.notesMode) {
              const currentNote = await getNoteFromStorage(chatbotState.currentNoteId)
              if (currentNote) {
                // if current note is not null, then we can save the reference content
                // add the reference content to current note
                currentNote.content.push({
                  contentId: generateContentId(),
                  type: "reference",
                  content: chatbotState.referencedContent,
                })
                // update last modified
                currentNote.lastModified = Date.now()

                saveNoteToStorage(currentNote)
                
              } else {
                const newNote = {
                  id: generateNoteId(),
                  title: "Referenced Content",
                  content: [{
                    contentId: generateContentId(),
                    type: "reference",
                    content: chatbotState.referencedContent,
                  }],
                  tags: [],
                  context: chatbotState.noteContext,
                  timestamp: Date.now(),
                  lastModified: Date.now(),
                };
                await saveNoteToStorage(newNote);
                chatbotState.currentNoteId = newNote.id;
                await updateConversationList();
              }

              saveChatbotState()

            }
          }
        })
      })
    })

    // Add click listener to clear reference
    const clearReferenceBtns = document.querySelectorAll(".lia-clear-reference")
    if (clearReferenceBtns) {
      clearReferenceBtns.forEach(clearReferenceBtn => {
        clearReferenceBtn.addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation()
          clearReferencedContent(clearReferenceBtn)
        })
      })
    }
  }

  async function capturePostReference(postElement) {
    const content = extractPostContent(postElement)
    if (content) {
      chatbotState.referencedContent = content
      
      // show quick suggestions
      updateQuickSuggestions()

      // show the referenced content in chat
      showReferencedContent()

      // Save the reference content to chatbot state
      await saveChatbotState()

      // show notification
      if (chatbotState.notesMode) {
        showTemporaryNotification("✔ Content Referenced! And saved to your current notes.", "success")
      } else {
        showTemporaryNotification("✔ Content Referenced! Ask me about it.", "success")
      }
      // Auto-focus chat input
      const chatInput = document.getElementById("lia-message-input")
      if (chatInput) {
        chatInput.focus()
        if (chatbotState.notesMode) {
          chatInput.placeholder = "Write short note on the referenced content..."
        } else {
          chatInput.placeholder = "Ask me about the referenced content..."
        }
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
        // Extract url/link to post
        if (window.location.href.includes("feed")) {
          const postUrn = element?.getAttribute("data-urn")
          const linkToPost = postUrn ? `https://www.linkedin.com/feed/update/${postUrn}/` : window.location.href
          content.url = linkToPost

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
    const existingRefs = messagesContainer.querySelectorAll(".lia-referenced-content")
    if (existingRefs.length > 0) {
      const lastRef = existingRefs[existingRefs.length - 1]
      lastRef.remove()
    }

    const refDiv = document.createElement("div")
    refDiv.title = "Click to open"
    refDiv.className = "lia-referenced-content"
    refDiv.innerHTML = `
    <div class="lia-referenced-content-header">
      <a href="${chatbotState.referencedContent ? chatbotState.referencedContent.url : ""}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
        </svg>
        Referenced ${chatbotState.referencedContent.type}
        ${chatbotState.referencedContent.author ? `by ${chatbotState.referencedContent.author}` : ""}
      </a>
      <button class="lia-clear-reference">×</button>
    </div>
    <a href="${chatbotState.referencedContent ? chatbotState.referencedContent.url : ""}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; font-weight: normal" class="lia-referenced-content-preview" title="Click to open">
      ${chatbotState.referencedContent.text.substring(0, 150)}${chatbotState.referencedContent.text.length > 150 ? "..." : ""}
    </a>`
    messagesContainer.appendChild(refDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  async function clearReferencedContent(clearReferenceBtn) {
    chatbotState.referencedContent = null
    // save chatbot state to remove referencedContent from it
    await saveChatbotState()
    const refDiv = clearReferenceBtn.closest(".lia-referenced-content")
    if (refDiv) refDiv.remove()
    const chatInput = document.getElementById("lia-message-input")
    if (chatInput) {
      if (chatbotState.notesMode) {
        chatInput.placeholder = "Write your note here..."
      } else {
        chatInput.placeholder = "What do you want to post?"
      }
    }

    // hide quick suggestions
    setTimeout(() => {
      hideQuickSuggestions()
    }, 1000)

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
    if (chatbotState.notesMode) {
      indicator.textContent = "📎 Reference Mode Active - Click any post to add it to your current note."
    }
    document.body.appendChild(indicator)
  }

  function hideReferenceIndicator() {
    const indicator = document.getElementById("lia-reference-indicator")
    if (indicator) indicator.remove()
  }

  function showTemporaryNotification(message, type = "info") {
    const notification = document.createElement("div")
    const chatbotInterface = document.querySelector('.lia-chatbot-interface')
    notification.style.cssText = `
    position: fixed;
    top: -15%;
    right: 20px;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 10002;
    animation: slideInRight 0.3s ease;
    max-width: 300px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    pointer-events: none;
  `

    // Color schemes
    const colors = {
      success: { avatar: "#10b981", bubble: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
      error: { avatar: "#ef4444", bubble: "#fef2f2", text: "#991b1b", border: "#fecaca" },
      info: { avatar: "#0a66c2", bubble: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
      warning: { avatar: "#f59e0b", bubble: "#fffbeb", text: "#92400e", border: "#fed7aa" },
    }

    const colorScheme = colors[type] || colors.info

    // Avatar with pulsing effect
    const avatarContainer = document.createElement("div")
    avatarContainer.style.cssText = `
      width: 44px;
      height: 44px;
      background: ${colorScheme.avatar};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px ${colorScheme.avatar}40;
      opacity: 0;
      transform: scale(0);
      transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      flex-shrink: 0;
      position: relative;
    `

    // Add pulsing ring
    const pulseRing = document.createElement("div")
    pulseRing.style.cssText = `
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border: 2px solid ${colorScheme.avatar};
      border-radius: 50%;
      opacity: 0;
      animation: pulse 2s infinite;
    `

    const pulseStyle = document.createElement("style")
    pulseStyle.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.7; }
        100% { transform: scale(1.2); opacity: 0; }
      }
    `
    document.head.appendChild(pulseStyle)

    avatarContainer.appendChild(pulseRing)
    avatarContainer.innerHTML += `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
        <circle cx="16" cy="4" r="2" fill="white"/>
        <path d="M12 8a4 4 0 0 1 4-4" stroke="white"/>
      </svg>
    `

    // Modern speech bubble
    const speechBubble = document.createElement("div")
    speechBubble.style.cssText = `
      position: relative;
      background: ${colorScheme.bubble};
      color: ${colorScheme.text};
      padding: 14px 18px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      border: 1px solid ${colorScheme.border};
      max-width: 280px;
      opacity: 0;
      transform: scale(0.7) translateY(15px);
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      backdrop-filter: blur(10px);
    `

    // Curved tail for modern look
    const bubbleTail = document.createElement("div")
    bubbleTail.style.cssText = `
      position: absolute;
      left: -8px;
      top: 15px;
      width: 20px;
      height: 20px;
      background: ${colorScheme.bubble};
      border: 1px solid ${colorScheme.border};
      border-right: none;
      border-bottom: none;
      transform: rotate(-45deg);
      border-radius: 4px 0 0 0;
    `

    const messageText = document.createElement("span")
    speechBubble.appendChild(bubbleTail)
    speechBubble.appendChild(messageText)

    notification.appendChild(avatarContainer)
    notification.appendChild(speechBubble)

    chatbotInterface.appendChild(notification)

    // Animation sequence
    setTimeout(() => {
      avatarContainer.style.opacity = "1"
      avatarContainer.style.transform = "scale(1)"
    }, 100)

    setTimeout(() => {
      speechBubble.style.opacity = "1"
      speechBubble.style.transform = "scale(1) translateY(0)"
    }, 400)

    setTimeout(() => {
      let i = 0
      const typeMessage = () => {
        if (i <= message.length) {
          messageText.textContent = message.substring(0, i) + (i < message.length ? "▋" : "")
          i++
          setTimeout(typeMessage, 40)
        }
      }
      typeMessage()
    }, 600)

    // Cleanup
    setTimeout(() => {
      notification.style.transform = "translateX(-50%) scale(0.8)"
      notification.style.opacity = "0"
      setTimeout(() => {
        notification.remove()
        pulseStyle.remove()
      }, 2000)
    }, 5000)

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
  async function loadConversations(limit) {
    const access_token = await accessToken();
    const start = limit < 10 ? 0 : limit - 10;
  
    const response = await window.lia_fetchWithAuth(
      `https://api.getlia.live/api/chat/history?limit=${limit}&start=${start}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        credentials: "include",
      }
    );
  
    const chats = await response.json();
  
    if (!response.ok) {
      throw new Error(chats.error?.message || "Failed to load conversations");
    }
  
    return chats;
  }
  

  // helper function for farmating chat conversations
  function formatMessage(message) {
    let formattedMessage = formatLinks(message)
    formattedMessage = formatMarkdown(formattedMessage)

    return formattedMessage
  }

  // Enhanced helpers
  // format links
  function formatLinks(text) {
    // Handle markdown-style links [text](url)
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (match, linkText, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="lia-link">${linkText} <span class="lia-link-icon">🔗</span></a>`;
    });
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
