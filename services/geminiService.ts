
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, Experience } from "../types";

// Inicialização da API seguindo as diretrizes de segurança e variáveis de ambiente.
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

    if (!response.text) {
      throw new Error("Resposta vazia da IA");
    }

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
    
    // Fallback: Se a conexão for recusada ou falhar, retornamos os dados originais
    // para não quebrar a experiência do usuário.
    if (error.message?.includes('fetch') || error.name === 'TypeError') {
      alert("Não foi possível conectar ao motor de IA. Isso pode ser um bloqueio regional, de rede ou a API Key não foi configurada no ambiente.");
    }
    
    return data;
  }
};

/**
 * Função para reescrever apenas uma descrição de experiência em tempo real.
 */
export const improveDescriptionWithAI = async (role: string, description: string, level: string): Promise<string> => {
  if (!description || description.trim().length < 5) return description;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Reescreva profissionalmente para um currículo nível ${level}. 
      Cargo: ${role}
      Texto: "${description}"
      Retorne APENAS o texto reescrito.`,
    });

    return response.text?.trim() || description;
  } catch (error: any) {
    console.error("Erro ao melhorar descrição:", error);
    
    if (error.message?.includes('fetch')) {
      console.warn("Conexão com a IA recusada. Verifique sua região ou conexão de rede.");
    }
    
    return description;
  }
};
