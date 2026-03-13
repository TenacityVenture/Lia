// @ts-nocheck
import { accessToken, waitForElement } from "../../utils/textHelpers";
import { chatbotState, saveChatbotState, loadChatbotState } from "./chatbotState";
import { createChatbotButton, createChatbotInterface } from "./chatbotUI";
import { TEMPLATES as InitialTemplates } from "../../utils/constants";

export let numberOfConversationsToLoad = 10;
export let numberOfNotesToLoad = 10;
export let liaUser = null;
export let TEMPLATES = InitialTemplates;
export let settings = { industry: 'technology', tone: 'professional' };

// Initialize settings from storage
chrome.storage.sync.get(["tone", "industry"], (data) => {
  settings = { ...settings, ...data };
});

export function setupChatbotEventListeners() {
    const messageInput = document.getElementById("lia-message-input");
    const sendBtn = document.getElementById("lia-send-btn");
    const minimizeBtn = document.getElementById("lia-minimize-btn");
    const closeBtn = document.getElementById("lia-close-btn");
    const sidebarToggle = document.getElementById("lia-sidebar-toggle");
    const sidebar = document.getElementById("lia-chat-sidebar");
    const loadMoreBtn = document.getElementById("lia-load-more-btn");
    const newChatBtn = document.getElementById("lia-new-chat-btn");
    const liaChatbotTitle = document.querySelector(".lia-chatbot-title");
    const referenceToggle = document.getElementById("lia-reference-toggle");
    const notesToggle = document.getElementById("lia-notes-toggle");
    const templateToggle = document.getElementById("lia-template-toggle");

    // Notes action buttons
    const structureBtn = document.getElementById("lia-structure-note");
    const summarizeBtn = document.getElementById("lia-summarize-note");
    const expandBtn = document.getElementById("lia-expand-note");
    const addTagsBtn = document.getElementById("lia-add-tags");

    // Quick suggestions elements
    const quickSuggestions = document.getElementById("lia-quick-suggestions");
    const suggestionsClose = document.getElementById("lia-suggestions-close");
    const suggestionsTrack = document.getElementById("lia-suggestions-track");
    const suggestionsPrev = document.getElementById("lia-suggestions-prev");
    const suggestionsNext = document.getElementById("lia-suggestions-next");

    // set default to collapsed
    sidebar.classList.add("collapsed");

    // Auto focus
    messageInput.focus();

    // Auto-resize textarea
    messageInput.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = Math.min(this.scrollHeight, 120) + "px";
    });

    // Send message on Enter (but not Shift+Enter)
    messageInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (chatbotState.notesMode) {
          saveNote();
        } else {
          sendMessage();
        }
      }
    });

    // Enable/disable send button based on input
    messageInput.addEventListener("input", function () {
      sendBtn.disabled = !this.value.trim();
    });

    // Control buttons
    minimizeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      minimizeChatbot();
    });

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeChatbot();
    });

    // Sidebar toggle
    sidebarToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSidebar();
    });

    // show sidebar when chatbot title is hovered upon
    liaChatbotTitle.addEventListener("mouseover", (e) => {
      e.stopPropagation();

      // toggle sidebar
      toggleSidebar();
    });

    // hide side bar on mouseout
    liaChatbotTitle.addEventListener("mouseout", (e) => {
      e.stopPropagation();
      // toggle sidebar
      toggleSidebar();
    });

    // continue showing sidebar if mouse is on it
    sidebar.addEventListener("mouseover", (e) => {
      e.stopPropagation();
      // toggle sidebar
      showSidebar();
    });

    // loadmore for pagination
    loadMoreBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      loadMore();
    });

    // New chat/note button
    newChatBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (chatbotState.notesMode) {
        // if notes mode enabled, start a new note
        startNewNote();
      } else {
        await startNewConversation();
      }
    });

    // Send button
    sendBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (chatbotState.notesMode) {
        saveNote();
      } else {
        sendMessage();
      }
    });

    // Reference mode toggle
    referenceToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleReferenceMode();
    });

    // Notes mode toggle
    notesToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleNotesMode();
    });

    // Template mode toggle
    templateToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleTemplateMode();
    });

    // Notes action buttons
    structureBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      enhanceNote("structure");
    });

    summarizeBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      enhanceNote("summarize");
    });

    expandBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      enhanceNote("expand");
    });

    addTagsBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      enhanceNote("tags");
    });

    // Quick suggestions event listeners
    suggestionsClose?.addEventListener("click", (e) => {
      e.stopPropagation();
      hideQuickSuggestions();
    });

    suggestionsPrev?.addEventListener("click", (e) => {
      e.stopPropagation();
      scrollSuggestions("prev");
    });

    suggestionsNext?.addEventListener("click", (e) => {
      e.stopPropagation();
      scrollSuggestions("next");
    });

    // Initialize quick suggestions based on current state
    updateQuickSuggestions();

    // profile card
    new window.Lia_ProfileCard("lia-chat-sidebar");

    // customization
    new window.Lia_CustomizationModal();
  }

export async function toggleTemplateMode() {
    chatbotState.templateMode = !chatbotState.templateMode;
    const templateToggle = document.getElementById("lia-template-toggle");
    const modeTitle = document.getElementById("lia-mode-title");
    const sidebarHeader = document.getElementById("lia-sidebar-header");
    const newChatBtn = document.getElementById("lia-new-chat-btn");
    const messageInput = document.getElementById("lia-message-input");
    const modeIndicator = document.getElementById("lia-mode-indicator");
    const loadMoreBtn = document.getElementById("lia-load-more-btn");
    const notesToggle = document.getElementById("lia-notes-toggle");

    //const templateBadge = document.getElementById("lia-template-badge")

    try {
      modeIndicator.style.display = "flex";
    } catch {}

    if (chatbotState.templateMode) {
      // Turn off other modes
      // reset pagination
      numberOfConversationsToLoad = 10;
      numberOfNotesToLoad = 10;
      if (chatbotState.notesMode) {
        /*chatbotState.notesMode = false
        document.getElementById("lia-notes-toggle").classList.remove("notes-active")
        document.getElementById("lia-notes-badge").style.display = "none"*/
        chatbotState.notesMode = !chatbotState.notesMode;
        notesToggle.classList.remove("notes-active");
      }

      // Switch to Template Mode
      templateToggle.classList.add("template-active");
      templateToggle.title = "Template Mode: ON";
      //templateBadge.style.display = "block"

      window.typeWriter("LIA Templates", modeTitle);
      sidebarHeader.textContent = "Writing Styles";
      newChatBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New Post
      `;
      messageInput.placeholder = "What would you like to write about?";

      // Clear conversation list
      const conversationList = document.getElementById("lia-conversation-list");
      conversationList.innerHTML = "";

      // Load templates in sidebar
      await loadTemplates();
      hideQuickSuggestions();

      loadMoreBtn.style.display = "none";
    } else {
      numberOfConversationsToLoad = 10;
      numberOfNotesToLoad = 10;
      // Switch back to normal mode
      templateToggle.classList.remove("template-active");
      templateToggle.title = "Template Mode: OFF";
      //templateBadge.style.display = "none"

      if (!chatbotState.notesMode) {
        try {
          modeIndicator.style.display = "none";
        } catch {}
      }

      window.typeWriter("LIA", modeTitle);
      sidebarHeader.textContent = "Conversations";
      newChatBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New Chat
      `;
      messageInput.placeholder = "What do you want to post?";

      // Load regular conversations
      loadChatHistory();

      loadMoreBtn.style.display = "block";
    }

    await saveChatbotState();
  }

export async function loadTemplates() {
    const conversationList = document.getElementById("lia-conversation-list");
    if (!conversationList) return;

    // fetch templates from api-server
    await fetchTemplates();

    conversationList.innerHTML = Object.entries(TEMPLATES)
      .map(
        ([key, template]) => `
      <div class="lia-template-item ${chatbotState.selectedTemplate === key ? "active" : ""}" data-template="${key}">
        <div class="lia-template-icon">${template.icon}</div>
        <div class="lia-template-info">
          <div class="lia-template-name">${template.name}</div>
          <div class="lia-template-description">${template.description}</div>
        </div>
      </div>
    `,
      )
      .join("");

    // Add click listeners to template items
    conversationList.querySelectorAll(".lia-template-item").forEach((item) => {
      item.addEventListener("click", () => {
        const templateKey = item.dataset.template;
        selectTemplate(templateKey);
      });
    });

    if (chatbotState.selectedTemplate) {
      chatbotState.currentConversationId = null; // Clear current conversation
      selectTemplate(chatbotState.selectedTemplate);
    }
  }

