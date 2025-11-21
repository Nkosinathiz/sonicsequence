import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AlbumData, SequenceResult } from "../types";

export const sequenceAlbum = async (albumData: AlbumData): Promise<SequenceResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      sequencedTracks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            trackNumber: { type: Type.NUMBER, description: "The new track number (1-based index)" },
            title: { type: Type.STRING, description: "The title of the track" },
            reasoning: { type: Type.STRING, description: "Why this track is placed here (e.g., 'Sets the tone', 'High energy peak', 'Soft closer')" },
            transitionNote: { type: Type.STRING, description: "How this track transitions into the next one (or closes the album)" }
          },
          required: ["trackNumber", "title", "reasoning"]
        }
      },
      albumAnalysis: { type: Type.STRING, description: "A short paragraph describing the overall vibe and flow of the new sequence." },
      narrativeArc: { type: Type.STRING, description: "A poetic description of the journey the listener takes." }
    },
    required: ["sequencedTracks", "albumAnalysis", "narrativeArc"]
  };

  const prompt = `
    Act as a world-class music producer and mastering engineer.
    I have an album that needs sequencing. I will provide the artist, title, genre, and a list of unordered track titles.
    
    Your goal is to create the perfect tracklist order (sequence) to maximize emotional impact, flow, and listener retention.
    Infer the likely mood, tempo, and energy of the songs based on their titles and the genre.
    
    Album Details:
    Artist: ${albumData.artist}
    Title: ${albumData.title}
    Genre: ${albumData.genre || "Unspecified"}
    
    Unordered Tracks:
    ${albumData.tracks.map(t => `- ${t.title}`).join('\n')}
    
    Please reorder these tracks into a cohesive album structure. Consider standard sequencing techniques (e.g., strong opener, varying energy levels, emotional climax, resolution).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        thinkingConfig: {
          thinkingBudget: 32768
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from Gemini.");
    }

    const result = JSON.parse(response.text) as SequenceResult;
    return result;

  } catch (error) {
    console.error("Gemini Sequencing Error:", error);
    throw error;
  }
};