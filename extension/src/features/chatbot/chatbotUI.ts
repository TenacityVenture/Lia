// @ts-nocheck
import { toggleChatbot, setupChatbotEventListeners } from "./chatbotCore";
import { chatbotState } from "./chatbotState";
import { addChatbotStyles } from "./chatbotStyles";

export function createChatbotButton() {
  // Remove existing button if it exists
  const existingContainer = document.getElementById("lia-fab-container");
  if (existingContainer) existingContainer.remove();

  // also check if old button exists to clean it up
  const oldButton = document.getElementById("lia-chatbot-button");
  if (oldButton && oldButton.parentElement?.id !== "lia-fab-container") oldButton.remove();

  const fabContainer = document.createElement("div");
  fabContainer.id = "lia-fab-container";
  fabContainer.className = "lia-fab-container";

  fabContainer.innerHTML = `
    <button id="lia-fab-close" class="lia-fab-small lia-fab-close" title="Close floating icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
      </svg>
    </button>
    <button id="lia-fab-settings" class="lia-fab-small lia-fab-settings" title="LIA Settings">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.21232 14.0601C1.91928 12.6755 1.93115 11.2743 2.21316 9.94038C3.32308 10.0711 4.29187 9.7035 4.60865 8.93871C4.92544 8.17392 4.50032 7.22896 3.62307 6.53655C4.3669 5.3939 5.34931 4.39471 6.53554 3.62289C7.228 4.50059 8.17324 4.92601 8.93822 4.60914C9.7032 4.29227 10.0708 3.32308 9.93979 2.21281C11.3243 1.91977 12.7255 1.93164 14.0595 2.21364C13.9288 3.32356 14.2964 4.29235 15.0612 4.60914C15.8259 4.92593 16.7709 4.5008 17.4633 3.62356C18.606 4.36739 19.6052 5.3498 20.377 6.53602C19.4993 7.22849 19.0739 8.17373 19.3907 8.93871C19.7076 9.70369 20.6768 10.0713 21.7871 9.94028C22.0801 11.3248 22.0682 12.726 21.7862 14.06C20.6763 13.9293 19.7075 14.2969 19.3907 15.0616C19.0739 15.8264 19.4991 16.7714 20.3763 17.4638C19.6325 18.6064 18.6501 19.6056 17.4638 20.3775C16.7714 19.4998 15.8261 19.0743 15.0612 19.3912C14.2962 19.7081 13.9286 20.6773 14.0596 21.7875C12.675 22.0806 11.2738 22.0687 9.93989 21.7867C10.0706 20.6768 9.70301 19.708 8.93822 19.3912C8.17343 19.0744 7.22848 19.4995 6.53606 20.3768C5.39341 19.633 4.39422 18.6506 3.62241 17.4643C4.5001 16.7719 4.92552 15.8266 4.60865 15.0616C4.29179 14.2967 3.32259 13.9291 2.21232 14.0601ZM3.99975 12.2104C5.09956 12.5148 6.00718 13.2117 6.45641 14.2963C6.90564 15.3808 6.75667 16.5154 6.19421 17.5083C6.29077 17.61 6.38998 17.7092 6.49173 17.8056C7.4846 17.2432 8.61912 17.0943 9.70359 17.5435C10.7881 17.9927 11.485 18.9002 11.7894 19.9999C11.9295 20.0037 12.0697 20.0038 12.2099 20.0001C12.5143 18.9003 13.2112 17.9927 14.2958 17.5435C15.3803 17.0942 16.5149 17.2432 17.5078 17.8057C17.6096 17.7091 17.7087 17.6099 17.8051 17.5081C17.2427 16.5153 17.0938 15.3807 17.543 14.2963C17.9922 13.2118 18.8997 12.5149 19.9994 12.2105C20.0032 12.0704 20.0033 11.9301 19.9996 11.7899C18.8998 11.4856 17.9922 10.7886 17.543 9.70407C17.0937 8.61953 17.2427 7.48494 17.8052 6.49204C17.7086 6.39031 17.6094 6.2912 17.5076 6.19479C16.5148 6.75717 15.3803 6.9061 14.2958 6.4569C13.2113 6.0077 12.5144 5.10016 12.21 4.00044C12.0699 3.99666 11.9297 3.99659 11.7894 4.00024C11.4851 5.10005 10.7881 6.00767 9.70359 6.4569C8.61904 6.90613 7.48446 6.75715 6.49155 6.1947C6.38982 6.29126 6.29071 6.39047 6.19431 6.49222C6.75668 7.48509 6.90561 8.61961 6.45641 9.70407C6.00721 10.7885 5.09967 11.4855 3.99995 11.7899C3.99617 11.93 3.9961 12.0702 3.99975 12.2104ZM11.9997 15.0002C10.3428 15.0002 8.99969 13.657 8.99969 12.0002C8.99969 10.3433 10.3428 9.00018 11.9997 9.00018C13.6565 9.00018 14.9997 10.3433 14.9997 12.0002C14.9997 13.657 13.6565 15.0002 11.9997 15.0002ZM11.9997 13.0002C12.552 13.0002 12.9997 12.5525 12.9997 12.0002C12.9997 11.4479 12.552 11.0002 11.9997 11.0002C11.4474 11.0002 10.9997 11.4479 10.9997 12.0002C10.9997 12.5525 11.4474 13.0002 11.9997 13.0002Z"></path>
      </svg>
    </button>
    <div id="lia-chatbot-button" class="lia-fab-main">
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
      <span class="lia-fab-text" id="lia-fab-text">Click to begin chat</span>
    </div>
  `;

  document.body.appendChild(fabContainer);

  const mainFab = document.getElementById("lia-chatbot-button");
  const settingsFab = document.getElementById("lia-fab-settings");
  const closeFab = document.getElementById("lia-fab-close");

  // mainFab?.addEventListener("click", toggleChatbot);
  mainFab?.addEventListener("click", (e) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({ action: "toggleSidePanel" });
  });

  // Check initial state
  chrome.storage.local.get(["isSidePanelOpen"], (res) => {
    const textEl = document.getElementById("lia-fab-text");
    if (textEl) {
      textEl.textContent = res.isSidePanelOpen ? "Click to close chat" : "Click to begin chat";
    }
  });

  // Listen for state changes
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local" && changes.isSidePanelOpen) {
      const textEl = document.getElementById("lia-fab-text");
      if (textEl) {
        textEl.textContent = changes.isSidePanelOpen.newValue ? "Click to close chat" : "Click to begin chat";
      }
    }
  });

  closeFab?.addEventListener("click", (e) => {
    e.stopPropagation();
    fabContainer.style.display = "none";
    chrome.storage.sync.set({ chatbot_enabled: false });
  });

  settingsFab?.addEventListener("click", (e) => {
    e.stopPropagation();
    const modal = document.getElementById("customization-modal");
    if (modal) {
      modal.classList.remove("hidden");
    }
  });

  // Add CSS animations
  addChatbotStyles();
}

