// @ts-nocheck
import { toggleChatbot, setupChatbotEventListeners } from "./chatbotCore";
import { chatbotState } from "./chatbotState";
import { addChatbotStyles } from "./chatbotStyles";

export function createChatbotButton() {
  // Remove existing button if it exists
  const existingButton = document.getElementById("lia-chatbot-button");
  if (existingButton) existingButton.remove();

  const chatbotButton = document.createElement("div");
  chatbotButton.id = "lia-chatbot-button";
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
  `;

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
  `;

  // Add hover effects
  chatbotButton.addEventListener("mouseenter", () => {
    chatbotButton.style.transform = "scale(1.1) rotate(5deg)";
    chatbotButton.style.boxShadow = "0 6px 25px rgba(10, 102, 194, 0.4)";
  });

  chatbotButton.addEventListener("mouseleave", () => {
    chatbotButton.style.transform = "scale(1) rotate(0deg)";
    chatbotButton.style.boxShadow = "0 4px 20px rgba(10, 102, 194, 0.3)";
  });

  chatbotButton.addEventListener("click", toggleChatbot);

  document.body.appendChild(chatbotButton);

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
