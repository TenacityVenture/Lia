// General text and DOM helper utilities extracted from content.tsx

/** Wait for a DOM element to appear, retrying on interval */
export function waitForElement(
  selector: string,
  maxAttempts = 100,
  interval = 1000
): Promise<Element> {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      attempts++;
      if (attempts >= maxAttempts) {
        return reject(`Element ${selector} not found after ${maxAttempts} attempts`);
      }
      setTimeout(check, interval);
    };
    check();
  });
}

/** Insert text into a LinkedIn Quill editor or a textarea */
export function insertTextIntoEditor(editor: HTMLElement, text: string): void {
  if (editor.isContentEditable) {
    editor.textContent = text.replace(/"/g, "");
    editor.dispatchEvent(new Event("input", { bubbles: true }));
  } else if ((editor as HTMLTextAreaElement).tagName === "TEXTAREA") {
    (editor as HTMLTextAreaElement).value = text;
    editor.dispatchEvent(new Event("input", { bubbles: true }));
  } else {
    editor.textContent = text;
  }
}

/** Retrieve the current access token from chrome.storage.local */
export async function accessToken(): Promise<string> {
  const { access_token } = (await chrome.storage.local.get(["access_token"])) as {
    access_token?: string;
  };
  if (!access_token) throw new Error("Please Sign in to continue");
  return access_token;
}

// ---------------------------------------------------------------------------
// Message / Markdown formatting helpers (used by chatbot)
// ---------------------------------------------------------------------------

/** Format a raw AI message string for display in the chatbot */
export function formatMessage(message: string): string {
  return formatMarkdown(formatLinks(message));
}

/** Convert plain URLs and markdown links to anchor tags */
export function formatLinks(text: string): string {
  // Handle markdown-style links [text](url)
  text = text.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    (_match, linkText, url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="lia-link">${linkText} <span class="lia-link-icon">🔗</span></a>`
  );

  // Convert bare URLs but leave existing anchor tags untouched
  return text.replace(
    /(<a [^>]+>.*?<\/a>)|(https?:\/\/[^\s<]+)/g,
    (match, anchor, url) => {
      if (anchor) return anchor;
      if (url) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="lia-link">${url} <span class="lia-link-icon">🔗</span></a>`;
      }
      return match;
    }
  );
}

/** Convert a subset of Markdown to HTML for chatbot messages */
export function formatMarkdown(text: string): string {
  // Headers
  text = text.replace(/^### (.*$)/gm, '<h3 class="lia-h3">$1</h3>');
  text = text.replace(/^## (.*$)/gm, '<h2 class="lia-h2">$1</h2>');
  text = text.replace(/^# (.*$)/gm, '<h1 class="lia-h1">$1</h1>');

  // Bold & italic
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Code blocks
  text = text.replace(
    /```([\s\S]*?)```/g,
    (_m, code) => `<pre class="lia-code-block" style="position:relative"><code>${code}</code></pre>`
  );

  // Inline code
  text = text.replace(/`([^`]+)`/g, '<code class="lia-inline-code">$1</code>');

  // Unordered lists
  text = text.replace(/^\* (.*$)/gm, '<li class="lia-list-item">$1</li>');
  text = text.replace(
    /(<li class="lia-list-item">.*<\/li>)/s,
    '<ul class="lia-list">$1</ul>'
  );

  // Ordered lists
  text = text.replace(/^\d+\. (.*$)/gm, '<li class="lia-ordered-item">$1</li>');
  text = text.replace(
    /(<li class="lia-ordered-item">.*<\/li>)/s,
    '<ol class="lia-ordered-list">$1</ol>'
  );

  // Paragraphs and line breaks
  text = text.replace(/\n\n/g, '</p><p class="lia-paragraph">');
  text = '<p class="lia-paragraph">' + text + "</p>";
  text = text.replace(/\n/g, "<br>");

  return text;
}
