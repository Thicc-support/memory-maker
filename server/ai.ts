import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const storyProvider = (process.env.STORY_PROVIDER || "openai").toLowerCase();
const anthropicModel = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest";
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const imageProvider = (process.env.IMAGE_PROVIDER || "openai").toLowerCase();
const geminiImageModel = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image-preview";
const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

interface StoryProfileContext {
  name: string;
  relationship: string;
  age?: string;
  personality?: string;
  appearance?: string;
  interests?: string;
  catchphrases?: string;
  storyHistory?: Array<{
    bookTitle: string;
    summary: string;
    themes: string[];
  }>;
  aiNotes?: string;
}

interface StoryInput {
  recipientName: string;
  recipientAge: string;
  theme: string;
  subject: string;
  bookType: string;
  style: string;
  interviewAnswers: Record<string, string>;
  messages: any[];
  profileContext?: StoryProfileContext;
  customerPreferences?: {
    preferredThemes?: string[];
    preferredStyles?: string[];
    totalBooks?: number;
  };
}

function buildStoryPrompt(input: StoryInput): string {
  const interviewContext = Object.entries(input.interviewAnswers || {})
    .map(([q, a]) => `Q: ${q}\nA: ${a}`)
    .join("\n\n");

  const chatContext = (input.messages || [])
    .filter((m: any) => m.role === "user")
    .map((m: any) => m.content)
    .join("\n");

  let profileSection = "";
  if (input.profileContext) {
    const p = input.profileContext;
    profileSection = `\n\nCHARACTER PROFILE (use these details to keep the character consistent):
- Name: ${p.name}
- Relationship to book creator: ${p.relationship}
${p.age ? `- Age: ${p.age}` : ""}
${p.personality ? `- Personality: ${p.personality}` : ""}
${p.appearance ? `- Physical appearance: ${p.appearance}` : ""}
${p.interests ? `- Interests & hobbies: ${p.interests}` : ""}
${p.catchphrases ? `- Things they say: ${p.catchphrases}` : ""}
${p.aiNotes ? `- Additional notes: ${p.aiNotes}` : ""}`;

    if (p.storyHistory && p.storyHistory.length > 0) {
      profileSection += `\n\nPREVIOUS BOOKS (continue the story, reference past adventures, don't repeat plots):`;
      for (const h of p.storyHistory.slice(-5)) {
        profileSection += `\n- "${h.bookTitle}" (themes: ${h.themes.join(", ")}): ${h.summary.slice(0, 200)}`;
      }
      profileSection += `\n\nIMPORTANT: This is book #${p.storyHistory.length + 1} for ${p.name}. Reference their past adventures naturally. Show character growth. Don't retell previous stories.`;
    }
  }

  let preferencesSection = "";
  if (input.customerPreferences && input.customerPreferences.totalBooks && input.customerPreferences.totalBooks > 0) {
    preferencesSection = `\n\nCUSTOMER CONTEXT: This customer has created ${input.customerPreferences.totalBooks} book(s) before. They enjoy themes like: ${(input.customerPreferences.preferredThemes || []).join(", ") || "various"}.`;
  }

  return `You are a warm children's book author creating a personalized keepsake story. Write a children's book with EXACTLY 8 pages.

Details:
- Recipient name: ${input.recipientName || "the reader"}
- Recipient age: ${input.recipientAge || "5"}
- Theme: ${input.theme || "Adventure"}
- Subject/main character: ${input.subject || input.recipientName || "a brave child"}
- Book type: ${input.bookType || "Story Book"}
- Visual style: ${input.style || "whimsical"}
${profileSection}${preferencesSection}

Interview answers from the person creating this book:
${interviewContext || chatContext || "No specific details provided."}

Instructions:
- Write exactly 8 pages of story text
- Each page should be 2-3 sentences, appropriate for the recipient's age
- Make it warm, fun, and personal using the details provided
- Include the recipient's name naturally in the story
- The story should have a clear beginning, middle, and end
- Keep language simple and joyful for children
- Each page should paint a vivid scene that can be illustrated
- If character profile details are provided, use them consistently (appearance, personality, interests)
- If previous books exist for this character, naturally reference past adventures and show growth

Return ONLY a JSON array with 8 objects, each having "text" and "pageNumber" fields.
Example: [{"text": "Once upon a time...", "pageNumber": 1}, ...]`;
}

function normalizeStoryPages(content: string): Array<{ text: string; pageNumber: number }> {
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Failed to parse story response");
  }

  let pages = JSON.parse(jsonMatch[0]);

  if (!Array.isArray(pages) || pages.length === 0) {
    throw new Error("Invalid story format returned");
  }

  pages = pages.filter((p: any) => p && typeof p.text === "string" && p.text.trim().length > 0);

  while (pages.length < 8) {
    pages.push({
      text: "And so the adventure continued, with more wonderful memories to be made...",
      pageNumber: pages.length + 1,
    });
  }

  return pages.slice(0, 8).map((p: any, i: number) => ({
    text: p.text,
    pageNumber: i + 1,
  }));
}

