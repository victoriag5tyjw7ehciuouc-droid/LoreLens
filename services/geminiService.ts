
import { GoogleGenAI, Modality, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { DecipherResult, AppLanguage, HistoryItem, DailyRecapResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const LANGUAGE_NAMES: Record<AppLanguage, string> = {
  en: "English",
  zh: "Simplified Chinese",
  ja: "Japanese",
  es: "Spanish",
  fr: "French"
};

const parseDecipherResponse = (response: any): DecipherResult => {
    const text = response.text;
    if (!text) throw new Error("No text response from AI");

    // Extract Google Maps URI if available from grounding metadata
    let mapUri: string | undefined;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
        // Look for maps URI first, then web URI
        const mapChunk = groundingChunks.find((c: any) => c.maps?.uri);
        if (mapChunk) {
            mapUri = mapChunk.maps.uri;
        } else {
            const webChunk = groundingChunks.find((c: any) => c.web?.uri);
            if (webChunk) mapUri = webChunk.web.uri;
        }
    }

    // Robust JSON extraction
    let jsonString = text.trim();
    const firstBrace = jsonString.indexOf('{');
    const lastBrace = jsonString.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonString = jsonString.substring(firstBrace, lastBrace + 1);
    } else {
        jsonString = jsonString.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '');
    }
    
    const result = JSON.parse(jsonString) as DecipherResult;
    if (mapUri) {
        result.mapUri = mapUri;
    }
    
    return result;
};

export const decipherImage = async (
  base64Image: string, 
  location?: { lat: number; lng: number },
  language: AppLanguage = 'en'
): Promise<DecipherResult> => {
  // Remove data URL prefix if present
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");
  const targetLanguage = LANGUAGE_NAMES[language];

  // Helper to construct and execute the request
  const attemptDecipher = async (useMaps: boolean) => {
      const tools = useMaps ? [{ googleMaps: {} }] : undefined;
      const toolConfig = (useMaps && location) ? {
          retrievalConfig: {
              latLng: {
                  latitude: location.lat,
                  longitude: location.lng
              }
          }
      } : undefined;

      return await ai.models.generateContent({
        model: "gemini-2.5-flash", 
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: cleanBase64,
              },
            },
            {
              text: `You are 'Context Lens', a cross-cultural interpreter. 
              Identify the object in the image (likely a Chinese cultural artifact, building, or detail).
              
              ${useMaps ? "Use the googleMaps tool to check if this is a known landmark nearby." : ""}
              
              Provide a response in strict JSON format. 
              CRITICAL: The content of the JSON must be written in ${targetLanguage}.
              
              The JSON object must have these keys:
              - title: The name of the object.
              - essence: A single, punchy sentence explaining 'What is this?'.
              - mirrorInsight: A cross-cultural analogy comparing this to a concept familiar to a speaker of ${targetLanguage}.
              - philosophy: The deeper cultural logic or historical function.
              - quickAction: A suggestion for the user (e.g. 'Look for the...').
              
              Do not include any text outside the JSON.`,
            },
          ],
        },
        config: {
          tools: tools,
          toolConfig: toolConfig,
          safetySettings: [
              { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
              { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
              { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
              { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          ],
        },
      });
  };

  try {
      // Attempt 1: With Maps Grounding (if location exists)
      try {
          // If no location, skip maps immediately to save latency/errors
          if (!location) throw new Error("No location");
          
          const response = await attemptDecipher(true);
          return parseDecipherResponse(response);
      } catch (primaryError) {
          // Attempt 2: Fallback without Maps (Pure Image Analysis)
          console.warn("Primary analysis failed (Maps/500), retrying without maps...", primaryError);
          const response = await attemptDecipher(false);
          return parseDecipherResponse(response);
      }
  } catch (finalError) {
      console.error("Gemini Analysis Failed:", finalError);
      throw new Error("Could not interpret the image. Please try again.");
  }
};

export const generateSpeech = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio data returned");
    }

    return base64Audio;
  } catch (error) {
    console.error("TTS Generation Failed:", error);
    throw error;
  }
};

export const generateDailyRecap = async (items: HistoryItem[], language: AppLanguage): Promise<DailyRecapResult> => {
  if (items.length === 0) throw new Error("No items to recap");
  
  const langName = LANGUAGE_NAMES[language];
  const itemDescriptions = items
    .map((item, index) => `${index + 1}. ${item.title}: ${item.essence}.`)
    .join('\n');

  try {
      const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: {
              parts: [{
                  text: `You are a philosopher and cultural analyst looking at a traveler's discoveries in Beijing.
                  
                  Here are the items they discovered today:
                  ${itemDescriptions}
                  
                  Analyze their "Resonance" with the city. 
                  - If they looked at architecture, maybe they prefer "static history".
                  - If they looked at people/food, maybe they prefer "living culture".
                  - If mixed, maybe they are a "holistic observer".
                  
                  Please create a "Daily Recap" card in valid JSON format.
                  The content must be written in ${langName}.
                  
                  The JSON object must have these keys:
                  - journal: A poetic travel journal entry (under 100 words). First-person.
                  - score: A number (1-100) representing "Cultural Resonance" based on diversity and depth of items.
                  - mood: A single descriptive word for the mood.
                  - tags: An array of 3-5 short hashtags.
                  - archetype: A cool title for the user based on their finds (e.g. "The Socratic Observer", "The Urban Poet", "The Historian").
                  - philosophicalTake: A direct, deep 2-sentence comment to the user about their observation style (e.g., "You tend to find silence in the noise...").
                  `
              }]
          },
          config: {
              responseMimeType: "application/json"
          }
      });
      
      const text = response.text;
      if (!text) throw new Error("No response from AI");
      
      return JSON.parse(text) as DailyRecapResult;
  } catch (error) {
      console.error("Recap Generation Failed:", error);
      // Fallback
      return {
          journal: "Today was a journey of discovery through the city's veins.",
          score: 88,
          mood: "Serene",
          tags: ["History", "Architecture", "Soul"],
          archetype: "The Silent Wanderer",
          philosophicalTake: "You have a keen eye for the structures that withstand time, preferring the eternal over the ephemeral."
      };
  }
};
