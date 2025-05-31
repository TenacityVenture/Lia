chrome.runtime.onInstalled.addListener(() => {
    // Initialize default settings
    chrome.storage.sync.get(['tone', 'industry', 'rewrite_enabled', 'reply_enabled', 'post_enabled'], (data) => {
      // Only set defaults for values that don't exist
      const defaults = {
        tone: data.tone || "professional",
        industry: data.industry || "technology",
        post_enabled: data.post_enabled !== undefined ? data.post_enabled : true,
        reply_enabled: data.reply_enabled !== undefined ? data.reply_enabled : true,
        rewrite_enabled: data.rewrite_enabled !== undefined ? data.rewrite_enabled : true,
      }
  
      chrome.storage.sync.set(defaults)
    })
  })
  
  // Handle messages from content script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "generateAIContent") {
      // This would handle any background processing if needed
      // For now, we're doing API calls directly from the content script
      sendResponse({ success: true })
    }
  
    return true // Keep the message channel open for async responses
  })
  
  