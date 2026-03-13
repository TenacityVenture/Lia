// @ts-nocheck
// Mention handling utilities extracted from content.tsx
// Handles LinkedIn @mentions within Quill editor paragraphs

export interface MentionData {
  id: number;
  text: string;
  originalElement: string;
  entityUrn: string | null;
  objectUrn: string | null;
  href: string | null;
  guid: string | null;
}

/** Extract all @mention elements from a paragraph */
export function extractMentionsFromParagraph(
  paragraph: Element,
): MentionData[] {
  const mentions: MentionData[] = [];
  const mentionElements = paragraph.querySelectorAll(".ql-mention");

  mentionElements.forEach((mention, index) => {
    mentions.push({
      id: index,
      text: mention.textContent?.trim() ?? "",
      originalElement: mention.outerHTML,
      entityUrn: mention.getAttribute("data-entity-urn"),
      objectUrn: mention.getAttribute("data-object-urn"),
      href: mention.getAttribute("href"),
      guid: mention.getAttribute("data-guid"),
    });
  });

  return mentions;
}

/** Convert @mention HTML elements in a paragraph to @Name plain-text placeholders */
export function convertMentionsToAtFormat(paragraph: Element): string {
  let text = (paragraph as HTMLElement).innerHTML;
  const mentionElements = paragraph.querySelectorAll(".ql-mention");

  mentionElements.forEach((mention) => {
    const mentionText = mention.textContent?.trim() ?? "";
    text = text.replace(mention.outerHTML, `@${mentionText}`);
  });

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = text;
  return tempDiv.textContent ?? tempDiv.innerText ?? "";
}

/** Replace @Name placeholders back with proper LinkedIn mention anchor elements */
export function restoreMentionsInText(
  text: string,
  mentions: MentionData[],
): string {
  if (!mentions || mentions.length === 0) return text;
  let restoredText = text;

  mentions.forEach((mention) => {
    const atMention = `@${mention.text}`;
    if (restoredText.includes(atMention)) {
      restoredText = restoredText.replace(atMention, `<MENTION_${mention.id}>`);
    }
  });

  mentions.forEach((mention) => {
    const placeholder = `<MENTION_${mention.id}>`;
    if (restoredText.includes(placeholder)) {
      restoredText = restoredText.replace(
        placeholder,
        createLinkedInMention(mention),
      );
    }
  });

  return restoredText;
}

/** Build the HTML for a LinkedIn @mention anchor tag */
export function createLinkedInMention(mentionData: MentionData): string {
  return `<a class="ql-mention" href="${mentionData.href ?? "#"}" data-entity-urn="${mentionData.entityUrn ?? ""}" data-guid="${mentionData.guid ?? ""}" data-object-urn="${mentionData.objectUrn ?? ""}" data-original-text="${mentionData.text}" spellcheck="false" data-test-ql-mention="true">${mentionData.text}</a>`;
}

/**
 * Get the full sentence/paragraph that contains the current text selection.
 * Stores mention data globally for later restoration during AI text transforms.
 */
export function getFullSentence(selection: Selection): string {
  const range = selection.getRangeAt(0);

  // Prefer the full paragraph element when available
  let paragraph: Element | null = range.commonAncestorContainer as Element;
  while (paragraph && (paragraph as HTMLElement).tagName !== "P") {
    paragraph = (paragraph as HTMLElement).parentElement;
  }

  if (paragraph && (paragraph as HTMLElement).tagName === "P") {
    const mentions = extractMentionsFromParagraph(paragraph);
    const textWithMentions = convertMentionsToAtFormat(paragraph);
    (window as any).linkedinMentionsData = mentions;
    return textWithMentions;
  }

  // Fallback: find sentence boundaries within the text node
  const container = range.commonAncestorContainer;
  const text =
    (container as any).textContent ?? (container as any).innerText ?? "";
  const startOffset = range.startOffset;
  let sentenceStart = text.lastIndexOf(".", startOffset - 1) + 1;
  let sentenceEnd = text.indexOf(".", startOffset);
  if (sentenceStart < 0) sentenceStart = 0;
  if (sentenceEnd < 0) sentenceEnd = text.length;
  return text.substring(sentenceStart, sentenceEnd).trim();
}
