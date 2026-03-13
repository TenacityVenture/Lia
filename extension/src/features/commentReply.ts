import { PERSONAS } from "../utils/constants";
import { accessToken } from "../utils/textHelpers";

/** Context extracted from LinkedIn comment area to generate relevant suggestions */
export interface CommentContext {
  postAuthor: string;
  postContent: string;
  isReplyingToComment: boolean;
  replyingToAuthor?: string;
  replyingToContent?: string;
}

export function getCommentContext(commentInput: Element): CommentContext | null {
  const context: Partial<CommentContext> = {
    isReplyingToComment: false,
  };

  const feedItem = commentInput.closest(".feed-shared-update-v2");
  if (feedItem) {
    const authorEl = feedItem.querySelector(".update-components-actor__name");
    const contentEl = feedItem.querySelector(".update-components-text");
    context.postAuthor = authorEl ? (authorEl.textContent || "").trim() : "";
    context.postContent = contentEl ? (contentEl.textContent || "").trim() : "";
  }

  const commentItem = commentInput.closest(".comments-comment-item");
  if (commentItem) {
    context.isReplyingToComment = true;
    const authorEl = commentItem.querySelector(".comments-post-meta__name-text");
    const contentEl = commentItem.querySelector(".comments-comment-item-content-body");
    context.replyingToAuthor = authorEl ? (authorEl.textContent || "").trim() : "";
    context.replyingToContent = contentEl ? (contentEl.textContent || "").trim() : "";
  }

  if (context.postAuthor && context.postContent) {
    return context as CommentContext;
  }

  return null;
}

export async function generateCommentSuggestions(context: CommentContext): Promise<any> {
  const { selectedPersona } = await chrome.storage.sync.get(["selectedPersona"]);
  const personaKey = (selectedPersona as string) || "professional";
  const persona = PERSONAS[personaKey as keyof typeof PERSONAS];

  const prompt = `Based on this LinkedIn post by ${context.postAuthor}:\n\n"${context.postContent}"\n\nProvide 3 unique, engaging, and thoughtful comment suggestions from the perspective of a ${persona.name} persona: ${persona.prompt}.`;

  return fetchSuggestions(prompt);
}

export async function generateReplyToCommentSuggestions(context: CommentContext): Promise<any> {
  const { selectedPersona } = await chrome.storage.sync.get(["selectedPersona"]);
  const personaKey = (selectedPersona as string) || "professional";
  const persona = PERSONAS[personaKey as keyof typeof PERSONAS];

  const prompt = `LinkedIn post by ${context.postAuthor}:\n"${context.postContent}"\n\nUser ${context.replyingToAuthor} commented:\n"${context.replyingToContent}"\n\nProvide 3 unique, engaging replies to this specific comment from the perspective of a ${persona.name} persona: ${persona.prompt}.`;

  return fetchSuggestions(prompt);
}

async function fetchSuggestions(prompt: string): Promise<any> {
  const token = await accessToken();
  const response = await (window as any).lia_fetchWithAuth(
    "https://api.getlia.live/api/prompt/comment",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ prompt }),
    }
  );

  return response.json();
}

export function displayCommentSuggestions(
  container: HTMLElement,
  suggestionsResponse: any,
  commentInput: Element
) {
  if (!suggestionsResponse || !suggestionsResponse.suggestions) {
    container.innerHTML = `<div style="color: red; padding: 10px;">Failed to parse suggestions</div>`;
    return;
  }

  const suggestions = Array.isArray(suggestionsResponse.suggestions)
    ? suggestionsResponse.suggestions
    : [suggestionsResponse.suggestions];

  container.innerHTML = "";
  
  suggestions.forEach((suggestionText: string) => {
    const item = document.createElement("div");
    item.className = "linkedin-ai-suggestion-item";
    item.textContent = suggestionText;
    
    item.addEventListener("click", () => {
      const qlEditor = commentInput.querySelector(".ql-editor");
      if (qlEditor) {
        // Insert text into editor
        (window as any).insertTextIntoEditor?.(qlEditor, suggestionText);
      }
      container.remove();
    });
    
    container.appendChild(item);
  });

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✕";
  closeBtn.style.cssText = "position: absolute; top: 5px; right: 5px; background: none; border: none; cursor: pointer; color: #666; font-size: 12px;";
  closeBtn.onclick = () => container.remove();
  container.appendChild(closeBtn);
}

export function selectPersona(personaKey: string, container: Element) {
  chrome.storage.sync.set({ selectedPersona: personaKey });
  
  const persona = PERSONAS[personaKey];
  const personaBtn = container.querySelector(".lia-persona-btn");
  if (personaBtn) {
    personaBtn.innerHTML = `
      <span class="lia-persona-icon">${persona.icon}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6,9 12,15 18,9"/>
      </svg>
    `;
  }

  container.querySelectorAll(".lia-persona-option").forEach((option) => {
    option.classList.remove("active");
  });
  
  const newActive = container.querySelector(`[data-persona="${personaKey}"]`);
  if (newActive) newActive.classList.add("active");
}

