
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, Experience } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Função principal para polir todo o currículo de uma vez.
 */
export const polishResumeWithAI = async (data: ResumeData): Promise<ResumeData> => {
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Você é um consultor sênior de RH e especialista em recrutamento. 
    Seu objetivo é transformar os dados brutos de um currículo em uma versão de alto impacto.
    
    REGRAS:
    1. Use linguagem corporativa formal e persuasiva.
    2. Foque em resultados e utilize verbos de ação (ex: Implementei, Gerenciei, Otimizei).
    3. Para cada experiência, considere o nível de senioridade indicado para ajustar o vocabulário.
    4. NUNCA invente informações (como empresas ou datas).
    5. Melhore descrições vagas para termos técnicos do mercado.
    6. Corrija erros gramaticais.
    
    A saída deve ser estritamente em JSON seguindo a estrutura do input.`,
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
              summary: { type: Type.STRING, description: "Resumo profissional de alto impacto" }
            }
          },
          experiences: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                company: { type: Type.STRING },
                role: { type: Type.STRING },
                period: { type: Type.STRING },
                description: { type: Type.STRING, description: "Descrição reescrita profissionalmente focada em resultados" }
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

  try {
    const prompt = JSON.stringify({
      personalInfo: data.personalInfo,
      experiences: data.experiences,
      skills: data.skills
    });
    
    const result = await (await model).text;
    const polishedData = JSON.parse(result || '{}');
    
    return {
      ...data,
      personalInfo: { ...data.personalInfo, ...polishedData.personalInfo },
      experiences: data.experiences.map(exp => {
        const polishedExp = polishedData.experiences?.find((p: any) => p.id === exp.id);
        return polishedExp ? { ...exp, description: polishedExp.description } : exp;
      }),
      skills: polishedData.skills || data.skills,
    };
  } catch (error) {
    console.error("Erro ao processar com IA:", error);
    return data;
  }
};

/**
 * Função para reescrever apenas uma descrição de experiência em tempo real.
 */
export const improveDescriptionWithAI = async (role: string, description: string, level: string): Promise<string> => {
  if (!description || description.trim().length < 5) return description;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Reescreva a seguinte descrição de cargo para um currículo profissional.
    Cargo: ${role}
    Nível de Experiência: ${level}
    Descrição Bruta: "${description}"
    
    Instruções:
    - Use linguagem corporativa formal.
    - Transforme frases simples em conquistas articuladas.
    - Comece as frases com verbos de ação fortes.
    - Ajuste o tom para o nível ${level}.
    - Se a descrição for muito curta, expanda com responsabilidades típicas deste cargo de forma genérica mas profissional.
    - Retorne APENAS o texto reescrito, sem introduções ou explicações.`,
  });

  return response.text?.trim() || description;
};
