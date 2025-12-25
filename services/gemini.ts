
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Enhances a service description to make it more professional and persuasive.
 */
export async function enhanceDescription(title: string, basicDescription: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Melhore a seguinte descrição de serviço para um marketplace de profissionais locais. 
      Torne-a mais profissional, detalhada e atraente para clientes, destacando os benefícios.
      
      Título do Serviço: ${title}
      Descrição Básica: ${basicDescription}
      
      Retorne apenas o texto melhorado, sem introduções ou explicações.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || basicDescription;
  } catch (error) {
    console.error("Gemini Error:", error);
    return basicDescription;
  }
}
