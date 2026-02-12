
import { createClient } from '@supabase/supabase-js';
import { ResumeData, User, PlanType } from '../types';

const SUPABASE_URL = 'https://rglluccyiptoyvskjrvj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_kJL-fSkf_5hwPCSRZL2GNQ_wotHWoGO';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Regex simples para verificar se é um UUID v4
const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

export const supabaseService = {
  // Resumes
  async getResumes(userId: string): Promise<ResumeData[]> {
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
  },

  async saveResume(userId: string, resume: ResumeData) {
    const { id, ...content } = resume;
    
    // Se o ID não for um UUID válido, deixamos o Supabase gerar um novo no insert
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

  // Profile / Plan
  async getProfile(userId: string): Promise<{ name: string, plan: PlanType } | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('name, plan')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') return null;
    return data;
  },

  async updateProfile(userId: string, updates: { name?: string, plan?: PlanType }) {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() });
    
    if (error) throw error;
  }
};
