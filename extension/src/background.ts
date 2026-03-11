chrome.runtime.onInstalled.addListener(() => {
  // Initialize default settings
  chrome.storage.sync.get(
    ["tone", "industry", "rewrite_enabled", "reply_enabled", "chatbot_enabled"],
    (data) => {
      // Only set defaults for values that don't exist
      const defaults = {
        tone: data.tone || "professional",
        industry: data.industry || "technology",
        chatbot_enabled:
          data.chatbot_enabled !== undefined ? data.chatbot_enabled : true,
        reply_enabled:
          data.reply_enabled !== undefined ? data.reply_enabled : true,
        rewrite_enabled:
          data.rewrite_enabled !== undefined ? data.rewrite_enabled : true,
      };

      chrome.storage.sync.set(defaults);
    },
  );
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "generateAIContent") {
    // This would handle any background processing if needed
    // For now, we're doing API calls directly from the content script
    sendResponse({ success: true });
  }

  return true; // Keep the message channel open for async responses
});

// Listen for auth tokens from content script after sign-in or signup on the website
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if the message is to store JWTs
  if (message.type === "STORE_JWTs") {
    // Store securely in Chrome storage
    chrome.storage.local.set(
      {
        access_token: message.access_token,
        refresh_token: message.refresh_token,
      },
      () => {
        console.log("Access token and refresh token saved in storage.");
      },
    );
    sendResponse({ status: "ok" });
  }
});
