export {};

declare global {
  interface Window {
    getLiaUserInfo?: () => Promise<any>;
    detectLinkedInTheme?: () => Promise<string>;
    lia_clearTokens?: () => Promise<void>;
    lia_fetchWithAuth?: (url: string, options: any) => Promise<Response>;
    linkedinMentionsData?: any[];
    lia_showTemporaryImprovements?: (
      editor: any,
      improvements: any[],
      duration: number,
    ) => void;
    linkedInMentionHandler?: any;
    animateTextRewriteWithMentions?: any;
    LinkedInMentionHandler?: any;
    Lia_ProfileCard?: any;
    Lia_CustomizationModal?: any;
    customizationModal?: any;
    cleanAIResponse?: (str: string) => string;
    showImprovementsMade?: (
      editor: any,
      improvements: any[],
      originalText?: string,
    ) => void;
    showTemporaryMessage?: (editor: any, message: string, type: string) => void;
  }
}