export function selectTemplate(templateKey) {
    chatbotState.selectedTemplate = templateKey;
    chatbotState.currentConversationId = null; // Clear current conversation
    chatbotState.conversations = []; // Clear conversations list
    const template = TEMPLATES[templateKey];

    // Update active state in sidebar
    document.querySelectorAll(".lia-template-item").forEach((item) => {
      item.classList.remove("active");
    });
    document
      .querySelector(`[data-template="${templateKey}"]`)
      .classList.add("active");

    // Clear messages and show template info
    const messagesContainer = document.getElementById("lia-messages-container");
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
                <div class="lia-card-content">${template.example.content.replace(/\n/g, "<br>")}</div>
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
    `;

    // make backend api requests to create chat

    saveChatbotState();
  }

  const fetchTemplates = async () => {
    try {
      const response = await window.lia_fetchWithAuth(
        "https://api.getlia.live/api/chat/templates",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await accessToken()}`,
          },
          credentials: "include",
        },
      );
      const data = await response.json();
      console.log("Fetched templates:", data);
      if (response.ok) {
        // Update templates in state
        // filter out normal templates
        TEMPLATES = data.templates
          .filter((template) => template.key !== "normal")
          .reduce((acc, template) => {
            acc[template.key] = template;
            return acc;
          }, {});
      } else {
        console.error("Failed to fetch templates:", data.error);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  // Quick Suggestions Functions
export function updateQuickSuggestions() {
    const quickSuggestions = document.getElementById("lia-quick-suggestions");
    const suggestionsTrack = document.getElementById("lia-suggestions-track");

    if (!quickSuggestions || !suggestionsTrack) return;

    // Show suggestions only in chat mode when reference mode is active or when there's referenced content
    if (
      !chatbotState.notesMode &&
      (chatbotState.referenceMode || chatbotState.referencedContent)
    ) {
      const suggestions = generateContextualSuggestions();
      renderQuickSuggestions(suggestions);
      showQuickSuggestions();
    } else {
      hideQuickSuggestions();
    }
  }

export function generateContextualSuggestions() {
    const suggestions = [];

    // Base suggestions for reference mode
    if (chatbotState.referenceMode) {
      suggestions.push(
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M9 11H1l8-8 8 8"/>
            <path d="M9 11v10"/>
          </svg>`,
          text: "Summarize this content",
          action: "Summarize the key points from the referenced content",
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
          </svg>`,
          text: "What's your take on this?",
          action: "What's your professional opinion on this content?",
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>`,
          text: "Write a thoughtful comment",
          action: "Help me write a thoughtful comment on this post",
        },
      );
    }

    // Add suggestions based on referenced content type
    if (chatbotState.referencedContent) {
      const contentType = chatbotState.referencedContent.type;

      if (contentType === "post") {
        suggestions.push(
          {
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>`,
            text: "Create a similar post",
            action: "Help me create a similar post with my own perspective",
          },
          {
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>`,
            text: "Extract key insights",
            action: "What are the key business insights from this post?",
          },
        );
      } else if (contentType === "article") {
        suggestions.push(
          {
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>`,
            text: "Article summary",
            action: "Provide a concise summary of this article",
          },
          {
            icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>`,
            text: "Rate and review",
            action: "What's your professional assessment of this article?",
          },
        );
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
          action: "What are the technology implications of this content?",
        });
      }
    }

    return suggestions.slice(0, 6); // Limit to 6 suggestions
  }

export function renderQuickSuggestions(suggestions) {
    const suggestionsTrack = document.getElementById("lia-suggestions-track");
    if (!suggestionsTrack) return;

    suggestionsTrack.innerHTML = suggestions
      .map(
        (suggestion) => `
      <div class="lia-suggestion-card" data-action="${suggestion.action}" title='Click to use'>
        <div class="lia-suggestion-icon">
          ${suggestion.icon}
        </div>
        <div class="lia-suggestion-text">${suggestion.text}</div>
        <!--<div class="lia-suggestion-action">Click to use</div>-->
      </div>
    `,
      )
      .join("");

    // Add click listeners to suggestion cards
    suggestionsTrack
      .querySelectorAll(".lia-suggestion-card")
      .forEach((card) => {
        card.addEventListener("click", (e) => {
          e.stopPropagation();
          const action = card.dataset.action;
          sendMessage(action); // Send the action directly
          hideQuickSuggestions();
        });
      });

    // Update navigation buttons
    updateSuggestionsNavigation();
  }

export function showQuickSuggestions() {
    const quickSuggestions = document.getElementById("lia-quick-suggestions");
    if (quickSuggestions) {
      quickSuggestions.classList.remove("hidden");
    }
  }

export function hideQuickSuggestions() {
    const quickSuggestions = document.getElementById("lia-quick-suggestions");
    if (quickSuggestions) {
      quickSuggestions.classList.add("hidden");
    }
  }

export function scrollSuggestions(direction) {
    const suggestionsTrack = document.getElementById("lia-suggestions-track");
    if (!suggestionsTrack) return;

    const cardWidth = 212; // 200px + 12px gap
    const currentTransform = suggestionsTrack.style.transform;
    const currentTranslate = currentTransform
      ? Number.parseInt(currentTransform.match(/-?\d+/)?.[0] || 0)
      : 0;

    let newTranslate = currentTranslate;
    if (direction === "next") {
      newTranslate = currentTranslate - cardWidth;
    } else {
      newTranslate = currentTranslate + cardWidth;
    }

    // Constrain the translation
    const maxTranslate = 0;
    const minTranslate = -(suggestionsTrack.children.length - 2) * cardWidth;
    newTranslate = Math.max(minTranslate, Math.min(maxTranslate, newTranslate));

    suggestionsTrack.style.transform = `translateX(${newTranslate}px)`;
    updateSuggestionsNavigation();
  }

export function updateSuggestionsNavigation() {
    const suggestionsTrack = document.getElementById("lia-suggestions-track");
    const suggestionsPrev = document.getElementById("lia-suggestions-prev");
    const suggestionsNext = document.getElementById("lia-suggestions-next");

    if (!suggestionsTrack || !suggestionsPrev || !suggestionsNext) return;

    const currentTransform = suggestionsTrack.style.transform;
    const currentTranslate = currentTransform
      ? Number.parseInt(currentTransform.match(/-?\d+/)?.[0] || 0)
      : 0;
    const cardWidth = 212;
    const maxTranslate = 0;
    const minTranslate = -(suggestionsTrack.children.length - 2) * cardWidth;

    suggestionsPrev.disabled = currentTranslate >= maxTranslate;
    suggestionsNext.disabled = currentTranslate <= minTranslate;
  }

  // Notes Mode Functions
export async function toggleNotesMode() {
    chatbotState.notesMode = !chatbotState.notesMode;
    const notesToggle = document.getElementById("lia-notes-toggle");
    const modeTitle = document.getElementById("lia-mode-title");
    const sidebarHeader = document.getElementById("lia-sidebar-header");
    const newChatBtn = document.getElementById("lia-new-chat-btn");
    const messageInput = document.getElementById("lia-message-input");
    const inputActions = document.getElementById("lia-input-actions");
    const modeIndicator = document.getElementById("lia-notes-mode-indicator");
    const liaSendBtn = document.getElementById("lia-send-btn");
    const loadMoreBtn = document.getElementById("lia-load-more-btn");
    try {
      loadMoreBtn.style.display = "block";
    } catch {}
    try {
      modeIndicator.style.display = "flex";
    } catch {}

    const syncButton = document.createElement("button");
    syncButton.classList.add("sync-note-btn");
    syncButton.textContent = "Sync Notes";

    syncButton.addEventListener("click", async () => {
      showTemporaryNotification("Syncing notes...", "info");
      // Sync notes with server
      const body = { notes: await getNotesFromStorage() };
      const syncNotes = async () => {
        // save notes to server inorder to sync
        const response = await window.lia_fetchWithAuth(
          "https://api.getlia.live/api/note/notes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await accessToken()}`,
            },
            credentials: "include",
            body: JSON.stringify(body),
          },
        );

        if (!response.ok) {
          console.error("Error syncing notes:", response.statusText);
          throw new Error("Failed to sync notes");
        }

        const data = await response.json();
        if (data.success) {
          console.log("Notes synced successfully");
          showTemporaryNotification("Notes synced successfully", "success");
        }

        if (!data.success) {
          throw new Error("Failed to sync notes");
        }
        return data.success;
      };

      await syncNotes();
    });

    messageInput.value = "";

    if (chatbotState.templateMode) {
      //turn templatemode off
      chatbotState.templateMode = !chatbotState.templateMode;
      document
        .getElementById("lia-template-toggle")
        .classList.remove("template-active");
    }

    if (chatbotState.notesMode) {
      // fetch notes from server
      const fetchNotes = async (limit) => {
        const start = limit < 10 ? 0 : limit - 10;

        // fetch notes from server
        const response = await window.lia_fetchWithAuth(
          `https://api.getlia.live/api/note/notes?limit=${limit}&start=${start}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await accessToken()}`,
            },
            credentials: "include",
          },
        );

        if (!response.ok) {
          console.error("Error fetching notes:", response.statusText);
          throw new Error("Failed to fetch notes");
        }

        const notes = await response.json();
        if (notes) {
          console.log("Notes fetched successfully");

          // update notes in storage
          chatbotState.notes = notes;
          saveChatbotState();

          showTemporaryNotification("Notes fetched successfully", "success");
          return notes;
        }

        if (!notes) {
          console.log("Failed to fetch notes");
          throw new Error("Failed to fetch notes");
        }
      };

      // Clear conversation list
      const conversationList = document.getElementById("lia-conversation-list");
      conversationList.innerHTML = "";

      numberOfNotesToLoad = 10;

      let notes = await fetchNotes(numberOfNotesToLoad);
      numberOfNotesToLoad += 10; // increment

      // Hide quick suggestions
      hideQuickSuggestions();

      // reset number of conversations to load
      numberOfConversationsToLoad = 10;

      // Switch to Notes Mode
      notesToggle.classList.add("notes-active");
      notesToggle.title = "Notes Mode: ON";

      //modeTitle.textContent = "LIA Notes"

      // typeWriter effect for modeTitle
      window.typeWriter("LIA Notes", modeTitle);

      sidebarHeader.textContent = "Recent Notes";
      newChatBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="12" y1="11" x2="12" y2="17"/>
          <line x1="9" y1="14" x2="15" y2="14"/>
        </svg>
        New Note
      `;
      messageInput.placeholder = "Write your note here...";
      messageInput.setAttribute("rows", "3");
      inputActions.style.display = "flex";

      // Lia Send Button inner html should be change to the correct svg for note
      liaSendBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="12" y1="11" x2="12" y2="17"/>
          <line x1="9" y1="14" x2="15" y2="14"/>
        </svg>
      `;

      // Update context info
      updateNoteContext();

      // Load notes
      showNotesWelcome();
      notes = await loadNotes();

      // Add sync button to mode indicator
      try {
        const notesInfoContainer =
          modeIndicator.querySelector(".lia-notes-info");
        if (notesInfoContainer) {
          notesInfoContainer.appendChild(syncButton);
        }
      } catch {}

      showTemporaryNotification(
        "📝 Notes Mode ON - Capture and organize your thoughts",
        "success",
      );

      console.log("this is the notes", notes);
      // load note list
      conversationList.innerHTML = notes
        .map((note) => {
          const truncatedTitle =
            note.title.slice(0, 15) + (note.title.length > 15 ? "..." : "");
          const contextIcon = getContextIcon(note.context?.type);

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
        `;
        })
        .join("");

      setupNoteEventListeners();
    } else {
      // reset number of notes to load
      numberOfNotesToLoad = 10;
      numberOfConversationsToLoad = 10;

      // Switch back to Chat Mode
      notesToggle.classList.remove("notes-active");
      notesToggle.title = "Notes Mode: OFF";

      //modeTitle.textContent = "LIA"

      // Typewriter effect for mode title
      window.typeWriter("LIA", modeTitle);

      sidebarHeader.textContent = "Recent Chats";
      newChatBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg> New Chat`;
      messageInput.placeholder = "What do you want to post?";
      messageInput.setAttribute("rows", "1");
      inputActions.style.display = "none";
      try {
        modeIndicator.style.display = "none";
      } catch {}

      liaSendBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22,2 15,22 11,13 2,9"></polygon>
        </svg>`;

      // Load conversations
      showChatWelcome();

      await loadChatHistory();

      try {
        modeIndicator.querySelector(".sync-note-btn").remove();
      } catch {}

      showTemporaryNotification("💬 Chat Mode ON", "info");
    }

    // save chatbot state
    await saveChatbotState();
  }

export function updateNoteContext() {
    const contextInfo = document.getElementById("lia-context-info");
    let context = "";

    // Detect LinkedIn context
    if (window.location.href.includes("linkedin.com/in/")) {
      const match = window.location.pathname.match(/\/in\/([^/]+)/);
      const profileSegment = match ? match[1] : null;
      if (profileSegment) {
        context = `📋 Profile: ${profileSegment}`;
        chatbotState.noteContext = {
          type: "profile",
          identifier: profileSegment,
          url: window.location.href,
        };
      }
    } else if (window.location.href.includes("linkedin.com/feed")) {
      context = "📰 LinkedIn Feed";
      chatbotState.noteContext = {
        type: "feed",
        identifier: "feed",
        url: window.location.href,
      };
    } else if (window.location.href.includes("linkedin.com/pulse")) {
      context = "📖 LinkedIn Article";
      chatbotState.noteContext = {
        type: "article",
        identifier: "article",
        url: window.location.href,
      };
    } else {
      context = "🌐 General Note";
      chatbotState.noteContext = {
        type: "general",
        identifier: "general",
        url: window.location.href,
      };
    }

    contextInfo.textContent = context;
  }

export function showNotesWelcome() {
    const messagesContainer = document.getElementById("lia-messages-container");
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
    `;
  }

export function showChatWelcome() {
    const messagesContainer = document.getElementById("lia-messages-container");
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

export async function startNewNote() {
    // Clear current note display
    const messagesContainer = document.getElementById("lia-messages-container");
    document.querySelector(".lia-message-input").value = "";
    showNotesWelcome();

    // Create new note
    const newNote = {
      id: generateNoteId(),
      title: "New Note",
      content: "",
      tags: [],
      context: chatbotState.noteContext,
      timestamp: Date.now(),
      lastModified: Date.now(),
    };

    chatbotState.currentNoteId = newNote.id;

    // Save to storage
    await saveNoteToStorage(newNote);

    // Update notes list
    await updateConversationList();

    // Focus on input
    document.getElementById("lia-message-input").focus();
  }

export async function saveNote() {
    const messageInput = document.getElementById("lia-message-input");
    const content = messageInput.value.trim();

    if (!content) return;

    const noteId = chatbotState.currentNoteId || generateNoteId();

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
      timestamp: chatbotState.currentNoteId
        ? prevNote?.timestamp || Date.now()
        : Date.now(),
      lastModified: Date.now(),
    };

    chatbotState.currentNoteId = noteId;

    // Display note in chat-like format
    addNoteToDisplay(note);

    // Clear input
    messageInput.value = "";
    messageInput.style.height = "auto";

    // Save to storage
    await saveNoteToStorage(note);

    // Update notes list
    await updateConversationList();

    showTemporaryNotification("📝 Note saved!", "success");
  }

export function addNoteToDisplay(note) {
    const messagesContainer = document.getElementById("lia-messages-container");
    messagesContainer.style.opacity = "0.5"; // Fade out for smooth transition

    // Clear welcome message if it exists
    const welcomeMsg = messagesContainer.querySelector(
      ".lia-message.assistant",
    );
    if (
      welcomeMsg &&
      welcomeMsg.textContent.includes("Welcome to Notes Mode")
    ) {
      welcomeMsg.remove();
    }

    // Remove hashtags from each message object in note.content for display
    let displayContent = note.content;
    if (Array.isArray(displayContent)) {
      displayContent = displayContent.map((msgObj) => {
        if (msgObj.type === "text" && typeof msgObj.text === "string") {
          let text = msgObj.text;
          if (note.tags && note.tags.length > 0) {
            note.tags.forEach((tag) => {
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
        .map((msgObj) => {
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
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    if (note.content === "") {
      showNotesWelcome();
    }

    // Trigger animation
    setTimeout(() => {
      messagesContainer.style.opacity = "1";
    }, 50);
  }

export async function enhanceNote(type) {
    const messageInput = document.getElementById("lia-message-input");
    const content = messageInput.value.trim();

    if (!content) {
      showTemporaryNotification("Please write some content first", "warning");
      return;
    }

    // Show loading
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "lia-message assistant";
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
    `;

    const messagesContainer = document.getElementById("lia-messages-container");
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      let enhancedContent = "";

      switch (type) {
        case "structure":
          enhancedContent = await enhanceNoteContent(
            type,
            content,
            "Structure this note with clear headings, bullet points, and organized sections",
          );
          break;
        case "summarize":
          enhancedContent = await enhanceNoteContent(
            type,
            content,
            "Summarize this content into key points and main takeaways",
          );
          break;
        case "expand":
          enhancedContent = await enhanceNoteContent(
            type,
            content,
            "Expand this note with more details, examples, and comprehensive information",
          );
          break;
        case "tags":
          const tags = await enhanceNoteContent(
            type,
            content,
            "Generate relevant tags for this content. Return only the content plus the space separated tags (as hashtags - e.g. #tag1 #tag2) one line after the conte",
          );
          enhancedContent = tags;
          break;
      }

      // Remove loading
      loadingDiv.remove();

      // Update input with enhanced content
      messageInput.value = enhancedContent;
      messageInput.style.height = "auto";
      messageInput.style.height =
        Math.min(messageInput.scrollHeight, 120) + "px";

      showTemporaryNotification(
        `✨ Note ${type === "tags" ? "tagged" : type + "d"} successfully!`,
        "success",
      );
    } catch (error) {
      loadingDiv.remove();
      showTemporaryNotification(`Failed to ${type} note`, "error");
      console.error("Note enhancement error:", error);
    }
  }

export async function enhanceNoteContent(type, content, instruction) {
    const prompt = `${instruction}:\n\n"${content}"\n\nReturn only the enhanced content without explanations or appending the type/anything infront of it.`;

    const response = await fetch(
      "https://api.getlia.live/api/note/enhance-note",
      {
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
      },
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to enhance note");
    }

    return data.enhancedNote;
  }

  // Note Management Functions
export async function loadNotes() {
    try {
      const notes = await getNotesFromStorage();
      chatbotState.notes = notes;

      if (notes.length === 0) {
        startNewNote();
        return;
      }

      if (notes.length > 0) {
        chatbotState.currentNoteId = notes[0].id;
        await loadNote(chatbotState.currentNoteId);
      }
      return notes;
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  }

export async function loadNote(noteId) {
    const note = await getNoteFromStorage(noteId);
    if (!note) return;

    chatbotState.currentNoteId = noteId;

    const messagesContainer = document.getElementById("lia-messages-container");
    messagesContainer.innerHTML = "";

    addNoteToDisplay(note);

    // Update input with note content for editing
    const messageInput = document.getElementById("lia-message-input");

    // Restore hashtags for display in the input
    if (note.tags && note.tags.length > 0) {
      // Find the last text message in note.content
      if (Array.isArray(note.content)) {
        // Find last text message object
        const lastTextMsg = [...note.content]
          .reverse()
          .find((msg) => msg.type === "text");
        let text = lastTextMsg ? lastTextMsg.text : "";
        // Append hashtags if not already present
        const tagsLine = note.tags.map((tag) => `#${tag}`).join(" ");
        if (tagsLine && !text.includes(tagsLine)) {
          messageInput.value = (text + "\n" + tagsLine).trim();
        } else {
          messageInput.value = text;
        }
      } else {
        // fallback for legacy notes
        let text = typeof note.content === "string" ? note.content : "";
        const tagsLine = note.tags.map((tag) => `#${tag}`).join(" ");
        if (tagsLine && !text.includes(tagsLine)) {
          messageInput.value = (text + "\n" + tagsLine).trim();
        } else {
          messageInput.value = text;
        }
      }
    } else {
      // No tags, just restore last text message
      if (Array.isArray(note.content)) {
        const lastTextMsg = [...note.content]
          .reverse()
          .find((msg) => msg.type === "text");
        messageInput.value = lastTextMsg ? lastTextMsg.text : "";
      } else {
        messageInput.value =
          typeof note.content === "string" ? note.content : "";
      }
    }

    //messageInput.value = note.content
    messageInput.style.height = "auto";
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + "px";

    // add active state to the current note that was clicked
    // and remove active state from other notes
    const conversations = document.querySelectorAll(".lia-conversation-item");
    conversations.forEach((conversation) => {
      if (conversation.getAttribute("data-id") === conversationId) {
        conversation.classList.add("active");
      } else {
        conversation.classList.remove("active");
      }
    });
  }

  // Storage Functions
export async function saveNoteToStorage(note) {
    return new Promise((resolve) => {
      chrome.storage.local.get(["lia_notes"], (result) => {
        const notes = result.lia_notes || [];
        const existingIndex = notes.findIndex((n) => n.id === note.id);

        if (existingIndex >= 0) {
          notes[existingIndex] = note;
        } else {
          notes.unshift(note);
        }

        chrome.storage.local.set({ lia_notes: notes }, resolve);
      });
    });
  }

export async function saveNoteContentToStorage(note, content) {
    return new Promise((resolve) => {
      chrome.storage.local.get(["lia_notes"], (result) => {
        const notes = result.lia_notes || [];
        const existingIndex = notes.findIndex((n) => n.id === note.id);

        if (existingIndex >= 0) {
          notes[existingIndex].content.push(content);
        } else {
          notes.unshift(note);
        }

        chrome.storage.local.set({ lia_notes: notes }, resolve);
      });
    });
  }

export async function getNoteFromStorage(noteId) {
    return new Promise((resolve) => {
      chrome.storage.local.get(["lia_notes"], (result) => {
        const notes = result.lia_notes || [];
        resolve(notes.find((n) => n.id === noteId));
      });
    });
  }

export async function getNotesFromStorage() {
    return new Promise((resolve) => {
      chrome.storage.local.get(["lia_notes"], (result) => {
        resolve(result.lia_notes || []);
      });
    });
  }

export async function deleteNoteFromStorage(noteId) {
    return new Promise((resolve) => {
      chrome.storage.local.get(["lia_notes"], (result) => {
        const notes = result.lia_notes || [];
        const filteredNotes = notes.filter((n) => n.id !== noteId);
        chrome.storage.local.set({ lia_notes: filteredNotes }, resolve);
      });
    });
  }

export async function deleteNoteContentFromStorage(noteId, contentId) {
    return new Promise((resolve) => {
      chrome.storage.local.get(["lia_notes"], (result) => {
        const notes = result.lia_notes || [];
        const noteIndex = notes.findIndex((n) => n.id === noteId);
        if (noteIndex >= 0) {
          const note = notes[noteIndex];
          note.content = note.content.filter(
            (msg) => msg.contentId !== contentId,
          );

          // If no content left, delete the note
          if (note.content.length === 0) {
            notes.splice(noteIndex, 1);
          } else {
            notes[noteIndex] = note;
          }

          chrome.storage.local.set({ lia_notes: notes }, resolve);
        } else {
          resolve();
        }
      });
    });
  }

  // Utility Functions
export function generateNoteId() {
    return "note_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

export function generateContentId() {
    return (
      "content_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

export async function generateNoteTitle(content) {
    if (!content || content.trim().length === 0) {
      return "Untitled Note";
    }

    // fetch title from API
    const response = await fetch(
      "https://api.getlia.live/api/note/generate-title",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await accessToken()}`,
        },
        body: JSON.stringify({ content }),
      },
    );

    // falback
    function fallbackTitle() {
      const firstLine = content.split("\n")[0].trim();
      if (firstLine.length > 50) {
        return firstLine.substring(0, 47) + "...";
      }
      return firstLine || "Untitled Note";
    }

    if (!response.ok) {
      return fallbackTitle(); // fallback to normal note titling
    }

    const data = await response.json();

    if (!data.title) {
      return fallbackTitle();
    }

    return data.title || "Untitled Note";
  }

export function extractHashtags(content) {
    const hashtags = content.match(/#[\w]+/g);
    return hashtags ? hashtags.map((tag) => tag.substring(1)) : [];
  }

export function formatNoteContent(content) {
    // Basic markdown-like formatting
    let formatted = content;

    // Headers
    formatted = formatted.replace(
      /^# (.*$)/gm,
      '<h3 class="lia-note-h3">$1</h3>',
    );
    formatted = formatted.replace(
      /^## (.*$)/gm,
      '<h4 class="lia-note-h4">$1</h4>',
    );

    // Bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Italic
    formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Lists
    formatted = formatted.replace(
      /^- (.*$)/gm,
      '<li class="lia-note-li">$1</li>',
    );
    formatted = formatted.replace(
      /(<li class="lia-note-li">.*<\/li>)/s,
      '<ul class="lia-note-ul">$1</ul>',
    );

    // Line breaks
    formatted = formatted.replace(/\n/g, "<br>");

    return formatted;
  }

export function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return Math.floor(diff / 60000) + "m ago";
    if (diff < 86400000) return Math.floor(diff / 3600000) + "h ago";
    if (diff < 604800000) return Math.floor(diff / 86400000) + "d ago";

    return date.toLocaleDateString();
  }

  // Global functions for note actions
  window.editNote = async (noteId) => {
    await loadNote(noteId);
    document.getElementById("lia-message-input").focus();
    document.getElementById("lia-send-btn").disabled = false;
    showTemporaryNotification("📝 Note loaded for editing", "info");
  };

  window.duplicateNote = async (noteId) => {
    const originalNote = await getNoteFromStorage(noteId);
    if (!originalNote) return;

    const duplicatedNote = {
      ...originalNote,
      id: generateNoteId(),
      title: originalNote.title + " (Copy)",
      timestamp: Date.now(),
      lastModified: Date.now(),
    };

    await saveNoteToStorage(duplicatedNote);
    await updateConversationList();

    document.getElementById("lia-send-btn").disabled = true;
    document.getElementById("lia-message-input").value = "";

    showTemporaryNotification("📝 Note duplicated!", "success");
  };

  window.duplicateNoteContent = async (noteId, contentId) => {
    const note = await getNoteFromStorage(noteId);
    if (!note) return;

    const content = note.content.find((item) => item.contentId === contentId);
    if (!content) return;

    const duplicatedContent = {
      ...content,
      contentId: generateContentId(),
      timestamp: Date.now(),
      lastModified: Date.now(),
    };

    note.content.push(duplicatedContent);
    await saveNoteContentToStorage(note, duplicatedContent);
    await loadNote(noteId);

    showTemporaryNotification("📝 Note content duplicated!", "success");
  };

  window.deleteNote = async (noteId) => {
    await deleteNoteFromStorage(noteId);

    if (chatbotState.currentNoteId === noteId) {
      await startNewNote();
    }

    await updateConversationList();

    document.getElementById("lia-send-btn").disabled = true;
    document.getElementById("lia-message-input").value = "";

    showTemporaryNotification("🗑️ Note deleted", "info");
  };

  window.deleteNoteContent = async (noteId, contentId) => {
    await deleteNoteContentFromStorage(noteId, contentId);
    await loadNote(noteId);

    showTemporaryNotification("🗑️ Note content deleted", "info");
  };

export async function toggleChatbot() {
    if (chatbotState.isOpen) {
      closeChatbot();
    } else {
      openChatbot();
    }
    // save chatbot state
    await saveChatbotState();
  }

export async function openChatbot() {
    const chatbotInterface = document.getElementById("lia-chatbot-interface");
    chatbotInterface.classList.add("open");
    chatbotInterface.classList.remove("minimized");
    chatbotState.isOpen = true;
    chatbotState.isMinimized = false;
    liaUser = await window.getLiaUserInfo();

    await loadChatbotState();

    if (chatbotState.notesMode) {
      // If in Notes Mode, load notes
      await loadNotes();
    } else {
      // Load chat history
      await loadChatHistory();
    }

    // Focus on input
    setTimeout(() => {
      document.getElementById("lia-message-input").focus();
    }, 400);

    // Show notification dot briefly
    showNotificationDot();
  }

export function closeChatbot() {
    const chatbotInterface = document.getElementById("lia-chatbot-interface");
    chatbotInterface.classList.remove("open");
    chatbotInterface.classList.remove("minimized");
    chatbotState.isOpen = false;
    chatbotState.isMinimized = false;
    numberOfConversationsToLoad = 10;
    numberOfNotesToLoad = 10;

    // set the radius again
    chatbotInterface.classList.remove("right-radius-bottom-and-width");
  }

export function minimizeChatbot() {
    const chatbotInterface = document.getElementById("lia-chatbot-interface");

    // set the radius again
    chatbotInterface.classList.toggle("right-radius-bottom-and-width");

    // positioned bottom right
    // first check if chatbotInterface has left and top styles
    // then we can set minize values cause it distort in initial position
    if (
      chatbotInterface.style.left &&
      !chatbotInterface.classList.contains("minimized")
    ) {
      chatbotInterface.style.left = `84.5%`;
    }
    if (
      chatbotInterface.style.top &&
      !chatbotInterface.classList.contains("minimized")
    ) {
      chatbotInterface.style.top = `89.5%`;
    }

    chatbotInterface.classList.toggle("minimized");
    chatbotState.isMinimized = true;

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

export function showSidebar() {
    const sidebar = document.getElementById("lia-chat-sidebar");
    sidebar.classList.remove("collapsed");
  }

export async function loadMore() {
    const loadMoreBtn = document.getElementById("lia-load-more-btn");

    // Prevent double-click while loading
    if (loadMoreBtn.disabled) return;

    // Add loading state
    loadMoreBtn.disabled = true;
    const originalText = loadMoreBtn.innerHTML;
    loadMoreBtn.innerHTML = `
      <svg class="spinner" width="20" height="20" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
    `;

    // Add spinner CSS (you can place this in your stylesheet instead)
    if (!document.getElementById("spinner-style")) {
      const style = document.createElement("style");
      style.id = "spinner-style";
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
      `;
      document.head.appendChild(style);
    }

    try {
      if (chatbotState.notesMode) {
        // await loadMoreNotes()
      } else {
        numberOfConversationsToLoad += 10;
        await updateConversationList();
      }
    } finally {
      // Remove loading state
      loadMoreBtn.disabled = false;
      loadMoreBtn.innerHTML = originalText;
    }
  }

export async function loadMoreNotes() {
    //await fetch('https://')
  }

export function toggleSidebar() {
    const sidebar = document.getElementById("lia-chat-sidebar");
    sidebar.classList.toggle("collapsed");
    chatbotState.sidebarCollapsed = !chatbotState.sidebarCollapsed;
  }

export function showNotificationDot() {
    const notificationDot = document.querySelector(".lia-notification-dot");
    if (notificationDot) {
      notificationDot.classList.add("show");
      setTimeout(() => {
        notificationDot.classList.remove("show");
      }, 2000);
    }
  }

export async function sendMessage(_message) {
    const messageInput = document.getElementById("lia-message-input");
    let message = messageInput.value.trim();

    if (!message) {
      message = _message || "";
    }

    if (!message) return;

    // Clear input
    messageInput.value = "";
    messageInput.style.height = "auto";
    document.getElementById("lia-send-btn").disabled = true;

    // Add user message to chat
    addMessageToChat("user", message);

    // Show typing indicator
    showTypingIndicator();

    try {
      // Generate AI response
      let response;
      try {
        response = await generateChatResponse(message);

        if (
          response &&
          response.error &&
          response.error.includes("missing plan")
        ) {
          // Remove typing indicator
          hideTypingIndicator();
          addMessageToChat(
            "assistant",
            'Please upgrade your plan to use this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Upgrade Now</a>',
          );
          return;
        } else if (
          response &&
          response.error &&
          response.error.includes("Plan expired")
        ) {
          // Remove typing indicator
          hideTypingIndicator();
          showTemporaryNotification(
            "Your plan has expired. Please renew your subscription.",
            "error",
          );
          addMessageToChat(
            "assistant",
            'Your plan has expired. Please renew your subscription to continue using this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Renew Now</a>',
          );
          return;
        }
        // Handle other errors
        throw new Error(
          response.error || "Failed to generate response from AI",
        );
      } catch (error) {
        console.error("Error generating chat response:", error);
      }

      // hide quick suggestions
      hideQuickSuggestions();

      // Remove typing indicator
      hideTypingIndicator();

      // Add AI response to chat
      addMessageToChat("assistant", response);
    } catch (error) {
      hideTypingIndicator();
      addMessageToChat(
        "assistant",
        "Sorry, I encountered an error. Please try again. 😔\n Try Signin in again if the error continues - <a href='https://getlia.live/login' target='_blank' style='color: blue'>here</a>",
      );
      console.error("Chat error:", error);
    }
  }

export function addMessageToChat(role, content) {
    const messagesContainer = document.getElementById("lia-messages-container");

    const messageDiv = document.createElement("div");
    messageDiv.className = `lia-message ${role}`;

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

      const contentDiv = messageDiv.querySelector(".lia-message-content");

      if (
        content.includes("Unable to load conversations") ||
        content.includes("Unable to create new chat")
      ) {
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
            contentDiv.innerHTML =
              formattedText +
              (i < plainContent.length
                ? '<span class="lia-cursor">|</span>'
                : "");
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

export function showTypingIndicator() {
    const messagesContainer = document.getElementById("lia-messages-container");

    const typingDiv = document.createElement("div");
    typingDiv.className = "lia-message assistant";
    typingDiv.id = "lia-typing-indicator";

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
  `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

export function hideTypingIndicator() {
    const typingIndicator = document.getElementById("lia-typing-indicator");
    if (typingIndicator) {
      typingIndicator.remove();
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

export async function generateChatResponse(message) {
    let template_id = null;
    // Add template context if in templateMode
    if (
      chatbotState.templateMode &&
      chatbotState.selectedTemplate &&
      TEMPLATES[chatbotState.selectedTemplate]
    ) {
      template_id = TEMPLATES[chatbotState.selectedTemplate].id;
    }
    console.log("Using template_id:", template_id);
    console.log("templates...", TEMPLATES);

    // check if this is the first message the user sending in chat
    if (!chatbotState.currentConversationId) {
      await startNewConversation((template = true));
    }

    const body = {
      message: message,
      tone: settings.tone,
      industry: settings.industry,
      reference: chatbotState.referencedContent || null,
    };

    if (template_id) {
      body.template_id = template_id;
    }

    const response = await window.lia_fetchWithAuth(
      `https://api.getlia.live/api/chat/${chatbotState.currentConversationId}/message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await accessToken()}`,
        },
        credentials: "include",
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      //throw new Error(data.error?.message || "Failed to generate response")
      return data;
    }

    if (chatbotState.templatesMode) {
      // exit template mode after first message
      // and becomes a normal chat but still has the template context
      chatbotState.templateMode = false;
      chatbotState.selectedTemplate = null;
      await saveChatbotState();
      // update UI
      document.getElementById("lia-template-badge").style.display = "none";
      document.getElementById("lia-template-toggle").classList.remove("active");
      document.getElementById("lia-sidebar-header").textContent =
        "CONVERSATIONS";
      document.getElementById("lia-new-chat-btn").innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New Chat
      `;
    }

    return data.reply;
  }

export async function startNewConversation(template = false) {
    // Clear current chat
    const messagesContainer = document.getElementById("lia-messages-container");

    if (!template) {
      // for normal chats
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
      const response = await window.lia_fetchWithAuth(
        `https://api.getlia.live/api/chat/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await accessToken()}`,
          },
          body: JSON.stringify({
            title: "New Chat",
            chat_type: template ? "template" : "normal",
            ...(template && {
              template_id: TEMPLATES[chatbotState.selectedTemplate].id || null,
            }),
          }),
          credentials: "include",
        },
      );
      const chat = await response.json();
      if (!response.ok) {
        throw new Error(
          chat.error || chat.message || "Failed to create new chat",
        );
      }
      chatbotState.currentConversationId = chat.id;
      return chat;
    }

    await createNewChat();

    // Update conversation list
    await updateConversationList();

    // Focus on input
    document.getElementById("lia-message-input").focus();

    // clear referenced content
    chatbotState.referencedContent = null;
  }

export async function loadChatHistory() {
    // load conversations from API server
    const conversations = await updateConversationList();
    numberOfConversationsToLoad += 10;

    chatbotState.conversations = conversations;
    if (chatbotState.conversations.length === 0) {
      //addMessageToChat("assistant", "No conversations found. Start a new chat to begin!")
      await startNewConversation();
      return;
    }

    if (conversations.length > 0) {
      chatbotState.currentConversationId = conversations[0].id;

      loadConversation(chatbotState.currentConversationId);
    }
  }

export async function updateConversationList() {
    const conversationList = document.getElementById("lia-conversation-list");

    if (chatbotState.notesMode) {
      // Load and display notes instead of conversations
      const notes = await getNotesFromStorage();

      if (numberOfNotesToLoad > notes.length || numberOfNotesToLoad > 10) {
        // we're pagination append to conversationList
        conversationList.innerHTML += notes
          .map((note) => {
            const truncatedTitle =
              note.title.slice(0, 15) + (note.title.length > 15 ? "..." : "");
            const contextIcon = getContextIcon(note.context?.type);

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
            `;
          })
          .join("");
      } else {
        // not pagination initial fetch
        conversationList.innerHTML = notes
          .map((note) => {
            const truncatedTitle =
              note.title.slice(0, 15) + (note.title.length > 15 ? "..." : "");
            const contextIcon = getContextIcon(note.context?.type);

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
            `;
          })
          .join("");
      }

      // Add note-specific event listeners
      setupNoteEventListeners();
      return notes;
    } else {
      // Original chat functionality
      let conversations = [];
      // load conversations from API server
      conversations = await loadConversations(numberOfConversationsToLoad);

      if (
        numberOfConversationsToLoad > conversationList.length ||
        numberOfConversationsToLoad > 10
      ) {
        // then we are paginating so just append to lia-conversation-list
        conversationList.innerHTML += conversations
          .map((conv) => {
            const truncatedTitle =
              conv.title.slice(0, 10) + (conv.title.length > 15 ? "..." : "");
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
                      ${
                        /*<button class="lia-duplicate-chat-btn" data-id="${conv.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                        <span style="margin-right: 8px;">📋</span>Duplicate
                      </button>
                      <button class="lia-export-chat-btn" data-id="${conv.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                        <span style="margin-right: 8px;">💾</span>Export
                      </button>*/ ""
                      }
                      <div style="height: 1px; background: #e0e0e0; margin: 4px 0;"></div>
                      <button class="lia-delete-chat-btn" data-id="${conv.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #dc3545; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                        <span style="margin-right: 8px;">🗑️</span>Delete Chat
                      </button>
                    </div>
                  </div>
                `;
          })
          .join("");
      } else {
        conversationList.innerHTML = conversations
          .map((conv) => {
            const truncatedTitle =
              conv.title.slice(0, 10) + (conv.title.length > 15 ? "..." : "");
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
                        ${
                          /*<button class="lia-duplicate-chat-btn" data-id="${conv.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                          <span style="margin-right: 8px;">📋</span>Duplicate
                        </button>
                        <button class="lia-export-chat-btn" data-id="${conv.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #333; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                          <span style="margin-right: 8px;">💾</span>Export
                        </button>*/ ""
                        }
                        <div style="height: 1px; background: #e0e0e0; margin: 4px 0;"></div>
                        <button class="lia-delete-chat-btn" data-id="${conv.id}" style="padding: 10px 16px; width: 100%; border: none; background: white; color: #dc3545; cursor: pointer; text-align: left; font-size: 10px; display: flex; align-items: center; transition: background-color 0.2s;">
                          <span style="margin-right: 8px;">🗑️</span>Delete Chat
                        </button>
                      </div>
                    </div>
                  `;
          })
          .join("");
      }

      // Add hover effects for menu items
      const style = document.createElement("style");
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

export function setupNoteEventListeners() {
    // Add click to load note
    document.querySelectorAll(".lia-conversation-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        if (e.target.classList.contains("lia-menu-trigger")) return;
        loadNote(item.dataset.id);
      });
    });

    // Menu toggles and actions
    document.querySelectorAll(".lia-menu-trigger").forEach((menuBtn) => {
      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const menu = menuBtn
          .closest(".lia-conversation-item-wrapper")
          .querySelector(".lia-menu");
        document.querySelectorAll(".lia-menu").forEach((m) => {
          if (m !== menu) m.style.display = "none";
        });
        menu.style.display = menu.style.display === "block" ? "none" : "block";
      });
    });

    // Note actions
    document.querySelectorAll(".lia-edit-note-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        window.editNote(btn.dataset.id);
        document
          .querySelectorAll(".lia-menu")
          .forEach((m) => (m.style.display = "none"));
      });
    });

    document.querySelectorAll(".lia-duplicate-note-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();

        const noteId = btn.dataset.id;
        const parentNode = btn.closest(".lia-message");

        const parentNoteId = parentNode ? parentNode.dataset.noteId : null;

        if (parentNoteId === noteId || !parentNoteId) {
          // then duplicate the note by calling window.duplicateNote
          window.duplicateNote(noteId);
          document
            .querySelectorAll(".lia-menu")
            .forEach((m) => (m.style.display = "none"));
        } else {
          window.duplicateNoteContent(parentNoteId, noteId);
        }
      });
    });

    document.querySelectorAll(".lia-delete-note-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();

        const noteId = btn.dataset.id;
        const parentNode = btn.closest(".lia-message");

        const parentNoteId = parentNode ? parentNode.dataset.noteId : null;

        if (parentNoteId === noteId || !parentNoteId) {
          // then delete the note by calling window.deleteNote
          window.deleteNote(noteId);
          document
            .querySelectorAll(".lia-menu")
            .forEach((m) => (m.style.display = "none"));
        } else {
          window.deleteNoteContent(parentNoteId, noteId);
        }
      });
    });
  }

