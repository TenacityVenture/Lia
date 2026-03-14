import { setupTextSelectionToolbar } from "./features/unicodeTextToolbar";
import { setupCommentReplyAssistant, removeCommentReplyAssistant } from "./features/commentReply";
import { setuprewrite_enabledment, removeRewriteAssistant } from "./features/postRewrite";
import { initializeChatbot } from "./features/chatbot/index";
import { addChatbotStyles } from "./features/chatbot/chatbotStyles";

(function () {
  let settings = {
    tone: "professional",
    industry: "technology",
    chatbot_enabled: true,
    reply_enabled: true,
    rewrite_enabled: true,
    linkedinTheme: "light",
    selectedPersona: "professional",
  };

  const isSetupRef = { current: false };

  async function initializeExtension() {
    if (isSetupRef.current) return;
    isSetupRef.current = true;

    // detect theme
    const theme = await (window as any).detectLinkedInTheme?.();
    settings.linkedinTheme = theme || "light";

    // Add chatbot CSS
    addChatbotStyles();

    setupCommentReplyAssistant();
    setuprewrite_enabledment();
    setupTextSelectionToolbar();
  }

  // Load settings when content script initializes
  chrome.storage.sync.get(
    [
      "tone",
      "industry",
      "chatbot_enabled",
      "reply_enabled",
      "rewrite_enabled",
      "linkedinTheme",
      "selectedPersona",
    ],
    (data) => {
      settings = { ...settings, ...data };
      initializeExtension();
    },
  );

  // Listen for auth tokens after sign-in or signup on the website
  window.addEventListener("message", async (event) => {
    if (event.origin !== "https://www.getlia.live") return;
    if (event.source !== window) return;

    if (event.data.type === "SEND_JWTs") {
      chrome.runtime.sendMessage({
        type: "STORE_JWTs",
        access_token: event.data.access_token,
        refresh_token: event.data.refresh_token,
      });
      initializeChatbot();
    }

    // clear tokens when logout on the website
    if (event.data.type === "CLEAR_JWTs") {
      await (window as any).lia_clearTokens?.();
    }
  });

  // Initialize chatbot when extension loads
  initializeChatbot();

  // Listen for messages from background/popup
  chrome.runtime?.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "settingsUpdated") {
      // Re-initialize chatbot to reflect new settings
      initializeChatbot();

      chrome.storage.sync.get(["reply_enabled", "rewrite_enabled"], (settings) => {
        if (!settings.reply_enabled) {
          removeCommentReplyAssistant();
        } else {
          setupCommentReplyAssistant();
        }

        if (!settings.rewrite_enabled) {
          removeRewriteAssistant();
        } else {
          setuprewrite_enabledment();
        }
      });
    }
  });

  let mutationTimeout: ReturnType<typeof setTimeout>;

  // Set up mutation observer to detect new elements
  const observer = new MutationObserver((mutations) => {
    // Check if extension context is still valid
    if (!chrome.runtime?.id) {
      observer.disconnect();
      return;
    }
    mutations.forEach((mutation) => {
      clearTimeout(mutationTimeout);
      mutationTimeout = setTimeout(async () => {
        if (mutation.addedNodes.length) {
          try {
            setupCommentReplyAssistant();
            setuprewrite_enabledment();
            setupTextSelectionToolbar();
          } catch (error) {
            console.error("MutationObserver Error:", error);
          }
        }
      }, 500);
    });
  });

  // observer entire document body
  observer.observe(document.body, { childList: true, subtree: true });

  const commentsContainer = document.body.querySelector(
    ".feed-shared-update-v2__comments-container",
  );
  if (commentsContainer) {
    observer.observe(commentsContainer, {
      childList: true,
      subtree: true,
    });
  }

  const commentBoxForm = document.body.querySelector(
    ".comments-comment-box__form",
  );
  if (commentBoxForm) {
    observer.observe(commentBoxForm, {
      childList: true,
      subtree: true,
    });
  }
})();
