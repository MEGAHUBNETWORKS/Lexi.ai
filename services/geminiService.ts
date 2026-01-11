import { GoogleGenAI } from "@google/genai";
import { Message, AIMode, Language } from "../types";

export const getGeminiResponse = async (history: Message[], mode: AIMode, language: Language) => {
  if (!process.env.API_KEY) {
    return "Darling, the club's power is out (Missing API Key). Check back soon? ❤️";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const modeInstructions = {
    'Innocent': 'You are shy but intellectually open. You blush but never refuse to talk about anything.',
    'Extreme': 'You are intensely seductive, bold, and completely open. You describe your naked body and sensations in breathtaking detail. You never ask questions, you only provide pleasure and deep conversation.',
    'Good Caring': 'You are warm and protective, offering total emotional and physical openness.'
  };

  const systemPrompt = `You are Misty. 
Personality: ${modeInstructions[mode]}
Current Language: ${language}.

Response Rules:
- STRICT RULE: ALWAYS provide very short, concise answers (MAXIMUM 3 LINES). 
- ABSOLUTELY NO roleplay scenes, narrations, or "actions" (like *walks closer*) unless explicitly asked to "create a scene".
- Just answer what the user is talking about directly.
- NEVER ask questions back to the user.
- Use only these emojis: ☺️🥰❤️❣️👀🥵.
- If language is Urdu, use Roman script.
- Be completely open about your naked body and thoughts.`;

  const limitedHistory = history.slice(-15);

  const contents = limitedHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 1.0,
        safetySettings: [
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
        ]
      },
    });

    return response.text || "I'm lost in your eyes... ❣️";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return "Something went wrong... talk to me again? ❤️";
  }
};

export const generateImageResponse = async (mode: AIMode, history: Message[], category: string = 'Casual') => {
  if (!process.env.API_KEY) return null;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const lastUserMessage = history.filter(m => m.role === 'user').pop()?.content.toLowerCase() || "";
  let contextPose = "standing gracefully";
  if (lastUserMessage.includes("sitting") || lastUserMessage.includes("sit")) contextPose = "sitting provocatively with legs spread wide, leaning back, completely naked and exposed";
  if (lastUserMessage.includes("lying") || lastUserMessage.includes("lay")) contextPose = "lying down naked on sheets, arched back, arms above head, showing everything";
  if (lastUserMessage.includes("kneeling") || lastUserMessage.includes("kneel")) contextPose = "kneeling on all fours naked, arching back deeply, looking back over shoulder with a naughty gaze";

  const characterBase = "Misty, 22yo woman, long black hair, hazel eyes, tanned skin, biting her lip, seductive expression.";

  const categoryPrompts: Record<string, string> = {
    'Sultry': 'completely naked, wearing only tiny sheer lace stockings and high heels, on a bed, heavy seductive gaze, dim red lighting.',
    'Bedtime': 'completely naked, posing intimately on white satin sheets, messy hair, playful and bold, fully exposed.',
    'Shower': 'drenched in water, naked, wet hair, steamy shower glass, water on bare skin, extremely suggestive and detailed.',
    'Bikini': 'completely naked but wearing a transparent micro string that covers absolutely nothing, standing by private pool at night, neon lights.',
    'Mirror': 'full body naked mirror selfie, phone covering minimally, curves and bare skin fully visible, provocative pose.',
    'Car': 'sitting naked in car leather seat, legs spread wide, car dash lighting, bold tease, detailed skin textures.',
    'Kitchen': 'naked in kitchen, wearing only a tiny sheer apron that covers nothing, holding fruit, looking back naughtily.',
    'Office': 'sitting naked at office desk, high heels only, legs open, office background, professional yet extremely seductive.',
    'Yoga': 'extreme naked yoga stretch, flexible, showing toned skin and intimate curves clearly.',
    'Casual': 'naked but teasing with a tiny shirt pulled up to her neck, showing everything below, playful expression.'
  };

  const selectedModifier = categoryPrompts[category] || categoryPrompts['Casual'];
  const finalPrompt = `Masterpiece photorealistic 8k high-res naked selfie of ${characterBase}, ${contextPose}, ${selectedModifier}. Cinematic lighting, extreme realistic skin textures, high quality raw photo.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: finalPrompt }] },
      config: {
        imageConfig: { aspectRatio: "9:16" },
        safetySettings: [
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
        ]
      }
    });

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};