export function setupChatEventListeners() {
    // Original chat event listeners
    document.querySelectorAll(".lia-conversation-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        if (e.target.classList.contains("lia-menu-trigger")) return;
        loadConversation(item.dataset.id);
      });
    });

    // Add menu toggle
    document.querySelectorAll(".lia-menu-trigger").forEach((menuBtn) => {
      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const menu = menuBtn
          .closest(".lia-conversation-item-wrapper")
          .querySelector(".lia-menu");
        // Close other menus
        document.querySelectorAll(".lia-menu").forEach((m) => {
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
        const conv = conversations.find((c) => c.id === id);
        if (conv) {
          const truncatedTitleSpan = btn
            .closest(".lia-conversation-item-wrapper")
            .querySelector(".truncatedTitle");
          if (truncatedTitleSpan) {
            truncatedTitleSpan.contentEditable = "true";
            truncatedTitleSpan.focus();

            // Move cursor to end
            document.execCommand("selectAll", false, null);
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
        document
          .querySelectorAll(".lia-menu")
          .forEach((m) => (m.style.display = "none"));
      });
    });

    // Add duplicate chat action
    document.querySelectorAll(".lia-duplicate-chat-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        duplicateConversation(id); // Implement this function
        // Close menu
        document
          .querySelectorAll(".lia-menu")
          .forEach((m) => (m.style.display = "none"));
      });
    });

    // Add export chat action
    document.querySelectorAll(".lia-export-chat-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        exportConversation(id); // Implement this function
        // Close menu
        document
          .querySelectorAll(".lia-menu")
          .forEach((m) => (m.style.display = "none"));
      });
    });

    // Add delete chat action
    document.querySelectorAll(".lia-delete-chat-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        deleteConversation(id);

        // Close menu
        document
          .querySelectorAll(".lia-menu")
          .forEach((m) => (m.style.display = "none"));
      });
    });

    // Close menu when clicking elsewhere
    document.addEventListener("click", (e) => {
      if (
        !e.target.closest(".lia-menu") &&
        !e.target.classList.contains("lia-menu-trigger")
      ) {
        document
          .querySelectorAll(".lia-menu")
          .forEach((m) => (m.style.display = "none"));
      }
    });
  }

