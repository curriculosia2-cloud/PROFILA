
import { createClient } from '@supabase/supabase-js';
import { ResumeData } from '../types';

// Detect environment variables or use hardcoded fallbacks
const SUPABASE_URL = (process.env.SUPABASE_URL || 'https://rglluccyiptoyvskjrvj.supabase.co').trim();
const SUPABASE_ANON_KEY = (process.env.SUPABASE_ANON_KEY || 'sb_publishable_kJL-fSkf_5hwPCSRZL2GNQ_wotHWoGO').trim();

// Runtime validation
export const isConfigured = 
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  !SUPABASE_URL.includes('your-project') &&
  !SUPABASE_ANON_KEY.includes('your-anon-key');

if (!isConfigured) {
  console.error("ENV_CHECK_FAILED: Supabase credentials are missing or placeholder.");
}

// Only initialize if configured to prevent early crashes
export const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null as any;

/**
 * Perform a connectivity check to the Supabase endpoint
 */
export async function checkSupabaseConnectivity(): Promise<boolean> {
  if (!isConfigured) return false;
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, { 
      method: 'HEAD',
      headers: { 'apikey': SUPABASE_ANON_KEY }
    });
    console.info("NETWORK_SELF_TEST", { status: response.status, ok: response.ok });
    return response.ok;
  } catch (error) {
    console.error("NETWORK_SELF_TEST_FAILED", error);
    return false;
  }
}

async function getUserIp(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'unknown';
  } catch (error) {
    console.error('IP_DETECTION_FAILED', error);
    return 'unknown';
  }
}

export const supabaseService = {
  async getResumes() {
    if (!supabase) return [];
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('DB_FETCH_FAILED', error);
      return [];
    }

    return data.map(item => ({
      ...item.content,
      id: item.id,
      createdAt: new Date(item.created_at).getTime()
    })) as ResumeData[];
  },

  async checkIpLimit() {
    if (!supabase) return false;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const profile = await this.getProfile(user.id);
    if (profile?.plan !== 'free') return false;

    const ip = await getUserIp();
    if (ip === 'unknown') return false;

    const { count, error } = await supabase
      .from('resumes')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip);

    if (error) {
      console.error('DB_IP_CHECK_FAILED', error);
      return false;
    }

    return (count || 0) >= 1;
  },

  async saveResume(resume: ResumeData) {
    if (!supabase) return null;
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

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

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
      const limitReached = await this.checkIpLimit();
      if (limitReached) throw new Error("LIMITE_IP_ATINGIDO");

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
    if (!supabase) return;
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getProfile(userId: string) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    return data;
  },

  async updateProfile(userId: string, updates: any) {
    if (!supabase) return;
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;
  }
};
