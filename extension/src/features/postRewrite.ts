import { waitForElement } from "../utils/textHelpers";
import { generateImprovedText } from "./generateText";

/**
 * Creates temporary message overlays in the editor
 */
export function showTemporaryMessage(
  editor: HTMLElement,
  message: string,
  type = "info",
) {
  // Check if there's already a message, remove it
  const existingMessage =
    editor.parentElement?.querySelector(".lia-temp-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  const messageEl = document.createElement("div");
  messageEl.className = `lia-temp-message lia-msg-${type}`;
  messageEl.style.cssText = `
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: ${type === "error" ? "#fef2f2" : "#f0f9ff"};
    color: ${type === "error" ? "#dc2626" : "#0a66c2"};
    border: 1px solid ${type === "error" ? "#fecaca" : "#bae6fd"};
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
  `;
  messageEl.innerHTML = message;

  if (editor.parentElement) {
    editor.parentElement.style.position = "relative";
    editor.parentElement.appendChild(messageEl);
  }

  setTimeout(() => {
    if (messageEl.parentElement) {
      messageEl.style.animation = "fadeOut 0.3s ease-in";
      setTimeout(() => messageEl.remove(), 300);
    }
  }, 4000);
}

/**
 * Loading overlay for post rewriting
 */
export function createLoadingOverlay(editor: HTMLElement) {
  const overlay = document.createElement("div");
  overlay.className = "linkedin-ai-rewrite-loading";
  overlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    border-radius: 8px;
    backdrop-filter: blur(2px);
  `;

  overlay.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px; color: #0a66c2;">
      <div class="linkedin-ai-loading-spinner" style="width: 16px; height: 16px;"></div>
      <span style="font-size: 14px;">AI is rewriting...</span>
    </div>
  `;

  const editorParent = editor.closest(".share-box") as HTMLElement;
  if (editorParent) {
    editorParent.style.position = "relative";
    editorParent.appendChild(overlay);
  }

  return overlay;
}

/**
 * Handles the AI Post Rewrite logic when clicking the AI Rewrite button
 */
export async function handleRewriteAssistant(editor: HTMLElement) {
  const settings = await chrome.storage.sync.get(["tone", "industry"]);
  const tone = settings.tone || "professional";
  const industry = settings.industry || "technology";

  const paragraphs = Array.from(editor.querySelectorAll("p"));
  const textContent = paragraphs
    .map((p) => {
      let result = "";
      p.childNodes.forEach((node) => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node as Element).classList.contains("ql-mention")
        ) {
          result += "@" + (node.textContent ?? "");
        } else if (
          node.nodeType === Node.TEXT_NODE ||
          node.nodeType === Node.ELEMENT_NODE
        ) {
          result += node.textContent ?? "";
        }
      });
      return result.trim();
    })
    .join("\n");

  let currentText = textContent || editor.textContent || editor.innerText || "";

  if (!currentText.trim()) {
    showTemporaryMessage(editor, "Please write some text first to rewrite it");
    return;
  }

  const loadingOverlay = createLoadingOverlay(editor);
  showTemporaryMessage(editor, "LIA is rewriting..");

  try {
    const response = await generateImprovedText(
      currentText,
      tone as string,
      industry as string,
    );

    if (response.error && response.error.includes("missing plan")) {
      loadingOverlay.remove();
      showTemporaryMessage(
        editor,
        "Please upgrade your plan to use this feature. <a href='https://www.getlia.live/pricing' target='_blank'>Upgrade Now</a>",
        "error",
      );
      return;
    } else if (response.error && response.error.includes("Plan expired")) {
      loadingOverlay.remove();
      showTemporaryMessage(
        editor,
        "Your plan has expired. Please renew your subscription to continue using this feature. <a href='https://www.getlia.live/pricing' target='_blank'>Renew Now</a>",
        "error",
      );
      return;
    } else if (
      response.error &&
      response.error.includes("Invalid or expired token")
    ) {
      loadingOverlay.remove();
      showTemporaryMessage(
        editor,
        "Your session has expired. Please sign in again to continue using this feature.",
        "error",
      );
      return;
    }

    const improvedText = (window as any).cleanAIResponse
      ? (window as any).cleanAIResponse(response.response)
      : response.response;

    const improvements = response.improvements || [];

    loadingOverlay.remove();

    if (improvedText) {
      if ((window as any).animateTextRewriteWithMentions) {
        await (window as any).animateTextRewriteWithMentions(
          editor,
          currentText,
          improvedText,
          improvements,
        );
      } else {
        editor.textContent = improvedText;
      }

      if ((window as any).showImprovementsMade) {
        (window as any).showImprovementsMade(editor, improvements, currentText);
      }
    } else {
      showTemporaryMessage(
        editor,
        "No improvements were made to the text because the extension encountered an error",
      );
    }
  } catch (error: any) {
    loadingOverlay.remove();
    console.error("Error during rewrite:", error);
    if (error.message === "Failed to generate improved text") {
      showTemporaryMessage(
        editor,
        "Failed to generate improved text. Maybe your session has expired. Please try signing in again.",
      );
    } else {
      showTemporaryMessage(editor, `Error: ${error.message}`);
    }
  }
}

/**
 * Initializes the Post Rewrite button inside LinkedIn's post creation modal
 */
export function removeRewriteAssistant() {
  document.querySelectorAll(".share-box_actions .linkedin-ai-button").forEach((el) => el.remove());
}

/**
 * Initializes the Post Rewrite button inside LinkedIn's post creation modal
 */
export function setuprewrite_enabledment() {
  const createPostButton = document.querySelector(
    ".share-box-feed-entry__top-bar button.artdeco-button--tertiary",
  );

  if (!createPostButton) return;
  // Make sure we don't add multiple listeners
  if (createPostButton.hasAttribute("data-lia-rewrite-setup")) return;
  createPostButton.setAttribute("data-lia-rewrite-setup", "true");

  createPostButton.addEventListener("click", () => {
    chrome.storage.sync.get(["rewrite_enabled", "linkedinTheme"], (settings) => {
      if (!settings.rewrite_enabled) return;

      waitForElement(".share-box_actions").then((shareBoxActionElement) => {
        const shareBoxAction = shareBoxActionElement as HTMLElement;
        if (shareBoxAction) {
          shareBoxAction.style.display = "flex";
          shareBoxAction.style.gap = "8px";
        }

        const aiButton = document.createElement("button");
        aiButton.className = "linkedin-ai-button";
        if (settings.linkedinTheme === "dark") {
          aiButton.style.backgroundColor = "#71b7fb";
        }

        aiButton.style.padding = "4px 8px";
        aiButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Zm0 12.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
        </svg>
          AI Rewrite
        `;

        const qlEditor = document.querySelector(
          ".share-box .ql-editor",
        ) as HTMLElement;

        let isRewriting = false;

        aiButton.addEventListener("click", async () => {
          if (isRewriting) {
            showTemporaryMessage(
              qlEditor,
              "LIA is rewriting text. Please wait for the process is complete.",
            );
          } else {
            isRewriting = true;
            await handleRewriteAssistant(qlEditor);
            isRewriting = false;
          }
        });

        if (
          shareBoxAction &&
          !shareBoxAction.querySelector(".linkedin-ai-button")
        ) {
          shareBoxAction.prepend(aiButton);
        }
      });
    });
  });
}
