
import { createClient } from '@supabase/supabase-js';
import { ResumeData, User } from '../types';

const SUPABASE_URL = 'https://rglluccyiptoyvskjrvj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_kJL-fSkf_5hwPCSRZL2GNQ_wotHWoGO';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Função auxiliar para capturar o IP do usuário (usando serviço público)
async function getUserIp(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'unknown';
  } catch (error) {
    console.error('Erro ao detectar IP:', error);
    return 'unknown';
  }
}

export const supabaseService = {
  // --- RESUMES ---
  async getResumes() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar currículos:', error);
      return [];
    }

    return data.map(item => ({
      ...item.content,
      id: item.id,
      createdAt: new Date(item.created_at).getTime()
    })) as ResumeData[];
  },

  async checkIpLimit() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Busca o plano do usuário
    const profile = await this.getProfile(user.id);
    if (profile?.plan !== 'free') return false; // Planos pagos não têm limite de IP

    const ip = await getUserIp();
    if (ip === 'unknown') return false;

    // Conta currículos criados com este IP (apenas para usuários no plano free)
    const { count, error } = await supabase
      .from('resumes')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip);

    if (error) {
      console.error('Erro ao verificar limite de IP:', error);
      return false;
    }

    return (count || 0) >= 1; // Limite de 1 currículo por IP no plano grátis
  },

  async saveResume(resume: ResumeData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const ip = await getUserIp();
    const { id, createdAt, ...content } = resume;

    const resumePayload = {
      user_id: user.id,
      title: resume.title || resume.personalInfo.profession || 'Novo Currículo',
      content: content,
      ip_address: ip,
      updated_at: new Date().toISOString()
    };

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (isUuid) {
      const { data, error } = await supabase
        .from('resumes')
        .update(resumePayload)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } else {
      // Antes de inserir, verifica o limite de IP para currículos novos
      const limitReached = await this.checkIpLimit();
      if (limitReached) {
        throw new Error("LIMITE_IP_ATINGIDO");
      }

      const { data, error } = await supabase
        .from('resumes')
        .insert([{ ...resumePayload, content: { ...content, title: resumePayload.title } }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  async deleteResume(id: string) {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // --- PROFILE ---
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    return data;
  },

  async updateProfile(userId: string, updates: any) {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;
  }
};