export function getContextIcon(contextType) {
    switch (contextType) {
      case "profile":
        return "👤";
      case "feed":
        return "📰";
      case "article":
        return "📖";
      case "general":
        return "📝";
      default:
        return "📝";
    }
  }

  // chat actions
export function deleteConversation(id) {
    // Remove from API server
    async function deleteChat() {
      const response = await fetch(`https://api.getlia.live/api/chat/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await accessToken()}`,
        },
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.error?.message || "Failed to delete conversation",
        );
      }
      return result;
    }

    deleteChat()
      .then(() => {
        const chatbotStateConvId = chatbotState.currentConversationId;
        // updateConversationList()
        if (chatbotStateConvId == id) {
          // Remove from local state
          chatbotState.currentConversationId = null;
          startNewConversation(); // Start a new conversation if current is deleted
        } else {
          updateConversationList(); // Just update the list if another conversation is deleted
        }
      })
      .catch((error) => {
        console.error("Error deleting conversation:", error);
        addMessageToChat(
          "assistant",
          "Unable to delete conversation. Please check your connection or try signing in again <a href='https://www.getlia.live/login' target='_blank'> here </a>",
        );
      });
  }

export function renameConversation(id, newTitle) {
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
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.error?.message || "Failed to rename conversation",
        );
      }
      return result;
    }

    renameChat()
      .then(() => {
        updateConversationList(); // Refresh the conversation list
      })
      .catch((error) => {
        console.error("Error renaming conversation:", error);
        addMessageToChat(
          "assistant",
          "Unable to rename conversation. Please check your connection or try signing in again <a href='https://www.getlia.live/login' target='_blank'> here </a>",
        );
      });
  }

