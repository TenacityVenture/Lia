(() => {

let settings = {
  tone: "professional",
  industry: "technology",
  apiKey: "",
  post_enabled: true,
  reply_enabled: true,
  rewrite_enabled: true,
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
  }

  if (event.data.type === 'CLEAR_JWTs') {
    chrome.storage.local.remove(['access_token', 'refresh_token'], () => {
      console.log('Access token and refresh token cleared from storage.');
    });
  }
});

function initializeExtension() {
  // Initialize the extension functionality
  setupPostCreationAssistant()
  setupCommentReplyAssistant()
  setuprewrite_enabledment()
  setupTextSelectionToolbar()

  let mutationTimeout;

  // Set up mutation observer to detect new elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      clearTimeout(mutationTimeout);
      mutationTimeout = setTimeout(() => {
        if (mutation.addedNodes.length) {
            try {
              setupPostCreationAssistant()
              setupCommentReplyAssistant()
              setuprewrite_enabledment()
              //setupTextSelectionToolbar()
          } catch (error) {
              console.error("MutationObserver Error:", error);
          }
        }
      }, 500);
    })
  })

  observer.observe(document.body, { childList: true, subtree: true })
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
      title: 'AI Rewrite Sentence',
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
      // Use Unicode bold characters or formatting symbols
      formattedText = toUnicodeStyle(selectedText) // convert to unicode bold
      break
    case 'italic':
      // Use Unicode italic or formatting symbols
      formattedText = toUnicodeStyle(selectedText, 'italic') // convert to unicode italic
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
  const fullSentence = getFullSentence(selection)
  
  try {
    showToolbarLoading()
    const rewrittenText = await generateRewrittenText(fullSentence, 'rewrite')
    replaceTextInSentence(selection, fullSentence, rewrittenText)
    hideToolbar()
  } catch (error) {
    showToolbarError(error.message)
  }
}

async function handleTextTransform(type) {
  const selection = window.getSelection()
  const selectedText = selection.toString().trim()
  
  if (!selectedText) return

  try {
    showToolbarLoading()
    const transformedText = await generateRewrittenText(selectedText, type)
    replaceSelectedText(transformedText)
    hideToolbar()
  } catch (error) {
    showToolbarError(error.message)
  }
}

function getFullSentence(selection) {
  const range = selection.getRangeAt(0)
  const container = range.commonAncestorContainer
  const text = container.textContent || container.innerText || ''
  
  const startOffset = range.startOffset
  
  // Find sentence boundaries
  let sentenceStart = text.lastIndexOf('.', startOffset - 1) + 1
  let sentenceEnd = text.indexOf('.', startOffset)
  
  if (sentenceStart < 0) sentenceStart = 0
  if (sentenceEnd < 0) sentenceEnd = text.length
  
  return text.substring(sentenceStart, sentenceEnd).trim()
}

