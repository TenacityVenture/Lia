// @ts-nocheck
export const chatbotState = {
  isOpen: false,
  isMinimized: false,
  sidebarCollapsed: false,
  conversations: [] as any[],
  currentConversationId: null as string | null,
  position: { x: typeof window !== 'undefined' ? window.innerWidth - 80 : 0, y: typeof window !== 'undefined' ? window.innerHeight - 80 : 0 },
  referenceMode: false,
  referencedContent: null as any | null,

  // New notes functionality
  notesMode: false,
  notes: [] as any[],
  currentNoteId: null as string | null,
  noteContext: null as any | null, // LinkedIn profile context

  templateMode: false,
  selectedTemplate: null as any | null,
};

// save to extension storage
export async function saveChatbotState() {
  await chrome.storage.local.set({ chatbotState });
}

// Load state from storage on startup
chrome.storage.local.get(["chatbotState"], (result) => {
  if (result.chatbotState) {
    Object.assign(chatbotState, result.chatbotState);
  }
});

// load chatbot state from storage function
export const loadChatbotState = async () => {
  // Load state from storage
  const result = await chrome.storage.local.get(["chatbotState"]);
  if (result.chatbotState) {
    Object.assign(chatbotState, result.chatbotState);
  }
};