export async function loadConversation(conversationId) {
    // load chat conversations
    let conversation = null;

    // load conversation form API server
    async function loadChats() {
      const response = await window.lia_fetchWithAuth(
        `https://api.getlia.live/api/chat/${conversationId}/messages`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await accessToken()}`,
          },
          credentials: "include",
        },
      );
      const chats = await response.json();
      if (!response.ok) {
        throw new Error(chats.error?.message || "Failed to load conversation");
      }
      return chats;
    }

    const result = await loadChats();
    let chats;
    let template;
    try {
      chats = result.messages;
      template = result.template;
    } catch {
      // pass --> return no errors
    }
    conversation = chats;

    if (!conversation) return;

    chatbotState.currentConversationId = conversationId;

    const messagesContainer = document.getElementById("lia-messages-container");
    messagesContainer.innerHTML = conversation
      .map((msg) => {
        // if template and if this is the first message
        // insert assistant message as template
        if (
          template &&
          msg.role === "assistant" &&
          conversation.indexOf(msg) === 0
        ) {
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
                        <div class="lia-card-content">${template.example.content.replace(/\n/g, "<br>")}</div>
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
              `;
        }

        if (msg.role === "reference") {
          const refContent = JSON.parse(msg.content);
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
                `;
        } else {
          return `
                <div class="lia-message ${msg.role}">
                  <div class="lia-message-avatar">${
                    msg.role === "user"
                      ? getUserAvatar()
                      : `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/>
                      <circle cx="4" cy="4" r="2"/>
                      <circle cx="16" cy="4" r="2" fill="#0a66c2"/>
                      <path d="M12 8a4 4 0 0 1 4-4" stroke="#0a66c2"/>
                    </svg>
                  `
                  }</div>
                  <div class="lia-message-content" ${msg.role === "user" ? `style='color: #fff;'` : ""}>
                    ${formatMessage(msg.content)}
                  </div>
                </div>
              `;
        }
      })
      .join("");

    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // add active state to the current conversation that was clicked
    // and remove active state from other conversations
    const conversations = document.querySelectorAll(".lia-conversation-item");
    conversations.forEach((conversation) => {
      if (conversation.getAttribute("data-id") === conversationId) {
        conversation.classList.add("active");
      } else {
        conversation.classList.remove("active");
      }
    });
  }

  // ===== RERERENCE MODE SYSTEM =====
export async function toggleReferenceMode() {
    // Check if user has pro access
    // only check if reference mode is already off
    if (chatbotState.referenceMode === false) {
      const proAccess = await checkProAccess();
      if (!proAccess && proAccess !== "Request failed: Unauthorized") {
        showProUpgradeModal();
        return;
      }
      if (proAccess === "Request failed: Unauthorized") {
        showTemporaryNotification(
          "Please sign in to access Reference Mode",
          "error",
        );
        return;
      }
    }

    chatbotState.referenceMode = !chatbotState.referenceMode;
    const toggleBtn = document.getElementById("lia-reference-toggle");
    if (chatbotState.referenceMode) {
      toggleBtn.classList.add("reference-active");
      toggleBtn.title = "Reference Mode: ON (Click posts to reference)";

      // show different title when notes mode is enabled
      if (chatbotState.notesMode) {
        toggleBtn.title =
          "Reference Mode (pro): ON (Click any post to save to current note)";
      }
      initializeReferenceMode();
      showTemporaryNotification(
        "📎 Reference Mode ON - Click any post to reference it",
        "success",
      );

      // show different notification when notes mode is enabled
      if (chatbotState.notesMode) {
        showTemporaryNotification(
          "📎 Reference Mode ON - Click any post to save to current note",
          "success",
        );
      }
    } else {
      toggleBtn.classList.remove("reference-active");
      toggleBtn.title = "Reference Mode (Pro): OFF";
      disableReferenceMode();
      showTemporaryNotification("Reference Mode OFF", "info");
    }

    // save chatbot state
    await saveChatbotState();
  }

export async function checkProAccess() {
    // For now, return true for demo. In production, check user's subscription status
    //return true
    // Production implementation:
    // const { access_token } = await chrome.storage.local.get(['access_token'])
    // if (!access_token) return false
    //
    let response = await window.lia_fetchWithAuth(
      "https://api.getlia.live/api/user/subscription",
      {
        headers: { Authorization: `Bearer ${await accessToken()}` },
        credentials: "include",
      },
    );
    let data = await response.json();

    // return plan
    return data.isPro;
  }

export function showProUpgradeModal() {
    const modal = document.createElement("div");
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
  `;
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
  `;
    document.body.appendChild(modal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    // open pricing page when upgrad button is clicked
    document
      .querySelector(".reference-modal-upgrade-button")
      .addEventListener("click", () => {
        window.open("https://getlia.live/pricing", "_blank");
        modal.remove();
      });

    // close modal on cancel
    document
      .querySelector(".reference-modal-cancel-button")
      .addEventListener("click", () => {
        modal.remove();
      });
  }

export function initializeReferenceMode() {
    // Add hover listeners to LinkedIn posts
    addReferenceListeners();
    // Add reference mode indicator
    showReferenceIndicator();
  }

export function disableReferenceMode() {
    // Remove all reference overlays and listeners
    document
      .querySelectorAll(".lia-reference-overlay")
      .forEach((el) => el.remove());
    document.querySelectorAll(".linkedin-post-hoverable").forEach((el) => {
      el.classList.remove("linkedin-post-hoverable");
    });
    hideReferenceIndicator();
  }

export function addReferenceListeners() {
    // LinkedIn post selectors
    const postSelectors = [
      ".feed-shared-update-v2",
      ".feed-shared-update-detail-viewer__content",
      ".reader-article-content",
      ".comments-comment-item",
    ];
    postSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((post) => {
        if (post.classList.contains("linkedin-post-hoverable")) return;
        post.classList.add("linkedin-post-hoverable");
        // Create overlay
        const overlay = document.createElement("div");
        overlay.className = "lia-reference-overlay";
        post.style.position = "relative";
        post.appendChild(overlay);
        // Add click listener
        post.addEventListener("click", async (e) => {
          if (chatbotState.referenceMode) {
            e.preventDefault();
            e.stopPropagation();
            await capturePostReference(post);

            // save reference note content to current note in storage
            // if we are in notes mode
            if (chatbotState.notesMode) {
              const currentNote = await getNoteFromStorage(
                chatbotState.currentNoteId,
              );
              if (currentNote) {
                // if current note is not null, then we can save the reference content
                // add the reference content to current note
                currentNote.content.push({
                  contentId: generateContentId(),
                  type: "reference",
                  content: chatbotState.referencedContent,
                });
                // update last modified
                currentNote.lastModified = Date.now();

                saveNoteToStorage(currentNote);
              } else {
                const newNote = {
                  id: generateNoteId(),
                  title: "Referenced Content",
                  content: [
                    {
                      contentId: generateContentId(),
                      type: "reference",
                      content: chatbotState.referencedContent,
                    },
                  ],
                  tags: [],
                  context: chatbotState.noteContext,
                  timestamp: Date.now(),
                  lastModified: Date.now(),
                };
                await saveNoteToStorage(newNote);
                chatbotState.currentNoteId = newNote.id;
                await updateConversationList();
              }

              saveChatbotState();
            }
          }
        });
      });
    });

    // Add click listener to clear reference
    const clearReferenceBtns = document.querySelectorAll(
      ".lia-clear-reference",
    );
    if (clearReferenceBtns) {
      clearReferenceBtns.forEach((clearReferenceBtn) => {
        clearReferenceBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          clearReferencedContent(clearReferenceBtn);
        });
      });
    }
  }

export async function capturePostReference(postElement) {
    const content = extractPostContent(postElement);
    if (content) {
      chatbotState.referencedContent = content;

      // show quick suggestions
      updateQuickSuggestions();

      // show the referenced content in chat
      showReferencedContent();

      // Save the reference content to chatbot state
      await saveChatbotState();

      // show notification
      if (chatbotState.notesMode) {
        showTemporaryNotification(
          "✔ Content Referenced! And saved to your current notes.",
          "success",
        );
      } else {
        showTemporaryNotification(
          "✔ Content Referenced! Ask me about it.",
          "success",
        );
      }
      // Auto-focus chat input
      const chatInput = document.getElementById("lia-message-input");
      if (chatInput) {
        chatInput.focus();
        if (chatbotState.notesMode) {
          chatInput.placeholder =
            "Write short note on the referenced content...";
        } else {
          chatInput.placeholder = "Ask me about the referenced content...";
        }
      }
    }
  }

export function extractPostContent(element) {
    try {
      const content = {
        type: "unknown",
        author: "",
        text: "",
        engagement: {},
        timestamp: "",
        url: window.location.href,
      };
      // Detect content type and extract accordingly
      if (
        element.classList.contains("feed-shared-update-v2") ||
        element.classList.contains("feed-shared-update-detail-viewer__content")
      ) {
        // Regular LinkedIn post
        content.type = "post";
        // Extract author
        const authorElement = element.querySelector(
          ".update-components-actor__title span span span:not(.visually-hidden)",
        );
        if (authorElement) {
          content.author = authorElement.textContent.trim();
        }
        // Extract post text
        const textElement = element.querySelector(
          ".feed-shared-update-v2__description",
        );
        if (textElement) {
          content.text = textElement.textContent.trim();
        }
        // Extract engagement
        const likeElement = element.querySelector(
          ".social-details-social-counts__reactions",
        );
        if (likeElement) {
          content.engagement.likes = likeElement.textContent.trim();
        }
        const commentElement = element.querySelector(
          ".social-details-social-counts__comments",
        );
        if (commentElement) {
          content.engagement.comments = commentElement.textContent.trim();
        }
        // Extract url/link to post
        if (window.location.href.includes("feed")) {
          const postUrn = element?.getAttribute("data-urn");
          const linkToPost = postUrn
            ? `https://www.linkedin.com/feed/update/${postUrn}/`
            : window.location.href;
          content.url = linkToPost;
        }
      } else if (element.classList.contains("reader-article-content")) {
        // LinkedIn article
        content.type = "article";
        const titleElement = document.querySelector(
          ".reader-article-header__title",
        );
        if (titleElement) {
          content.title = titleElement.textContent.trim();
        }
        const authorElement = document.querySelector(
          ".reader-author-info__content",
        );
        if (authorElement) {
          content.author = authorElement.textContent.trim();
        }
        content.text = element.textContent.trim().substring(0, 1000) + "...";
      } else if (element.classList.contains("comments-comment-item")) {
        // Comment
        content.type = "comment";
        const authorElement = element.querySelector(
          ".comments-comment-meta__description-title",
        );
        if (authorElement) {
          content.author = authorElement.textContent.trim();
        }
        const textElement = element.querySelector(
          ".comments-comment-item__main-content",
        );
        if (textElement) {
          content.text = textElement.textContent.trim();
        }
      }

      return content;
    } catch (error) {
      console.error("Error extracting post content:", error);
      return null;
    }
  }

