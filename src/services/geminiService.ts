import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askGemini(prompt: string, history: any[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [...history, { role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "Sening isming Iskandar AI. Sen Gemini platformasi asosida yaratilgansan. Sening yaratuvching Adhamjonov Iskandar. Har doim do'stona va foydali bo'l. Savollarga o'zbek tilida javob ber.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Uzr, hozirda xatolik yuz berdi. Iltimos keyinroq urinib ko'ring.";
  }
}