export function addReplyAssistant(commentInput: Element) {
  if (commentInput.querySelector(".lia-reply-assistant")) return;

  const actionsArea = commentInput.querySelector(".comments-comment-box-comment__text-editor");
  if (!actionsArea) return;

  chrome.storage.sync.get(["linkedinTheme", "selectedPersona"], (settings) => {
    const themeClass = settings.linkedinTheme === "dark" ? "dark" : "";
    const currentPersona = (settings.selectedPersona as string) || "professional";
    
    const assistantContainer = document.createElement("div");
    assistantContainer.className = `lia-reply-assistant ${themeClass}`;
    assistantContainer.innerHTML = `
      <button class="linkedin-ai-button ${themeClass}" title="Generate AI Reply" style="font-size: 12px; padding: 4px 8px;" >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Zm0 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
        </svg>
        AI Reply
      </button>
      <div class="lia-persona-selector">
        <button class="lia-persona-btn" id="lia-persona-${Date.now()}" style="font-size: 12px; padding: 4px 8px;">
          <span class="lia-persona-icon">${PERSONAS[currentPersona as keyof typeof PERSONAS]?.icon || "💼"}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </button>
        <div class="lia-persona-dropdown" style="display: none;">
          ${Object.entries(PERSONAS)
            .map(
              ([key, persona]) => `
            <div class="lia-persona-option ${key === currentPersona ? "active" : ""}" data-persona="${key}">
              <span class="lia-persona-icon">${persona.icon}</span>
              <div class="lia-persona-info">
                <div class="lia-persona-name">${persona.name}</div>
                <div class="lia-persona-desc">${persona.description}</div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

    actionsArea.prepend(assistantContainer);

    const personaBtn = assistantContainer.querySelector(".lia-persona-btn") as HTMLElement;
    const personaDropdown = assistantContainer.querySelector(".lia-persona-dropdown") as HTMLElement;
    const replyBtn = assistantContainer.querySelector(".linkedin-ai-button") as HTMLElement;

    if (personaBtn && personaDropdown) {
      personaBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        personaDropdown.style.display = personaDropdown.style.display === "none" ? "block" : "none";
      });

      document.addEventListener("click", () => {
        personaDropdown.style.display = "none";
      });

      assistantContainer.querySelectorAll(".lia-persona-option").forEach((option) => {
        option.addEventListener("click", (e) => {
          e.stopPropagation();
          const personaKey = (option as HTMLElement).dataset.persona || "professional";
          selectPersona(personaKey, assistantContainer);
          personaDropdown.style.display = "none";
        });
      });
    }

    if (replyBtn) {
      replyBtn.addEventListener("click", (e) => {
        e.preventDefault();
        handlereply_enabledant(commentInput);
      });
    }
  });
}

export async function handlereply_enabledant(commentInput: Element) {
  const commentBox = commentInput.querySelector(".ql-container");
  const commentInputEditor = commentInput.querySelector(".ql-editor");
  
  if (!commentBox || !commentInputEditor) return;

  let suggestionsContainer = commentBox.querySelector(".linkedin-ai-suggestions") as HTMLElement;

  if (!suggestionsContainer) {
    suggestionsContainer = document.createElement("div");
    suggestionsContainer.className = "linkedin-ai-suggestions";
    commentBox.appendChild(suggestionsContainer);
  }

  const { linkedinTheme } = await chrome.storage.sync.get(["linkedinTheme"]);
  
  if (linkedinTheme === "dark") {
    suggestionsContainer.style.backgroundColor = "#293139";
    suggestionsContainer.style.border = "0";
  }

  suggestionsContainer.innerHTML = `
    <div class="linkedin-ai-loading">
      <div class="linkedin-ai-loading-spinner"></div>
      <span>Generating reply suggestions...</span>
    </div>
  `;

  try {
    const context = getCommentContext(commentInput);
    if (!context) throw new Error("Unable to determine comment context");

    let suggestions;
    if (context.isReplyingToComment) {
      suggestions = await generateReplyToCommentSuggestions(context);
    } else {
      suggestions = await generateCommentSuggestions(context);
    }

    if (suggestions && suggestions.error) {
      if (suggestions.error.includes("missing plan")) {
        suggestionsContainer.innerHTML = `
          <div style="color: red; padding: 10px;">
          Please upgrade your plan to use this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Upgrade Now</a>
          </div>
        `;
        return;
      } else if (suggestions.error.includes("Plan expired")) {
        suggestionsContainer.innerHTML = `
          <div style="color: red; padding: 10px;">
          Your plan has expired. Please renew your subscription to continue using this feature. <a href="https://www.getlia.live/pricing" target="_blank" style="color: blue">Renew Now</a>
          </div>
        `;
        return;
      }
    }

    commentInputEditor.textContent = "";

    displayCommentSuggestions(suggestionsContainer, suggestions, commentInput);
  } catch (error: any) {
    suggestionsContainer.innerHTML = `
      <div style="color: red; padding: 10px;">
      ${error.message || "Failed to generate suggestions"}
      </div>
    `;
    throw error;
  }
}

export function setupCommentReplyAssistant() {
  chrome.storage.sync.get(["reply_enabled"], (settings) => {
    if (!settings.reply_enabled) return;

    const commentInputs = document.querySelectorAll(".comments-comment-texteditor");
    commentInputs.forEach((input) => {
      addReplyAssistant(input);
    });
  });
}
