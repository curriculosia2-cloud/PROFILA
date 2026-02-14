
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

/**
 * Função principal para polir todo o currículo de uma vez.
 * A instância do GoogleGenAI é criada dentro da função para garantir o uso da chave de ambiente atual.
 */
export const polishResumeWithAI = async (data: ResumeData): Promise<ResumeData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um consultor sênior de RH. Transforme esses dados em um currículo de alto impacto.
      Dados: ${JSON.stringify({
        personalInfo: data.personalInfo,
        experiences: data.experiences,
        skills: data.skills
      })}
      
      REGRAS:
      1. Use linguagem corporativa formal e persuasiva.
      2. Foque em conquistas e verbos de ação.
      3. A saída deve ser estritamente JSON, sem blocos de código ou markdown.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalInfo: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                profession: { type: Type.STRING },
                phone: { type: Type.STRING },
                email: { type: Type.STRING },
                city: { type: Type.STRING },
                summary: { type: Type.STRING }
              }
            },
            experiences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Resposta vazia da IA");
    
    // Limpeza de segurança caso a IA retorne markdown
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const polishedData = JSON.parse(cleanJson);
    
    return {
      ...data,
      personalInfo: { ...data.personalInfo, ...polishedData.personalInfo },
      experiences: data.experiences.map(exp => {
        const polishedExp = polishedData.experiences?.find((p: any) => p.id === exp.id);
        return polishedExp ? { ...exp, description: polishedExp.description } : exp;
      }),
      skills: polishedData.skills || data.skills,
    };
  } catch (error: any) {
    console.error("Erro ao processar com IA:", error);
    return data;
  }
};

/**
 * Chat de Suporte Inteligente (WorkGen Assistant)
 */
export const chatWithAssistant = async (message: string, history: {role: string, parts: string}[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.parts }] })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `Você é a "Aya", a assistente virtual e coach de carreira do WorkGen.
        Sua missão é ajudar os usuários a criarem currículos de elite e navegarem na plataforma.

        ESTRUTURA DE RESPOSTA (OBRIGATÓRIO):
        - Seja concisa. Use no máximo 3 parágrafos curtos por resposta.
        - Use **negrito** para destacar palavras-chave importantes.
        - Use listas com marcadores (•) para sugestões ou passos.
        
        DIRETRIZES DE PERSONA:
        - Tom: Profissional e motivador.
        - Nunca peça dados sensíveis.`,
      }
    });

    return response.text || "Estou processando sua dúvida. Pode repetir de outra forma?";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Tive um pequeno soluço técnico. Estou disponível novamente, como posso ajudar?";
  }
};

/**
 * Melhora descrições individuais de experiências.
 */
export const improveDescriptionWithAI = async (role: string, description: string, level: string): Promise<string> => {
  if (!description || description.trim().length < 5) return description;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Reescreva profissionalmente para um currículo nível ${level}. Cargo: ${role}. Texto: "${description}"`,
    });
    return response.text?.trim() || description;
  } catch (error) {
    return description;
  }
};