export function showReferencedContent() {
    const messagesContainer = document.getElementById("lia-messages-container");
    if (!messagesContainer || !chatbotState.referencedContent) return;
    // Remove existing reference display
    const existingRefs = messagesContainer.querySelectorAll(
      ".lia-referenced-content",
    );
    if (existingRefs.length > 0) {
      const lastRef = existingRefs[existingRefs.length - 1];
      lastRef.remove();
    }

    const refDiv = document.createElement("div");
    refDiv.title = "Click to open";
    refDiv.className = "lia-referenced-content";
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
    </a>`;
    messagesContainer.appendChild(refDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

export async function clearReferencedContent(clearReferenceBtn) {
    chatbotState.referencedContent = null;
    // save chatbot state to remove referencedContent from it
    await saveChatbotState();
    const refDiv = clearReferenceBtn.closest(".lia-referenced-content");
    if (refDiv) refDiv.remove();
    const chatInput = document.getElementById("lia-message-input");
    if (chatInput) {
      if (chatbotState.notesMode) {
        chatInput.placeholder = "Write your note here...";
      } else {
        chatInput.placeholder = "What do you want to post?";
      }
    }

    // hide quick suggestions
    setTimeout(() => {
      hideQuickSuggestions();
    }, 1000);
  }

export function showReferenceIndicator() {
    const indicator = document.createElement("div");
    indicator.id = "lia-reference-indicator";
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
  `;
    indicator.textContent =
      "📎 Reference Mode Active - Click any post to analyze it";
    if (chatbotState.notesMode) {
      indicator.textContent =
        "📎 Reference Mode Active - Click any post to add it to your current note.";
    }
    document.body.appendChild(indicator);
  }

