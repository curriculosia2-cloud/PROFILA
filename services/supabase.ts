
import { createClient } from '@supabase/supabase-js';
import { ResumeData, User, PlanType } from '../types';

// Credenciais do seu Projeto Supabase
const SUPABASE_URL = 'https://rglluccyiptoyvskjrvj.supabase.co';

/**
 * NOTA: A chave 'sb_publishable_...' que você forneceu parece ser do Stripe.
 * Para o banco de dados funcionar, use a chave 'anon public' do Supabase (começa com eyJ...).
 * Local: Supabase Dashboard -> Project Settings -> API -> anon public
 */
const SUPABASE_ANON_KEY = 'sb_publishable_kJL-fSkf_5hwPCSRZL2GNQ_wotHWoGO';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Regex para verificar UUID
const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

export const supabaseService = {
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
      console.warn("Erro ao buscar currículos:", err);
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

  async getProfile(userId: string): Promise<{ name: string, plan: PlanType } | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('name, plan')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data;
  },

  async updateProfile(userId: string, updates: { name?: string, plan?: PlanType }) {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() });
    if (error) throw error;
  },

  async resendConfirmationEmail(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    if (error) throw error;
  }
};
