import React from "react";
import { createRoot } from "react-dom/client";
import { TextSelectionToolbar } from "../components/TextSelectionToolbar";
import { generateRewrittenText } from "./generateText";
import { getFullSentence } from "./mentionHandling";
import {
  isBoldUnicode,
  isItalicUnicode,
  isUnicode,
  fromUnicodeToNormal,
  toUnicodeStyle,
} from "../utils/unicodeFormatting";

let toolbarRoot: ReturnType<typeof createRoot> | null = null;
let toolbarContainer: HTMLDivElement | null = null;

export function setupTextSelectionToolbar() {
  if (toolbarContainer) return; // already setup

  toolbarContainer = document.createElement("div");
  toolbarContainer.id = "linkedin-ai-text-toolbar-root";
  document.body.appendChild(toolbarContainer);

  toolbarRoot = createRoot(toolbarContainer);

  toolbarRoot.render(
    <TextSelectionToolbar
      onFormat={handleTextFormatting}
      onTransform={handleTextTransform}
      onRewrite={handleAIRewrite}
    />
  );
}

function handleTextFormatting(type: string) {
  const selection = window.getSelection();
  if (!selection) return;
  const selectedText = selection.toString();
  if (!selectedText) return;

  let formattedText = selectedText;

  switch (type) {
    case "bold":
      if (isItalicUnicode(selectedText.trim())) {
        formattedText = fromUnicodeToNormal(selectedText, "italic");
      }
      if (isUnicode(selectedText.trim())) {
        formattedText = fromUnicodeToNormal(selectedText, "bold");
      } else {
        formattedText = toUnicodeStyle(selectedText);
      }
      break;
    case "italic":
      if (isBoldUnicode(selectedText.trim())) {
        formattedText = fromUnicodeToNormal(selectedText, "bold");
      }
      if (isUnicode(selectedText.trim())) {
        formattedText = fromUnicodeToNormal(selectedText, "italic");
      } else {
        formattedText = toUnicodeStyle(selectedText, "italic");
      }
      break;
  }

  replaceSelectedText(formattedText);
  hideToolbar();
}

async function handleTextTransform(type: string) {
  const selection = window.getSelection();
  if (!selection) return;
  const selectedText = selection.toString().trim();
  let fullSentence = getFullSentence(selection);

  if (fullSentence.length === 0) return;
  if (fullSentence[fullSentence.length - 1] !== ".") {
    fullSentence += ".";
  }

  if (!selectedText) return;

  try {
    showToolbarLoading();
    const transformedText = await generateRewrittenText(selectedText, type);
    if (!transformedText) {
      showToolbarError("Failed to fetch transformed text");
      return;
    }
    await replaceTextInSentence(selection, fullSentence, transformedText);
    hideToolbar();
  } catch (error: any) {
    showToolbarError(error.message);
  }
}

async function handleAIRewrite() {
  const selection = window.getSelection();
  if (!selection) return;
  const selectedText = selection.toString().trim();

  if (!selectedText) return;

  let fullSentence = selectedText;
  if (!selectedText.endsWith(".") && !selectedText.endsWith("?") && !selectedText.endsWith("!")) {
    fullSentence = getFullSentence(selection);
  }

  if (fullSentence.length === 0) return;

  const originalSentence = fullSentence;
  if (fullSentence[fullSentence.length - 1] !== ".") {
    fullSentence += ".";
  }

  try {
    showToolbarLoading();
    const rewrittenText = await generateRewrittenText(fullSentence, "rewrite");
    if (rewrittenText) {
      await replaceTextInSentence(selection, originalSentence, rewrittenText);
      hideToolbar();
    } else {
      showToolbarError("failed to fetch");
    }
  } catch (error: any) {
    showToolbarError(error.message);
  }
}