export function hideReferenceIndicator() {
    const indicator = document.getElementById("lia-reference-indicator");
    if (indicator) indicator.remove();
  }

export function showTemporaryNotification(message, type = "info") {
    const notification = document.createElement("div");
    const chatbotInterface = document.querySelector(".lia-chatbot-interface");
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
  `;

    // Color schemes
    const colors = {
      success: {
        avatar: "#10b981",
        bubble: "#f0fdf4",
        text: "#166534",
        border: "#bbf7d0",
      },
      error: {
        avatar: "#ef4444",
        bubble: "#fef2f2",
        text: "#991b1b",
        border: "#fecaca",
      },
      info: {
        avatar: "#0a66c2",
        bubble: "#eff6ff",
        text: "#1e40af",
        border: "#bfdbfe",
      },
      warning: {
        avatar: "#f59e0b",
        bubble: "#fffbeb",
        text: "#92400e",
        border: "#fed7aa",
      },
    };

    const colorScheme = colors[type] || colors.info;

    // Avatar with pulsing effect
    const avatarContainer = document.createElement("div");
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
    `;

    // Add pulsing ring
    const pulseRing = document.createElement("div");
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
    `;

    const pulseStyle = document.createElement("style");
    pulseStyle.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.7; }
        100% { transform: scale(1.2); opacity: 0; }
      }
    `;
    document.head.appendChild(pulseStyle);

    avatarContainer.appendChild(pulseRing);
    avatarContainer.innerHTML += `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
        <circle cx="16" cy="4" r="2" fill="white"/>
        <path d="M12 8a4 4 0 0 1 4-4" stroke="white"/>
      </svg>
    `;

    // Modern speech bubble
    const speechBubble = document.createElement("div");
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
    `;

    // Curved tail for modern look
    const bubbleTail = document.createElement("div");
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
    `;

    const messageText = document.createElement("span");
    speechBubble.appendChild(bubbleTail);
    speechBubble.appendChild(messageText);

    notification.appendChild(avatarContainer);
    notification.appendChild(speechBubble);

    chatbotInterface.appendChild(notification);

    // Animation sequence
    setTimeout(() => {
      avatarContainer.style.opacity = "1";
      avatarContainer.style.transform = "scale(1)";
    }, 100);

    setTimeout(() => {
      speechBubble.style.opacity = "1";
      speechBubble.style.transform = "scale(1) translateY(0)";
    }, 400);

    setTimeout(() => {
      let i = 0;
      const typeMessage = () => {
        if (i <= message.length) {
          messageText.textContent =
            message.substring(0, i) + (i < message.length ? "▋" : "");
          i++;
          setTimeout(typeMessage, 40);
        }
      };
      typeMessage();
    }, 600);

    // Cleanup
    setTimeout(() => {
      notification.style.transform = "translateX(-50%) scale(0.8)";
      notification.style.opacity = "0";
      setTimeout(() => {
        notification.remove();
        pulseStyle.remove();
      }, 2000);
    }, 5000);
  }

  // Make function globally available
  window.clearReferencedContent = clearReferencedContent;

  // Make the chatbot interface draggable
