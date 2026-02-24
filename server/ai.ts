import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

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

export async function generateStory(input: StoryInput): Promise<Array<{ text: string; pageNumber: number }>> {
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

  const prompt = `You are a children's book author creating a personalized story. Write a children's book with EXACTLY 8 pages.

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

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content || "[]";
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
      text: `And so the adventure continued, with more wonderful memories to be made...`,
      pageNumber: pages.length + 1,
    });
  }

  pages = pages.slice(0, 10).map((p: any, i: number) => ({
    text: p.text,
    pageNumber: i + 1,
  }));

  return pages;
}

export async function generateIllustration(
  pageText: string,
  style: string,
  recipientName: string,
  theme: string,
  pageNumber: number,
  totalPages: number
): Promise<string> {
  const stylePrompts: Record<string, string> = {
    classic: "elegant traditional storybook illustration, warm oil painting style, rich colors, detailed backgrounds, classic children's book art like Beatrix Potter",
    whimsical: "bright colorful cartoon illustration, playful and fun, bold outlines, vibrant colors, cute characters, Pixar-inspired children's book style",
    modern: "clean modern digital illustration, minimalist design, flat colors with subtle gradients, geometric shapes, contemporary children's book art",
    fantasy: "magical fantasy illustration, dramatic lighting, sparkles and glowing effects, enchanted atmosphere, detailed fantasy art for children",
    family: "warm watercolor illustration, soft pastel tones, cozy family scenes, nostalgic scrapbook feel, gentle and heartfelt children's book art",
  };

  const styleDesc = stylePrompts[style] || stylePrompts.whimsical;

  const prompt = `Create a children's book illustration for page ${pageNumber} of ${totalPages}.

Story text for this page: "${pageText}"

Theme: ${theme}
Character name: ${recipientName}

Art style: ${styleDesc}

Requirements:
- Full page illustration suitable for a children's book
- No text or words in the image
- Bright, engaging, age-appropriate imagery
- Consistent character design
- Rich detailed background matching the scene described`;

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
