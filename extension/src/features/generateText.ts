// API calls for AI-powered text generation extracted from content.tsx
import { accessToken } from "../utils/textHelpers";

export type TransformType =
  | "rewrite"
  | "shorten"
  | "expand"
  | "professional"
  | "emoji"
  | "grammar";

const PROMPT_MAP: Record<TransformType, (text: string) => string> = {
  rewrite: (t) =>
    `Rewrite this sentence to be more engaging and professional: "${t}"`,
  shorten: (t) =>
    `Make this text shorter while keeping the main message: "${t}"`,
  expand: (t) => `Expand this text with more detail and context: "${t}"`,
  professional: (t) =>
    `Make this text more professional and business-appropriate: "${t}"`,
  emoji: (t) =>
    `Add relevant emojis to this text to make it more engaging: "${t}"`,
  grammar: (t) =>
    `Fix any grammar, spelling, or punctuation errors in this text: "${t}"`,
};

/**
 * Call the LIA API to transform/rewrite a piece of text.
 * Returns the transformed text string.
 */
export async function generateRewrittenText(
  text: string,
  type: TransformType | string,
): Promise<string> {
  const promptFn = PROMPT_MAP[type as TransformType];
  let prompt = promptFn ? promptFn(text) : `Improve this text: "${text}"`;

  prompt += " Return only the improved text without quotes or explanations.";

  const token = await accessToken();
  const response = await (window as any).lia_fetchWithAuth(
    "https://api.getlia.live/api/prompt/improve",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ prompt, type }),
    },
  );

  if (!response.ok) {
    const data = (await response.json()) as { error?: { message: string } };
    throw new Error(data.error?.message ?? "Failed to transform text");
  }

  const data = (await response.json()) as { response: string };
  return data.response;
}

/**
 * Call the LIA API to generate an improved version of a full LinkedIn post.
 * Returns the raw API data object (may contain `response`, `improvements`, `error`).
 */
export async function generateImprovedText(
  originalText: string,
  tone: string,
  industry: string,
): Promise<{ response?: string; improvements?: string[]; error?: string }> {
  const prompt = `Improve and rewrite the following LinkedIn post to make it more engaging, professional, and impactful. Keep the core message but enhance clarity, flow, and engagement. Maintain the same tone (${tone}) and make it suitable for the ${industry} industry:

    "${originalText}"

    Return only the improved text without any explanations or quotes. Include proper line breaks and formatting as needed - whitespaces.`;

  const token = await accessToken();
  const response = await (window as any).lia_fetchWithAuth(
    "https://api.getlia.live/api/prompt/rewrite",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ prompt, originalText }),
    },
  );

  return response.json() as Promise<{
    response?: string;
    improvements?: string[];
    error?: string;
  }>;
}