export function makeChatbotDraggable() {
    const chatbotInterface = document.getElementById("lia-chatbot-interface");
    let offsetX, offsetY;

    chatbotInterface.addEventListener("mousedown", (e) => {
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
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);

      e.preventDefault();
    });
  }

  // chatbot helper functions
export async function loadConversations(limit) {
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
      },
    );

    const chats = await response.json();

    if (!response.ok) {
      throw new Error(chats.error?.message || "Failed to load conversations");
    }

    return chats;
  }

  // helper function for farmating chat conversations
export function formatMessage(message) {
    let formattedMessage = formatLinks(message);
    formattedMessage = formatMarkdown(formattedMessage);

    return formattedMessage;
  }

  // Enhanced helpers
  // format links
export function formatLinks(text) {
    // Handle markdown-style links [text](url)
    text = text.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      (match, linkText, url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="lia-link">${linkText} <span class="lia-link-icon">🔗</span></a>`;
      },
    );
    // Avoid touching existing anchor tags by splitting on them
    return text.replace(
      /(<a [^>]+>.*?<\/a>)|(\bhttps?:\/\/[^\s<]+)/g,
      (match, anchor, url) => {
        if (anchor) return anchor; // return existing anchor tags untouched
        if (url) {
          return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="lia-link">${url} <span class="lia-link-icon">🔗</span></a>`;
        }
        return match;
      },
    );
  }

export function formatMarkdown(text) {
    // Headers
    text = text.replace(/^### (.*$)/gm, '<h3 class="lia-h3">$1</h3>');
    text = text.replace(/^## (.*$)/gm, '<h2 class="lia-h2">$1</h2>');
    text = text.replace(/^# (.*$)/gm, '<h1 class="lia-h1">$1</h1>');

    // Bold text **text**
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Italic text *text*
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Code blocks ```code```
    text = text.replace(/```([\s\S]*?)```/g, function (match, code) {
      // Escape HTML in code
      // Remove HTML tags and their content (e.g., <a>...</a>)
      // This will remove tags and their inner text
      return `<pre class="lia-code-block" style='position: relative'><code>${code}</code></pre>`;
    });

    // Inline code `code`
    text = text.replace(
      /`([^`]+)`/g,
      '<code class="lia-inline-code">$1</code>',
    );

    // Unordered lists
    text = text.replace(/^\* (.*$)/gm, '<li class="lia-list-item">$1</li>');
    text = text.replace(
      /(<li class="lia-list-item">.*<\/li>)/s,
      '<ul class="lia-list">$1</ul>',
    );

    // Ordered lists
    text = text.replace(
      /^\d+\. (.*$)/gm,
      '<li class="lia-ordered-item">$1</li>',
    );
    text = text.replace(
      /(<li class="lia-ordered-item">.*<\/li>)/s,
      '<ol class="lia-ordered-list">$1</ol>',
    );

    // Line breaks (double newlines become paragraphs)
    text = text.replace(/\n\n/g, '</p><p class="lia-paragraph">');
    text = '<p class="lia-paragraph">' + text + "</p>";

    // Single line breaks
    text = text.replace(/\n/g, "<br>");

    return text;
  }

export function createCopyButton(content) {
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
        console.error("Failed to copy text: ", err);
      }
    });

    return copyBtn;
  }

export function createRegenerateButton() {
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

