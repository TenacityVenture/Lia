/**
 * LinkedIn Mention Handler for AI Rewriting
 * Preserves @mentions functionality when AI rewrites LinkedIn posts
 */

class LinkedInMentionHandler {
  constructor() {
    this.mentionCache = new Map()
  }

  /**
   * Extract mention data from editor before rewriting
   */
  extractMentions(editor) {
    const mentions = new Map()
    const mentionElements = editor.querySelectorAll('a.ql-mention[data-test-ql-mention="true"]')

    mentionElements.forEach((element, index) => {
      const mentionData = {
        text: element.textContent.trim(),
        originalText: element.getAttribute("data-original-text"),
        entityUrn: element.getAttribute("data-entity-urn"),
        objectUrn: element.getAttribute("data-object-urn"),
        guid: element.getAttribute("data-guid") || index.toString(),
        href: element.getAttribute("href") || "#",
      }

      // Store by both original text and display text for flexible matching
      mentions.set(mentionData.text.toLowerCase(), mentionData)
      if (mentionData.originalText && mentionData.originalText !== mentionData.text) {
        mentions.set(mentionData.originalText.toLowerCase(), mentionData)
      }
    })

    this.mentionCache = mentions
    return mentions
  }

  /**
   * Process AI-generated text to restore mentions
   */
  restoreMentions(newText, editor) {
    if (this.mentionCache.size === 0) {
      return newText
    }

    let processedText = newText

    // Step 1: Handle @mentions (existing functionality)
    /*const mentionRegex = /@([^@\n.,!?;:]+?)(?=\n|$|[.,!?;:]|@|\s+@)/g
    processedText = processedText.replace(mentionRegex, (match, mentionText) => {
      const trimmedMentionText = mentionText.trim()
      console.log('trimmedMentionText', trimmedMentionText)
      const mentionData = this.findMentionData(trimmedMentionText)
      console.log('mentionData', mentionData)

      if (mentionData) {
        return this.createMentionElement(mentionData)
      }
      return match
    })*/

    const trimmedMentionText = newText.trim()
    const mentionData = this.findMentionData(trimmedMentionText)

    if (mentionData && mentionData.length > 0) {
      mentionData.forEach((mention) => {
        const textToReplace = '@' + (mention.originalText || mention.text)
        const textToReplaceWith = this.createMentionElement(mention)
        processedText = processedText.replaceAll(textToReplace, textToReplaceWith)
        console.log(processedText, 'processedText after replacement')
      })
    } else {
      // If no mention data found, just return the original text
      const mentionRegex = /@([^@\n.,!?;:]+?)(?=\n|$|[.,!?;:]|@|\s+@)/g
      processedText = processedText.replaceAll(mentionRegex, (match) => {
        return match // No replacement, keep original text
      })
      return processedText
    }


    // Step 2: Handle standalone names (without @) that match cached mentions
    // Create a regex for each cached mention to find standalone occurrences
    /*for (const [cachedText, mentionData] of this.mentionCache) {
      // Create a regex that matches the exact name with word boundaries
      // But avoid matching if it's already part of a mention element
      const nameRegex = new RegExp(`(?<!<a[^>]*>)\\b(${this.escapeRegex(mentionData.text)})\\b(?![^<]*</a>)`, "gi")

      processedText = processedText.replace(nameRegex, (match) => {
        // Additional check: don't replace if it's already inside HTML tags
        return this.createMentionElement(mentionData)
      })
    }*/

    return processedText
  }

  /**
   * Escape special regex characters in a string
   */
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  /**
   * Find mention data by text (case-insensitive, flexible matching)
   */
  findMentionData(mentionText) {
    const lowerText = mentionText.toLowerCase()

    // Direct match
    if (this.mentionCache.has(lowerText)) {
      // If direct match, return all matching mention data (could be multiple for same text)
      const matches = []
      for (const [key, mentionData] of this.mentionCache) {
        if (key === lowerText) {
          matches.push(mentionData)
        }
      }
      // Return array of matches if more than one, else single object
      return matches.length > 1 ? matches : matches[0]
    }

    // Fuzzy match - find mentions that contain or are contained in the text
    let fuzzyMatches = []
    for (const [cachedText, mentionData] of this.mentionCache) {
      if (cachedText.includes(lowerText) || lowerText.includes(cachedText)) {
        // Collect all fuzzy matches in an array
        fuzzyMatches.push(mentionData)
      }
    }

    if (fuzzyMatches.length > 0) {
      // If fuzzy matches found, return them
      return fuzzyMatches.length > 1 ? fuzzyMatches : fuzzyMatches[0]
    }

    // Try matching by first/last name parts
    const allMatches = []
    const textParts = lowerText.split(/\s+/)
    for (const [cachedText, mentionData] of this.mentionCache) {
      const cachedParts = cachedText.split(/\s+/)
      if (
        textParts.some((part) =>
          cachedParts.some((cachedPart) => cachedPart.includes(part) || part.includes(cachedPart)),
        )
      ) {
        // Collect all matches in an array
        allMatches.push(mentionData)
      }
    }

    if (allMatches.length > 0) {
      // If all matches found return them
      return allMatches
    }

    return null
  }