async function generateAnthropicStory(prompt: string): Promise<string> {
  if (!anthropic) {
    throw new Error("ANTHROPIC_API_KEY is required when STORY_PROVIDER is anthropic.");
  }

  const response = await anthropic.messages.create({
    model: anthropicModel,
    max_tokens: 2200,
    temperature: 0.8,
    messages: [{ role: "user", content: prompt }],
  });

  return response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n")
    .trim();
}

async function generateOpenAIStory(prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: 2000,
  });

  return response.choices[0]?.message?.content || "[]";
}

export async function generateStory(input: StoryInput): Promise<Array<{ text: string; pageNumber: number }>> {
  const prompt = buildStoryPrompt(input);
  const content = storyProvider === "anthropic"
    ? await generateAnthropicStory(prompt)
    : await generateOpenAIStory(prompt);

  return normalizeStoryPages(content);
}

function buildIllustrationPrompt(
  pageText: string,
  style: string,
  recipientName: string,
  theme: string,
  pageNumber: number,
  totalPages: number
): string {
  const stylePrompts: Record<string, string> = {
    classic: "elegant traditional storybook illustration, loose watercolor and ink, warm colors, detailed backgrounds, classic children's book art",
    whimsical: "bright colorful storybook illustration, loose watercolor and ink, playful and fun, vibrant colors, cute characters",
    modern: "clean modern children's book illustration, soft textured paper, simple shapes, warm premium keepsake feeling",
    fantasy: "magical fantasy children's book illustration, loose watercolor and ink, gentle glow, enchanted atmosphere, family-safe",
    family: "warm watercolor and ink illustration, soft pastel tones, cozy family scenes, nostalgic keepsake feeling, textured paper",
  };

  const styleDesc = stylePrompts[style] || stylePrompts.whimsical;

  return `Create a premium children's keepsake book illustration for page ${pageNumber} of ${totalPages}.

Story text for this page: "${pageText}"

Theme: ${theme}
Character name: ${recipientName}

Art style: ${styleDesc}

Requirements:
- Full page illustration suitable for a children's book
- No text, captions, logos, watermarks, or written words in the image
- Warm storybook feeling with textured paper
- Family-safe and age-appropriate
- Consistent character design
- Rich detailed background matching the scene described
- Avoid horror, weapons, generic anime, and overly glossy 3D/Pixar style`;
}

async function generateOpenAIIllustration(prompt: string): Promise<string> {
  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    n: 1,
    size: "1024x1024",
    quality: "medium",
  });

  const imageData = response.data?.[0];
  if (!imageData) {
    throw new Error("Failed to generate illustration");
  }

  if (imageData.b64_json) {
    return `data:image/png;base64,${imageData.b64_json}`;
  }
  if (imageData.url) {
    return imageData.url;
  }

  throw new Error("No image data returned");
}

async function generateGeminiIllustration(prompt: string): Promise<string> {
  if (!gemini) {
    throw new Error("GEMINI_API_KEY is required when IMAGE_PROVIDER is google.");
  }

  const response = await gemini.models.generateContent({
    model: geminiImageModel,
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    config: {
      responseModalities: ["TEXT", "IMAGE"],
    } as any,
  });

  const image = extractGeminiImage(response);
  if (!image) {
    throw new Error("Gemini Nano Banana did not return image data");
  }

  return `data:${image.mimeType};base64,${image.base64}`;
}

function extractGeminiImage(response: unknown): { mimeType: string; base64: string } | null {
  if (!response || typeof response !== "object") return null;
  const candidates = (response as { candidates?: unknown }).candidates;
  if (!Array.isArray(candidates)) return null;

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") continue;
    const content = (candidate as { content?: unknown }).content;
    if (!content || typeof content !== "object") continue;
    const parts = (content as { parts?: unknown }).parts;
    if (!Array.isArray(parts)) continue;

    for (const part of parts) {
      if (!part || typeof part !== "object") continue;
      const inlineData = (part as { inlineData?: unknown }).inlineData;
      if (!inlineData || typeof inlineData !== "object") continue;
      const data = (inlineData as { data?: unknown }).data;
      if (typeof data !== "string" || data.length === 0) continue;
      const mimeType = (inlineData as { mimeType?: unknown }).mimeType;
      return {
        mimeType: typeof mimeType === "string" ? mimeType : "image/png",
        base64: data,
      };
    }
  }

  return null;
}

export async function generateIllustration(
  pageText: string,
  style: string,
  recipientName: string,
  theme: string,
  pageNumber: number,
  totalPages: number
): Promise<string> {
  const prompt = buildIllustrationPrompt(pageText, style, recipientName, theme, pageNumber, totalPages);

  if (imageProvider === "google" || imageProvider === "gemini") {
    return generateGeminiIllustration(prompt);
  }

  return generateOpenAIIllustration(prompt);
}
