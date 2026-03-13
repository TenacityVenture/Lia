// @ts-nocheck
import { chatbotState } from "./chatbotState";
export function addChatbotStyles() {
  if (document.getElementById("lia-chatbot-styles")) return;

  const styles = document.createElement("style");
  styles.id = "lia-chatbot-styles";
  styles.textContent = `
    .lia-logo-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lia-logo {
      animation: liaFloat 4s ease-in-out infinite;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
      transform-origin: center;
    }

    .lia-pulse-ring {
      position: absolute;
      width: 80px;
      height: 80px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      animation: liaPulse 3s ease-out infinite;
    }

    .lia-pulse-ring-2 {
      position: absolute;
      width: 80px;
      height: 80px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      animation: liaPulse 3s ease-out infinite 1.5s;
    }

    .lia-notification-dot {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 12px;
      height: 12px;
      background: #ff4757;
      border-radius: 50%;
      border: 2px solid white;
      animation: liaNotificationPulse 2s ease-in-out infinite;
      opacity: 0;
    }

    .lia-notification-dot.show {
      opacity: 1;
    }

    /* Note Display Styles */
    .lia-message.note {
      background: linear-gradient(135deg, #f8f9fa, #ffffff);
      border: 1px solid #e9ecef;
      border-radius: 12px;
      margin: 12px 0;
      padding: 4px;
    }
    
    .lia-message.note .lia-message-content {
      background: transparent;
      border: none;
      box-shadow: none;
    }
    
    .lia-note-content {
      position: relative;
    }
    
    .lia-note-header {
      display: flex;
      justify-content: space-between;
      width: 100%;
      gap: 12px;
      align-items: center;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e9ecef;
      position: relative;
    }
    
    .lia-note-title {
      font-weight: 600;
      color: #0a66c2;
      font-size: 14px;
    }
    
    .lia-note-timestamp {
      font-size: 11px;
      color: #6c757d;
      white-space: nowrap;
      position: absolute;
      bottom: .5px;
      right: 2px;
    }
    
    .lia-note-body {
      line-height: 1.6;
      margin-bottom: 12px;
      color: #495057;
    }
    
    .lia-note-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;
    }
    
    .lia-tag {
      background: #e7f3ff;
      color: #0a66c2;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
    }
    
    .lia-note-actions {
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.2s;
    }
    
    .lia-message.note:hover .lia-note-actions {
      opacity: 1;
    }
    
    .lia-note-action-btn {
      padding: 6px;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid #dee2e6;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .lia-note-action-btn:hover {
      background: #0a66c2;
      color: white;
      transform: scale(1.1);
    }
    
    .lia-note-action-btn.lia-delete-btn:hover {
      background: #dc3545;
    }

    .lia-input-actions {
      display: flex;
      gap: 8px;
      justify-content: center;
      align-items: center;
      padding: 8px 0;
      flex-direction: column;
      padding-right: 15px;
      border-right: 2px solid #eee;
    }

    .lia-context-info {
      color: #495057;
      margintTop: 5px;
    }
    
    /* Note formatting styles */
    .lia-note-h3 {
      font-size: 16px;
      font-weight: 600;
      color: #0a66c2;
      margin: 12px 0 8px 0;
    }
    
    .lia-note-h4 {
      font-size: 14px;
      font-weight: 600;
      color: #495057;
      margin: 10px 0 6px 0;
    }
    
    .lia-note-ul {
      margin: 8px 0;
      padding-left: 20px;
    }
    
    .lia-note-li {
      margin: 4px 0;
      color: #495057;
    }
    
    /* Loading spinner for notes */
    .lia-loading-spinner {
      border: 2px solid #f3f3f3;
      border-top: 2px solid #0a66c2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Added persona selector styles */
    .lia-reply-assistant {
      display: flex;
      gap: 8px;
      align-items: center;
      z-index: 1000;
    }

    .lia-persona-selector {
      position: relative;
    }

    .lia-persona-btn {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: var(--accent);
      border-radius: 16px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
      color: white;
    }

    .lia-persona-btn:hover, .linkedin-ai-button:hover {
      background: var(--accent-invert);
      color: var(--accent-foreground);
    }

    .lia-persona-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      min-width: 280px;
      background: var(--popover);
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      z-index: 1001;
      margin-top: 4px;
      overflow: hidden;
    }

    .lia-persona-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: all 0.2s;
      border-bottom: 1px solid var(--border);
    }

    .lia-persona-option:last-child {
      border-bottom: none;
    }

    .lia-persona-option:hover {
      background: var(--accent);
      color: var(--accent-foreground);
    }

    .lia-persona-option.active {
      background: var(--primary);
      color: var(--primary-foreground);
    }

    .lia-persona-info {
      flex: 1;
      color: var(--persona-option-color);
    }

    .lia-persona-name {
      font-weight: 600;
      font-size: 12px;
    }

    .lia-persona-desc {
      font-size: 11px;
      opacity: 0.8;
      margin-top: 2px;
    }

    .lia-persona-icon {
      font-size: 12px;
    }

    .lia-reply-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: var(--primary);
      color: var(--primary-foreground);
      border: none;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .lia-reply-btn:hover {
      background: var(--secondary);
      color: var(--secondary-foreground);
    }

    /* Added template styles */
    .lia-template-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      margin-bottom: 6px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;
      color: #495057;
    }

    .lia-template-item:hover {
      background: var(--accent);
      color: var(--accent-foreground);
      transform: translateX(4px);
      border-color: var(--primary);
    }

    .lia-template-item.active {
      background: var(--primary);
      color: var(--primary-foreground);
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(22, 78, 99, 0.3);
    }

    .lia-template-icon {
      font-size: 18px;
      flex-shrink: 0;
    }

    .lia-template-info {
      flex: 1;
      min-width: 0;
    }

    .lia-template-name {
      font-weight: 600;
      font-size: 12px;
      margin-bottom: 2px;
    }

    .lia-template-description {
      font-size: 10px;
      opacity: 0.8;
      line-height: 1.3;
    }

    .lia-template-example {
      margin: 16px 0;
    }

    .lia-linkedin-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      max-width: 500px;
    }

    .lia-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .lia-card-avatar {
      width: 48px;
      height: 48px;
      background: var(--primary);
      color: var(--primary-foreground);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 18px;
    }

    .lia-card-info {
      flex: 1;
    }

    .lia-card-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--card-foreground);
    }

    .lia-card-title {
      font-size: 12px;
      color: var(--muted-foreground);
      margin: 2px 0;
    }

    .lia-card-time {
      font-size: 11px;
      color: var(--muted-foreground);
    }

    .lia-card-content {
      font-size: 14px;
      line-height: 1.5;
      color: var(--card-foreground);
      margin-bottom: 12px;
      white-space: pre-line;
    }

    .lia-card-engagement {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: var(--muted-foreground);
      padding-top: 8px;
      border-top: 1px solid var(--border);
    }

    /*.lia-mode-badge {
      background: var(--accent);
      color: var(--accent-foreground);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 600;
    }*/

    /* Quick suggestions slider styles */
    .lia-quick-suggestions {
      position: relative;
      background: linear-gradient(135deg, #f8f9fa, #ffffff);
      border: 1px solid #e9ecef;
      border-radius: 12px;
      padding: 12px;
      margin-bottom: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .lia-quick-suggestions.hidden {
      opacity: 0;
      transform: translateY(-10px);
      max-height: 0;
      padding: 0;
      margin: 0;
    }

    .lia-suggestions-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .lia-suggestions-title {
      font-size: 13px;
      font-weight: 600;
      color: #0a66c2;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .lia-suggestions-close {
      background: none;
      border: none;
      color: #6c757d;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .lia-suggestions-close:hover {
      background: #e9ecef;
      color: #495057;
    }

    .lia-suggestions-slider {
      position: relative;
    }

    .lia-suggestions-track {
      display: flex;
      gap: 12px;
      transition: transform 0.3s ease;
      padding: 4px 0;
    }

    .lia-suggestion-card {
      display: flex;
      gap: 15px;
      min-width: 200px;
      max-width: 250px;
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .lia-suggestion-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(10, 102, 194, 0.1), transparent);
      transition: left 0.5s;
    }

    .lia-suggestion-card:hover::before {
      left: 100%;
    }

    .lia-suggestion-card:hover {
      border-color: #0a66c2;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(10, 102, 194, 0.15);
    }

    .lia-suggestion-icon {
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #0a66c2, #004182);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    }

    .lia-suggestion-text {
      font-size: 12px;
      color: #495057;
      line-height: 1.4;
      margin-bottom: 8px;
    }

    .lia-suggestion-action {
      font-size: 11px;
      color: #0a66c2;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .lia-suggestions-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #dee2e6;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      backdrop-filter: blur(10px);
      z-index: 10;
    }

    .lia-suggestions-nav:hover {
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-50%) scale(1.1);
    }

    .lia-suggestions-nav.prev {
      left: -7px;
    }

    .lia-suggestions-nav.next {
      right: -7px;
    }

    .lia-suggestions-nav:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: translateY(-50%) scale(1);
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .lia-input-actions {
        flex-wrap: wrap;
      }
      
      .lia-action-btn {
        flex: 1;
        min-width: 0;
        justify-content: center;
      }
    }

    @keyframes liaFloat {
      0%, 100% { 
        transform: translateY(0px) rotate(0deg) scale(1); 
      }
      25% { 
        transform: translateY(-4px) rotate(2deg) scale(1.05); 
      }
      50% { 
        transform: translateY(-8px) rotate(0deg) scale(1.1); 
      }
      75% { 
        transform: translateY(-4px) rotate(-2deg) scale(1.05); 
      }
    }

    @keyframes liaPulse {
      0% {
        transform: scale(0.8);
        opacity: 1;
      }
      100% {
        transform: scale(1.4);
        opacity: 0;
      }
    }

    @keyframes liaNotificationPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    @keyframes messageSlideIn {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    @keyframes avatarPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .lia-chatbot-interface {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 420px;
      height: 500px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
      z-index: 100000;
      display: flex;
      flex-direction: column;
      transform: scale(0) translateY(20px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(0, 0, 0, 0.08);
      backdrop-filter: blur(20px);

      /*border-bottom-right-radius: 0;*/
    }

    .lia-chatbot-interface.right-radius-bottom-and-width {
      border-bottom-right-radius: 20px;
      bottom: 20px;
      width: calc(420px/2)
    }

    .lia-chatbot-interface.open {
      transform: scale(1) translateY(0);
      opacity: 1;
    }

    .lia-chatbot-interface.minimized {
      height: 60px;
      overflow: hidden;
      width: ${chatbotState.notesMode ? "305" : chatbotState.templateMode ? "320" : "290"}px;
    }

    .lia-chatbot-header {
      background: linear-gradient(135deg, #0a66c2, #004182);
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 20px 20px 0 0;
      position: relative;
      overflow: hidden;
    }

    .lia-chatbot-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
      transform: translateX(-100%);
      animation: headerShine 3s ease-in-out infinite;
    }

    .lia-chatbot-header:hover {
      cursor: grab;
    }

    @keyframes headerShine {
      0% { transform: translateX(-100%); }
      50% { transform: translateX(100%); }
      100% { transform: translateX(100%); }
    }

    .lia-chatbot-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 600;
      font-size: 16px;
      z-index: 1;
      cursor: pointer;
    }

    .lia-chatbot-title svg {
      /* animation: titleLogoSpin 6s linear infinite; */
    }

    @keyframes titleLogoSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .lia-chatbot-controls {
      display: flex;
      gap: 8px;
      z-index: 1;
    }

    .lia-control-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      backdrop-filter: blur(10px);
    }

    .lia-control-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: scale(1.1);
    }

    .lia-control-btn:active {
      transform: scale(0.95);
    }

    .lia-chatbot-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .lia-chat-sidebar {
      width: 140px;
      background: linear-gradient(180deg, #f8f9fa, #e9ecef);
      border-right: 1px solid #dee2e6;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
      position: relative;
      border-bottom-left-radius: 20px;
    }

    .lia-chat-sidebar.collapsed {
      width: 0;
      border-right: none;
      overflow: hidden;
    }

    .lia-sidebar-toggle {
      position: absolute;
      right: -12px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 40px;
      background: #0a66c2;
      border: none;
      border-radius: 0 8px 8px 0;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: all 0.3s ease;
      box-shadow: 2px 0 8px rgba(0,0,0,0.1);
    }

    .lia-sidebar-toggle:hover {
      background: #004182;
      transform: translateY(-50%) scale(1.1);
    }

    .lia-sidebar-toggle svg {
      transition: transform 0.3s ease;
    }

    .lia-chat-sidebar.collapsed .lia-sidebar-toggle svg {
      transform: rotate(180deg);
    }

    .lia-sidebar-header {
      padding: 16px 12px 12px;
      border-bottom: 1px solid #dee2e6;
      font-size: 11px;
      font-weight: 700;
      color: #6c757d;
      text-transform: uppercase;
      letter-spacing: 1px;
      background: linear-gradient(135deg, #ffffff, #f8f9fa);
    }

    .lia-conversation-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      scrollbar-width: thin;
      scrollbar-color: #dee2e6 transparent;
    }

    .lia-load-more-btn {
      padding: 8px 12px;
      border-radius: 8px;
      color: #0a66c2;
      font-weight: 600;
      cursor: pointer;
    }

    .lia-conversation-list::-webkit-scrollbar {
      width: 4px;
    }

    .lia-conversation-list::-webkit-scrollbar-track {
      background: transparent;
    }

    .lia-conversation-list::-webkit-scrollbar-thumb {
      background: #dee2e6;
      border-radius: 2px;
    }

    .lia-conversation-item {
      padding: 10px 12px;
      margin-bottom: 6px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 12px;
      color: #495057;
      transition: all 0.2s;
      border: 1px solid transparent;
      position: relative;
      overflow: hidden;
    }

    .lia-conversation-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(10, 102, 194, 0.1), transparent);
      transition: left 0.5s;
    }

    .lia-conversation-item:hover::before {
      left: 100%;
    }

    .lia-conversation-item:hover {
      background: #e9ecef;
      transform: translateX(4px);
      border-color: #0a66c2;
    }

    .lia-conversation-item.active {
      background: linear-gradient(135deg, #0a66c2, #004182);
      color: white;
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(10, 102, 194, 0.3);
    }

    .lia-new-chat-btn {
      margin: 8px;
      padding: 12px;
      background: linear-gradient(135deg, #0a66c2, #004182);
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }

    .lia-new-chat-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    .lia-new-chat-btn:hover::before {
      left: 100%;
    }

    .lia-new-chat-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(10, 102, 194, 0.4);
    }

    .lia-chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .lia-messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      scrollbar-width: thin;
      scrollbar-color: #dee2e6 transparent;
    }

    .lia-messages-container::-webkit-scrollbar {
      width: 6px;
    }

    .lia-messages-container::-webkit-scrollbar-track {
      background: transparent;
    }

    .lia-messages-container::-webkit-scrollbar-thumb {
      background: #dee2e6;
      border-radius: 3px;
    }

    .lia-message {
      display: flex;
      gap: 12px;
      animation: messageSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0;
      animation-fill-mode: forwards;
    }

    .lia-message.user {
      flex-direction: row-reverse;
    }

    .lia-message-avatar {
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }

    .lia-message.user .lia-message-avatar {
      color: #0a66c2;
    }

    .lia-message.assistant .lia-message-avatar {
      color: #0a66c2;
      animation: avatarPulse 2s ease-in-out infinite;
    }

    .lia-message.user .lia-chat-user-avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }

    @keyframes avatarPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .lia-message-content {
      max-width: 75%;
      padding: 14px 18px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.5;
      position: relative;
      word-wrap: break-word;
    }

    .lia-message.user .lia-message-content .lia-paragraph {
      color: #fff !important;
    }

    .lia-message.assistant .lia-message-content .lia-paragraph {
      color: #333 !important;
    }

    .lia-message.user .lia-message-content {
      background: linear-gradient(135deg, #0a66c2, #004182);
      color: white !important;
      border-bottom-right-radius: 6px;
      box-shadow: 0 4px 12px rgba(10, 102, 194, 0.2);
    }

    .lia-message.assistant .lia-message-content {
      background: linear-gradient(135deg, #f8f9fa, #ffffff);
      color: #333 !important;
      border-bottom-left-radius: 6px;
      border: 1px solid #e9ecef;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    }

    .lia-input-container {
      padding: 20px;
      border-top: 1px solid #e9ecef;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      background: linear-gradient(180deg, #ffffff, #f8f9fa);
    }

    .lia-input-wrapper {
      display: flex;
      gap: 12px;
      align-items: flex-end;
      background: white;
      border-radius: 25px;
      padding: 8px;
      border: 2px solid #e9ecef;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .lia-input-wrapper:focus-within {
      border-color: #0a66c2;
      box-shadow: 0 4px 20px rgba(10, 102, 194, 0.15);
    }

    .lia-message-input {
      flex: 1;
      border: none !important;
      border-radius: 20px;
      padding: 12px 16px;
      font-size: 14px;
      resize: none;
      max-height: 120px;
      min-height: 20px;
      outline: none !important;
      background: transparent;
      font-family: inherit;
      color: #333333;
      
      scrollbar-width: thin;
      scrollbar-color: #0a66c2 #e9ecef;

      &::placeholder {
        color: #888888;
      }
      
      &::-webkit-scrollbar {
        width: 2px;
        height: 2px;
      }
    }

    .lia-message-input:active {
      background: none !important;
      border: none !important;
      outline: none !important;
    }

    .lia-message-input:focus {
      border: none;
      background: none;
      outline: none;
    }

    .lia-send-btn {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #0a66c2, #004182);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }

    .lia-send-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.5s;
    }

    .lia-send-btn:hover::before {
      left: 100%;
    }

    .lia-send-btn:hover {
      transform: scale(1.1) rotate(15deg);
      box-shadow: 0 6px 20px rgba(10, 102, 194, 0.4);
    }

    .lia-send-btn:active {
      transform: scale(0.95) rotate(15deg);
    }

    .lia-send-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }

    .lia-send-btn:disabled::before {
      display: none;
    }

    .lia-typing-indicator {
      display: flex;
      gap: 6px;
      padding: 14px 18px;
    }

    .lia-typing-dot {
      width: 8px;
      height: 8px;
      background: #0a66c2;
      border-radius: 50%;
      animation: typingBounce 1.4s ease-in-out infinite both;
    }

    .lia-typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .lia-typing-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes messageSlideIn {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes typingBounce {
      0%, 80%, 100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .lia-chatbot-interface {
        width: calc(100vw - 40px);
        height: 70vh;
        right: 20px;
        left: 20px;
        bottom: 100px;
      }
      
      .lia-chat-sidebar {
        width: 0;
        border-right: none;
        overflow: hidden;
      }

      .lia-chat-sidebar.collapsed {
        width: 0;
      }

      .lia-sidebar-toggle {
        display: none;
      }
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    .lia-control-btn.reference-active,
    .lia-control-btn.notes-active,
    .lia-control-btn.template-active {
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
    }

    .lia-reference-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(10, 102, 194, 0.1), rgba(16, 185, 129, 0.1));
      border: 2px solid #0a66c2;
      border-radius: 8px;
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transition: all 0.3s ease;
      backdrop-filter: blur(1px);
      pointer-events: all;
    }

    .lia-reference-overlay.show {
      opacity: 1;
    }

    .lia-reference-overlay::before {
      content: '📎 Click to Reference';
      position: absolute;
      top: 8px;
      left: 8px;
      background: #0a66c2;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .linkedin-post-hoverable {
      position: relative;
      cursor: pointer;
    }

    .linkedin-post-hoverable:hover .lia-reference-overlay {
      opacity: 1;
    }

    .lia-referenced-content {
      background: linear-gradient(135deg, #e7f3ff, #f0f9ff);
      border: 1px solid #0a66c2;
      border-radius: 8px;
      padding: 12px;
      margin: 8px 0;
      font-size: 12px;
    }

    .lia-referenced-content-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-weight: 600;
      color: #0a66c2;
    }

    .lia-referenced-content-preview {
      color: #666;
      font-style: italic;
      max-height: 60px;
      overflow: hidden;
      position: relative;
    }

    .lia-referenced-content-preview::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 20px;
      background: linear-gradient(transparent, #f0f9ff);
    }

    .lia-clear-reference {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      font-size: 12px;
      margin-left: auto;
    }
  `;

  document.head.appendChild(styles);
}