  /**
   * Create LinkedIn mention element
   */
  createMentionElement(mentionData) {
    return `<a class="ql-mention" href="${mentionData.href}" data-entity-urn="${mentionData.entityUrn}" data-guid="${mentionData.guid}" data-object-urn="${mentionData.objectUrn}" data-original-text="${mentionData.originalText || mentionData.text}" spellcheck="false" data-test-ql-mention="true">${mentionData.text}</a>`
  }

  /**
   * Clean up mention cache
   */
  clearCache() {
    this.mentionCache.clear()
  }
}

// Create global instance
const linkedInMentionHandler = new LinkedInMentionHandler()

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

/**
 * Enhanced animate text rewrite function with mention support
 */
async function animateTextRewriteWithMentions(editor, originalText, newText, improvements) {
  return new Promise((resolve) => {
    // Extract mentions before starting animation
    const mentions = linkedInMentionHandler.extractMentions(editor)

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

          // For the animation, show plain text with cursor
          editor.textContent = partialText + (currentIndex < newText.length ? "|" : "")

          currentIndex++

          // scroll to the bottom of the editor
          editor.closest('.share-box').scrollTo({
            top: editor.scrollHeight,
            behavior: 'smooth'
          })
        } else {
          // Animation complete
          clearInterval(typewriterInterval)

          // Phase 3: Restore mentions and fade back in
          const textWithMentions = linkedInMentionHandler.restoreMentions(newText, editor)
          // convert to HTML
          // every new line should be a p
          const paragraphs = textWithMentions.split(/\n/).map(line => `<p>${line}</p>`).join('')
          // Set the editor's innerHTML to the paragraphs
          editor.innerHTML = paragraphs

          // Fade back in with final text
          editor.style.opacity = "1"

          // Restore original styles
          setTimeout(() => {
            editor.style.opacity = originalStyles.opacity
            editor.style.transition = originalStyles.transition

            // Dispatch input event to trigger LinkedIn's handlers
            const inputEvent = new Event("input", { bubbles: true })
            editor.dispatchEvent(inputEvent)

            // Trigger LinkedIn's mention detection
            const keyupEvent = new KeyboardEvent("keyup", { bubbles: true })
            editor.dispatchEvent(keyupEvent)

            // Show success indicator
            showTemporaryMessage(editor, "✨ Text improved!", "success")

            // Clean up
            linkedInMentionHandler.clearCache()

            resolve()
          }, 300)
        }

      }, 15) // Adjust speed here (lower = faster)
      
      // Show improvements as queued notifications, one after another
      if (improvements && improvements.length > 0) {
        // Calculate typewriter duration (ms)
        const typewriterDuration = Math.max(newText.length * 15, 800); // fallback min duration
        const improvementDisplayTime = Math.floor(typewriterDuration / improvements.length);

        //let improvementIndex = 0;
        //const showNextImprovement = () => {
        //  if (improvementIndex < improvements.length) {
        //showTemporaryMessage(editor, improvements[improvementIndex], "info");
        //improvementIndex++;
        setTimeout(() => {
          window.lia_showTemporaryImprovements(editor, improvements, improvementDisplayTime);
        }, improvementDisplayTime);
        //  }
        //};
        //showNextImprovement();
      }
    }, 300)
  })
}

// Export for use in your existing code
window.linkedInMentionHandler = linkedInMentionHandler
window.animateTextRewriteWithMentions = animateTextRewriteWithMentions
window.LinkedInMentionHandler = LinkedInMentionHandler