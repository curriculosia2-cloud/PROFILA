
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
    photoDataUrl?: string;
    photoShape?: 'circle' | 'rounded' | 'square';
    photoFit?: 'cover' | 'contain';
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
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing' | 'inactive';

export interface UserSubscription {
  plan: PlanType;
  status: SubscriptionStatus;
  current_period_end?: string;
  stripe_customer_id?: string;
}

export interface PlanDetails {
  id: PlanType;
  name: string;
  price: string;
  priceId: string; // Stripe Price ID
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
    priceId: '',
    maxResumes: 1,
    hasWatermark: true,
    templatesCount: 2,
    advancedCustomization: false,
    aiPriority: false
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 9,90',
    priceId: 'price_PRO_PLACEHOLDER',
    maxResumes: 5,
    hasWatermark: false,
    templatesCount: 6,
    advancedCustomization: true,
    aiPriority: false
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 'R$ 19,90',
    priceId: 'price_PREMIUM_PLACEHOLDER',
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
  subscriptionStatus: SubscriptionStatus;
  emailConfirmed?: boolean;
}

export enum AppRoute {
  LANDING = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  FORGOT_PASSWORD = '/forgot-password',
  RESET_PASSWORD = '/reset-password',
  VERIFY_EMAIL = '/verify-email',
  DASHBOARD = '/dashboard',
  CREATE = '/create',
  CUSTOMIZE = '/customize',
  EXPORT = '/export',
  PLANS = '/planos',
  BILLING_SUCCESS = '/billing/success'
}