export function createChatbotInterface() {
  // Remove existing interface if it exists
  const existingInterface = document.getElementById("lia-chatbot-interface");
  if (existingInterface) existingInterface.remove();

  const chatbotInterface = document.createElement("div");
  chatbotInterface.id = "lia-chatbot-interface";
  chatbotInterface.className = `lia-chatbot-interface ${chatbotState.isOpen ? "open" : ""}`;

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
        <button class="lia-control-btn ${chatbotState.templateMode ? "template-active" : ""}" id="lia-template-toggle" title="Template Mode: OFF">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="9" x2="15" y2="9"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
        </button>
        <button class="lia-control-btn ${chatbotState.notesMode ? "notes-active" : ""}" id="lia-notes-toggle" title="Notes Mode: OFF">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        </button>
        <button class="lia-control-btn ${chatbotState.referenceMode ? "reference-active" : ""}" id="lia-reference-toggle" title="Reference Mode (Pro): OFF">
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
            <!--<div class="menu-item" data-action="settings">
              <span class="menu-icon">⚙️</span>
              <span>Settings</span>
            </div>-->
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
            <img src="${(window as any).liaUser?.profile_picture_url}" alt="Profile" class="profile-avatar" id="profile-avatar">
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

  `;

  document.body.appendChild(chatbotInterface);

  // Setup event listeners
  setupChatbotEventListeners();
}
