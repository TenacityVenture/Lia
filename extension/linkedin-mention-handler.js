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
    const mentionRegex = /@([^@\n.,!?;:]+?)(?=\n|$|[.,!?;:]|@|\s+@)/g
    processedText = processedText.replace(mentionRegex, (match, mentionText) => {
      const trimmedMentionText = mentionText.trim()
      const mentionData = this.findMentionData(trimmedMentionText)

      if (mentionData) {
        return this.createMentionElement(mentionData)
      }
      return match
    })

    // Step 2: Handle standalone names (without @) that match cached mentions
    // Create a regex for each cached mention to find standalone occurrences
    for (const [cachedText, mentionData] of this.mentionCache) {
      // Create a regex that matches the exact name with word boundaries
      // But avoid matching if it's already part of a mention element
      const nameRegex = new RegExp(`(?<!<a[^>]*>)\\b(${this.escapeRegex(mentionData.text)})\\b(?![^<]*</a>)`, "gi")

      processedText = processedText.replace(nameRegex, (match) => {
        // Additional check: don't replace if it's already inside HTML tags
        return this.createMentionElement(mentionData)
      })
    }

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
      return this.mentionCache.get(lowerText)
    }

    // Fuzzy match - find mentions that contain or are contained in the text
    for (const [cachedText, mentionData] of this.mentionCache) {
      if (cachedText.includes(lowerText) || lowerText.includes(cachedText)) {
        return mentionData
      }
    }

    // Try matching by first/last name parts
    const textParts = lowerText.split(/\s+/)
    for (const [cachedText, mentionData] of this.mentionCache) {
      const cachedParts = cachedText.split(/\s+/)
      if (
        textParts.some((part) =>
          cachedParts.some((cachedPart) => cachedPart.includes(part) || part.includes(cachedPart)),
        )
      ) {
        return mentionData
      }
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

/**
 * Show a temporary message in the editor
 */
function showTemporaryMessage(editor, message, type = "info") {
  const messageElement = document.createElement("div")
  messageElement.textContent = message
  messageElement.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: ${type === "success" ? "#4CAF50" : "#2196F3"};
    color: white;
    text-align: center;
    padding: 8px;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.3s ease;
  `

  editor.parentNode.style.position = "relative"
  editor.parentNode.appendChild(messageElement)

  // Fade in
  setTimeout(() => {
    messageElement.style.opacity = "1"
  }, 10)

  // Fade out and remove
  setTimeout(() => {
    messageElement.style.opacity = "0"
    setTimeout(() => {
      editor.parentNode.removeChild(messageElement)
    }, 300)
  }, 3000)
}

/**
 * Enhanced animate text rewrite function with mention support
 */
async function animateTextRewriteWithMentions(editor, originalText, newText) {
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
        } else {
          // Animation complete
          clearInterval(typewriterInterval)

          // Phase 3: Restore mentions and fade back in
          const textWithMentions = linkedInMentionHandler.restoreMentions(newText, editor)
          editor.innerHTML = textWithMentions

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
      }, 30) // Adjust speed here (lower = faster)
    }, 300)
  })
}

// Export for use in your existing code
window.linkedInMentionHandler = linkedInMentionHandler
window.animateTextRewriteWithMentions = animateTextRewriteWithMentions
