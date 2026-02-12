
export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  level: 'iniciante' | 'intermediario' | 'experiente';
}

export interface Education {
  id: string;
  course: string;
  institution: string;
  year: string;
}

export type TemplateId = 
  | 'classic' | 'clean' 
  | 'modern-column' | 'modern-blocks' | 'elegant' | 'timeline' 
  | 'tech' | 'executive' | 'creative' | 'ats-simple' | 'compact' | 'international';

export interface ResumeData {
  id: string;
  title: string;
  personalInfo: {
    fullName: string;
    profession: string;
    phone: string;
    email: string;
    city: string;
    photo?: string;
    summary?: string;
  };
  experiences: Experience[];
  education: Education[];
  skills: string[];
  customization: {
    template: TemplateId;
    primaryColor: string;
    showPhoto: boolean;
    fontFamily: string;
    lineSpacing: number;
    sectionSpacing: number;
  };
  createdAt: number;
}

export type PlanType = 'free' | 'pro' | 'premium';

export interface PlanDetails {
  id: PlanType;
  name: string;
  price: string;
  maxResumes: number;
  hasWatermark: boolean;
  templatesCount: number;
  advancedCustomization: boolean;
  aiPriority: boolean;
}

export const PLANS: Record<PlanType, PlanDetails> = {
  free: {
    id: 'free',
    name: 'Gratuito',
    price: 'R$ 0',
    maxResumes: 1,
    hasWatermark: true,
    templatesCount: 2,
    advancedCustomization: false,
    aiPriority: false
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 29,90',
    maxResumes: 5,
    hasWatermark: false,
    templatesCount: 6,
    advancedCustomization: true,
    aiPriority: false
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 'R$ 49,90',
    maxResumes: Infinity,
    hasWatermark: false,
    templatesCount: 12,
    advancedCustomization: true,
    aiPriority: true
  }
};

export interface User {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
}

export enum AppRoute {
  LANDING = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  DASHBOARD = '/dashboard',
  CREATE = '/create',
  CUSTOMIZE = '/customize',
  EXPORT = '/export'
}
