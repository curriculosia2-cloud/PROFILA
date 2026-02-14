
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Zap, Star, ArrowLeft, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { PlanType, PLANS, AppRoute, User } from '../types';
import { stripeService } from '../services/stripeService';

interface PlansPageProps {
  user: User | null;
}

const PlansPage: React.FC<PlansPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const currentPlan = user?.plan || 'free';

  const handleSubscribe = async (planId: PlanType) => {
    if (planId === 'free') return;
    if (!user) { navigate(AppRoute.LOGIN); return; }

    setLoadingPlan(planId);
    try {
      const plan = PLANS[planId];
      if (!plan.priceId || plan.priceId === '') throw new Error("Preço não configurado.");
      await stripeService.createCheckoutSession(plan.priceId);
    } catch (err: any) {
      alert(err.message || "Erro ao processar.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-20">
        <div className="inline-flex items-center space-x-2 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <Sparkles className="h-3 w-3 fill-current" />
            <span>INVESTIMENTO NO SEU FUTURO</span>
        </div>
        <h1 className="text-5xl font-black text-brand-dark dark:text-white tracking-tighter mb-6 font-display">Escolha o plano para <br/><span className="text-transparent bg-clip-text bg-gradient-brand">o seu próximo nível.</span></h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
          Crie currículos ilimitados e acesse modelos premium para se destacar no mercado global.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {(Object.keys(PLANS) as PlanType[]).map((planId) => {
          const plan = PLANS[planId];
          const isCurrent = currentPlan === planId;
          const isPro = planId === 'pro';
          const isPremium = planId === 'premium';

          return (
            <div 
              key={planId} 
              className={`p-10 rounded-[3rem] border-2 flex flex-col transition-all duration-500 relative ${isCurrent ? 'border-brand-blue bg-blue-50/20 dark:bg-blue-900/10' : isPro ? 'border-brand-purple bg-white dark:bg-slate-900 shadow-2xl scale-105 z-10' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm'}`}
            >
              {isPro && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-brand text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center">
                  <Star size={12} className="mr-2 fill-white" /> MAIS ESCOLHIDO
                </div>
              )}

              <div className="mb-10 text-center">
                <h3 className="text-xl font-black uppercase tracking-[0.2em] text-slate-400 mb-6">{plan.name}</h3>
                <div className="flex justify-center items-baseline">
                  <span className="text-5xl font-black dark:text-white">{plan.price}</span>
                  <span className="text-xs ml-2 font-black uppercase tracking-widest text-slate-400">/mês</span>
                </div>
              </div>

              <ul className="space-y-5 mb-12 flex-grow">
                <li className="flex items-start text-sm font-bold text-slate-600 dark:text-slate-300">
                  {/* Fixed: CheckCircle was missing from imports */}
                  <CheckCircle className="h-5 w-5 mr-3 text-brand-accent flex-shrink-0" />
                  {planId === 'free' ? '1 currículo' : planId === 'pro' ? '5 currículos' : 'Currículos ilimitados'}
                </li>
                <li className="flex items-start text-sm font-bold text-slate-600 dark:text-slate-300">
                  {/* Fixed: CheckCircle was missing from imports */}
                  <CheckCircle className="h-5 w-5 mr-3 text-brand-accent flex-shrink-0" />
                  {plan.hasWatermark ? 'Com marca d’água' : 'Sem marca d’água'}
                </li>
                <li className="flex items-start text-sm font-bold text-slate-600 dark:text-slate-300">
                  {/* Fixed: CheckCircle was missing from imports */}
                  <CheckCircle className="h-5 w-5 mr-3 text-brand-accent flex-shrink-0" />
                  {plan.templatesCount} Modelos Premium
                </li>
                {isPremium && (
                    <li className="flex items-start text-sm font-bold text-slate-300">
                        <Zap className="h-5 w-5 mr-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                        Prioridade de IA 2026
                    </li>
                )}
              </ul>

              <button
                disabled={isCurrent || (loadingPlan !== null && loadingPlan !== planId)}
                onClick={() => handleSubscribe(planId)}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center ${
                  isCurrent 
                    ? 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed' 
                    : isPro || isPremium
                      ? 'bg-gradient-brand text-white btn-glow'
                      : 'bg-slate-100 dark:bg-white/5 text-brand-dark dark:text-white'
                }`}
              >
                {loadingPlan === planId ? <Loader2 className="animate-spin h-5 w-5" /> : isCurrent ? 'PLANO ATUAL' : 'SELECIONAR'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlansPage;