async function generateRewrittenText(text, type) {
  if (!settings.apiKey) {
    throw new Error("Please add your OpenAI API key in the extension settings")
  }

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

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a professional LinkedIn content editor. Improve text while maintaining the original voice and message.`,
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
    throw new Error(data.error?.message || "Failed to transform text")
  }

  return data.choices[0].message.content.trim()
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

function replaceTextInSentence(selection, originalSentence, newSentence) {
  const range = selection.getRangeAt(0)
  const container = range.commonAncestorContainer
  const text = container.textContent || container.innerText || ''
  
  const newText = text.replace(originalSentence, newSentence)
  
  if (container.nodeType === Node.TEXT_NODE) {
    container.textContent = newText
  } else {
    container.innerText = newText
  }
  
  // Trigger input event for LinkedIn
  const editor = container.parentElement || container
  const inputEvent = new Event("input", { bubbles: true })
  editor.dispatchEvent(inputEvent)
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
      let aiPostContainer = document.createElement("form")
      aiPostContainer.className = "linkedin-ai-post-container"

      // ai post input
      let aiPostInput = document.createElement("input")
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
          console.log('this is the content|', content)
          handlepost_enabledant(editor, content)
        }
      })

      aiButton.addEventListener("click", (event) => {
        event.preventDefault()
        const content = aiPostInput.value
        console.log('this is the content|', content)
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
    // Check if we've already added our button
    const container = input.querySelector(".ql-container")

    if (input.querySelector(".linkedin-ai-button")) return

    // Find the comment actions area
    const actionsArea = container.closest(".comments-comment-box-comment__text-editor")

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

      aiButton.addEventListener("click", () => {
        handlereply_enabledant(input)
        //setInterval(() => {
        //}, 1000)
      })

      // Add button to actions area
      actionsArea.prepend(aiButton)
    }
  })
}

function setuprewrite_enabledment() {
  if (!settings.rewrite_enabled) return

  const createPostButton = document.querySelector(".share-box-feed-entry__top-bar button.artdeco-button--tertiary")

  createPostButton.addEventListener('click', () => {

    setTimeout(() => {
      let shareBoxAction = document.querySelector(".share-box_actions")
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
        handleRewriteAssistant(qlEditor)
      })

      if (shareBoxAction) {
        if (!shareBoxAction.querySelector(".linkedin-ai-button")) {
          shareBoxAction.prepend(aiButton)
        }
      }
      
      
    }, 5000)
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

    // Generate suggestions
    const suggestions = await generateCommentSuggestions(context)

    // Display suggestions
    displayCommentSuggestions(suggestionsContainer, suggestions, commentInput)
  } catch (error) {
    suggestionsContainer.innerHTML = `
      <div style="color: red; padding: 10px;">
        Error: ${error.message || "Failed to generate suggestions"}
      </div>
    `
  }
}

async function handleRewriteAssistant(editor) {
  // Get the current text content
  const currentText = editor.textContent || editor.innerText || ""

  if (!currentText.trim()) {
    // Show a temporary message if no text is selected
    showTemporaryMessage(editor, "Please write some text first to rewrite it")
    return
  }

  // Show loading state by adding a subtle overlay
  const loadingOverlay = createLoadingOverlay(editor)

  try {
    // Generate improved version
    const improvedText = await generateImprovedText(currentText)

    // Remove loading overlay
    loadingOverlay.remove()

    // Perform the in-place rewrite with animation
    await animateTextRewrite(editor, currentText, improvedText)
  } catch (error) {
    loadingOverlay.remove()
    showTemporaryMessage(editor, `Error: ${error.message}`)
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
  if (!settings.apiKey) {
    throw new Error("Please add your OpenAI API key in the extension settings")
  }

  const prompt = `Improve and rewrite the following LinkedIn post to make it more engaging, professional, and impactful. Keep the core message but enhance clarity, flow, and engagement. Maintain the same tone (${settings.tone}) and make it suitable for the ${settings.industry} industry:

"${originalText}"

Return only the improved text without any explanations or quotes.`

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a professional LinkedIn content editor. You improve posts to be more engaging and professional while maintaining the original voice and message.`,
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
    throw new Error(data.error?.message || "Failed to generate improved text")
  }

  return data.choices[0].message.content.trim()
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
    let articleContainer = document.querySelector('.reader-article-content')
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

    return context
  }

  
}

async function generatePostSuggestions(postContent, context) {
  // Check if API key is available
  if (!settings.apiKey) {
    throw new Error("Please add your OpenAI API key in the extension settings")
  }

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
      Authorization: `Bearer ${settings.apiKey}`,
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
  const { access_token, refresh_token } = await chrome.storage.local.get(['access_token', 'refresh_token']);
  if (access_token == null || refresh_token == null) {
    throw new Error("Please Sign in to continue")
  };

  // Prepare the prompt
  let prompt = `Generate 3 professional LinkedIn comment replies`

  if (context.postContent) {
    prompt += ` to this post: "${context.postContent}"`
  }

  if (context.postWriter) {
    prompt += `. Written by ${context.postWriter}`
  }


  if (context.previousComments && context.previousComments.length > 0) {
    prompt += `. Consider these previous comments: ${context.previousComments.join(" | ")}`
  }

  prompt += `. The tone should be ${settings.tone}. And industry should b ${settings.industry}`
  prompt += ` Each reply should be concise (under 100 words), thoughtful, and add value to the conversation. With no hastags.`

  async function generate() {
    const { access_token } = await chrome.storage.local.get(['access_token']);
    const response = await fetch ("https://my_apiurl/api/prompt/suggest-reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        comment_text: prompt
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

  // Parse the response to extract the suggestions
  const content = data.choices[0].message.content

  // Split the content into separate suggestions
  const suggestions = content
    .split(/\d+\.\s+/)
    .filter(Boolean)
    .map((s) => s.trim())

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
  console.log(editor, text)
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
const refreshToken = async (refresh_token) => {
  try {
    const response = await fetch('https://your-api.com/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
    
      },
      body: JSON.stringify({ refresh_token }),
      credentials: 'include'
    });

    const data = await response.json();

    chrome.storage.local.set({ access_token: data.access_token, refresh_token: data.refresh_token });
    return data.access_token;

  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}
})()