function replaceSelectedText(newText: string) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const selectedText = selection.toString();
  if (!selectedText) return;

  range.deleteContents();
  const textNode = document.createTextNode(newText);
  range.insertNode(textNode);

  range.setStartAfter(textNode);
  range.setEndAfter(textNode);
  selection.removeAllRanges();
  selection.addRange(range);

  let editor = textNode.parentElement;
  while (editor && !editor.isContentEditable) {
    editor = editor.parentElement;
  }

  if (editor) {
    editor.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

async function replaceTextInSentence(
  selection: Selection,
  originalSentence: string,
  newSentence: string
) {
  const range = selection.getRangeAt(0);
  let paragraph: Element | null = range.commonAncestorContainer as Element;
  while (paragraph && (paragraph as HTMLElement).tagName !== "P") {
    paragraph = (paragraph as HTMLElement).parentElement as Element;
  }

  if (!paragraph || paragraph.tagName !== "P") {
    replaceSelectedText(newSentence);
    return;
  }

  const mentions = (window as any).linkedinMentionsData || [];
  let restoredSentence = newSentence;
  if (mentions.length > 0) {
    const { restoreMentionsInText } = await import("./mentionHandling");
    restoredSentence = restoreMentionsInText(newSentence, mentions);
  }

  const originalText = paragraph.textContent || (paragraph as HTMLElement).innerText || "";
  const tempSpan = document.createElement("span");
  tempSpan.style.cssText = `
    background: linear-gradient(90deg, #e7f3ff, #f0f9ff);
    border-radius: 4px;
    padding: 2px 4px;
    transition: all 0.3s ease;
    position: relative;
    display: inline-block;
    width: 100%;
    min-height: 1.2em;
  `;

  tempSpan.textContent = originalText;
  paragraph.innerHTML = "";
  paragraph.appendChild(tempSpan);

  await animateTextReplacement(tempSpan, originalText, restoredSentence);

  paragraph.innerHTML = restoredSentence;
  delete (window as any).linkedinMentionsData;

  const editor = paragraph.closest(".ql-editor");
  if (editor) {
    editor.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

async function animateTextReplacement(element: HTMLElement, originalText: string, newText: string): Promise<void> {
  return new Promise((resolve) => {
    element.style.background = "linear-gradient(90deg, #fef3c7, #fde68a)";
    element.style.transform = "scale(1.02)";

    setTimeout(() => {
      let currentIndex = 0;
      element.style.background = "linear-gradient(90deg, #e7f3ff, #dbeafe)";
      element.style.transform = "scale(1)";

      const typewriterInterval = setInterval(() => {
        if (currentIndex <= newText.length) {
          const partialText = newText.substring(0, currentIndex);
          if (currentIndex < newText.length) {
            element.innerHTML = partialText + '<span style="animation: blink 1s infinite; color: #0a66c2;">|</span>';
          } else {
            element.textContent = newText;
          }
          currentIndex++;
        } else {
          clearInterval(typewriterInterval);
          element.style.background = "linear-gradient(90deg, #d1fae5, #a7f3d0)";
          element.style.transform = "scale(1.02)";

          setTimeout(() => {
            element.style.background = "transparent";
            element.style.transform = "scale(1)";
            element.style.transition = "all 0.5s ease";
            setTimeout(resolve, 500);
          }, 800);
        }
      }, 50);
    }, 300);
  });
}

function showToolbarLoading() {
  const toolbar = document.getElementById("linkedin-ai-text-toolbar");
  if (toolbar) {
    toolbar.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; padding: 4px 8px;">
        <div class="linkedin-ai-loading-spinner" style="width: 14px; height: 14px;"></div>
        <span style="font-size: 12px; color: #0a66c2;">Processing...</span>
      </div>
    `;
  }
}

function showToolbarError(message: string) {
  const toolbar = document.getElementById("linkedin-ai-text-toolbar");
  if (toolbar) {
    toolbar.innerHTML = `
      <div style="padding: 4px 8px; color: #ef4444; font-size: 12px;">
        ${message}
      </div>
    `;
    setTimeout(() => hideToolbar(), 3000);
  }
}

function hideToolbar() {
  const selection = window.getSelection();
  if (selection) selection.removeAllRanges();
  // Note: the React component manages its own visibility based on selection event
  // but if needed we can trigger a re-check by dispatching a fake event
  document.dispatchEvent(new MouseEvent("mousedown"));
}
