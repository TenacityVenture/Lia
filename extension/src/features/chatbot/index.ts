// @ts-nocheck
import { chatbotState, loadChatbotState } from "./chatbotState";
import { createChatbotButton, createChatbotInterface } from "./chatbotUI";
import {
  setupChatbotEventListeners,
  toggleNotesMode,
  toggleTemplateMode,
  loadChatHistory,
} from "./chatbotCore";

// Any missing references like hideQuickSuggestions, fetchTemplates can also be imported from chatbotCore.
import {
  hideQuickSuggestions,
  loadTemplates as fetchTemplates,
} from "./chatbotCore";

export async function initializeChatbot() {
  const { chatbot_enabled } = await chrome.storage.sync.get([
    "chatbot_enabled",
  ]);
  if (!chatbot_enabled) {
     const existingContainer = document.getElementById("lia-fab-container");
     if (existingContainer) existingContainer.remove();
     const chatbotInterface = document.getElementById("lia-chatbot-interface");
     if (chatbotInterface) chatbotInterface.remove();
     return;
  }

  if (window.location.href.includes("linkedin.com")) {
    await loadChatbotState();

    createChatbotButton();
    createChatbotInterface();
    setupChatbotEventListeners();

    if (chatbotState.notesMode) {
      chatbotState.notesMode = false;
      await toggleNotesMode();
    } else if (chatbotState.templateMode) {
      chatbotState.templateMode = false;
      await toggleTemplateMode();
    } else {
      await loadChatHistory();
    }

    hideQuickSuggestions();
    await fetchTemplates();

    if (typeof (window as any).getUserAvatar === "function") {
      (window as any).getUserAvatar(true);
    }
  }
}
