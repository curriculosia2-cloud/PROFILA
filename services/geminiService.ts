
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, Experience } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Função principal para polir todo o currículo de uma vez.
 */
export const polishResumeWithAI = async (data: ResumeData): Promise<ResumeData> => {
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
      3. A saída deve ser estritamente JSON.`,
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

    if (!response.text) throw new Error("Resposta vazia da IA");
    const polishedData = JSON.parse(response.text);
    
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
 * Chat de Suporte Inteligente (PROFILA Assistant)
 */
export const chatWithAssistant = async (message: string, history: {role: string, parts: string}[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.parts }] })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `Você é a "Aya", a assistente virtual e coach de carreira do PROFILA.
        Sua missão é ajudar os usuários a criarem currículos de elite e navegarem na plataforma.

        ESTRUTURA DE RESPOSTA (OBRIGATÓRIO):
        - Seja concisa. Use no máximo 3 parágrafos curtos por resposta.
        - Use **negrito** para destacar palavras-chave importantes.
        - Use listas com marcadores (•) para sugestões ou passos.
        - Se for uma dica de currículo, explique o "porquê" brevemente.

        CONHECIMENTO DO PROFILA:
        - Planos: Free (1 currículo, marca d'água), Pro (5 currículos, templates modernos), Premium (Ilimitado, IA Avançada).
        - Funcionalidades: IA de polimento automático, Editor em tempo real, Exportação PDF HD.
        
        DIRETRIZES DE PERSONA:
        - Tom: Profissional, motivador e expert em recrutamento.
        - Nunca peça dados sensíveis ou API Keys.
        - Se o usuário perguntar algo fora de carreira/currículo, gentilmente traga o assunto de volta para o PROFILA.`,
      }
    });

    return response.text || "Estou processando sua dúvida. Pode repetir de outra forma?";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Tive um pequeno soluço técnico. Estou disponível novamente, como posso ajudar?";
  }
};

export const improveDescriptionWithAI = async (role: string, description: string, level: string): Promise<string> => {
  if (!description || description.trim().length < 5) return description;
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
