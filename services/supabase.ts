
import { createClient } from '@supabase/supabase-js';
import { ResumeData, User, PlanType } from '../types';

// Credenciais fornecidas pelo usuário
const SUPABASE_URL = 'https://rglluccyiptoyvskjrvj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_kJL-fSkf_5hwPCSRZL2GNQ_wotHWoGO';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Regex simples para verificar se é um UUID v4
const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

export const supabaseService = {
  // Resumes
  async getResumes(userId: string): Promise<ResumeData[]> {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(r => ({
        ...r.content,
        id: r.id,
        createdAt: new Date(r.created_at).getTime()
      }));
    } catch (err) {
      console.warn("Erro ao buscar currículos (verifique se a tabela 'resumes' existe no Supabase):", err);
      return [];
    }
  },

  async saveResume(userId: string, resume: ResumeData) {
    const { id, ...content } = resume;
    
    const payload = {
      user_id: userId,
      title: resume.title || resume.personalInfo.profession || 'Novo Currículo',
      content: content,
      updated_at: new Date().toISOString()
    };

    // Se o ID não for um UUID válido (ex: gerado no frontend com math.random), deixamos o Supabase gerar um novo
    const { data, error } = await supabase
      .from('resumes')
      .upsert(isUUID(id) ? { id, ...payload } : payload)
      .select()
      .single();

    if (error) throw error;
    return { ...data.content, id: data.id, createdAt: new Date(data.created_at).getTime() };
  },

  async deleteResume(resumeId: string) {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', resumeId);
    
    if (error) throw error;
  },

  // Profile / Plan
  async getProfile(userId: string): Promise<{ name: string, plan: PlanType } | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, plan')
        .eq('id', userId)
        .single();

      if (error) return null;
      return data;
    } catch (err) {
      return null;
    }
  },

  async updateProfile(userId: string, updates: { name?: string, plan?: PlanType }) {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() });
    
    if (error) throw error;
  },

  // Auth Extras
  async resendConfirmationEmail(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    if (error) throw error;
  }
};
