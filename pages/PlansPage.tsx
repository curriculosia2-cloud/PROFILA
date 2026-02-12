
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Zap, Star, ArrowLeft, Loader2 } from 'lucide-react';
import { PlanType, PLANS, AppRoute } from '../types';
import { stripeService } from '../services/stripeService';

interface PlansPageProps {
  currentPlan: PlanType;
  subscriptionStatus: string;
}

const PlansPage: React.FC<PlansPageProps> = ({ currentPlan, subscriptionStatus }) => {
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: PlanType) => {
    if (planId === 'free') return;
    
    setLoadingPlan(planId);
    try {
      const plan = PLANS[planId];
      await stripeService.createCheckoutSession(plan.priceId);
    } catch (err) {
      console.error("Erro ao iniciar checkout:", err);
      alert("Erro ao processar pagamento. Tente novamente mais tarde.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-500">
      <div className="mb-12">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-brand-dark transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </button>
      </div>

      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-brand-dark tracking-tighter mb-4">Escolha seu <span className="text-brand-blue">Plano</span></h1>
        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
          Desbloqueie o poder total da inteligência artificial e destaque-se na multidão com currículos de nível executivo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {(Object.keys(PLANS) as PlanType[]).map((planId) => {
          const plan = PLANS[planId];
          const isCurrent = currentPlan === planId && subscriptionStatus === 'active';
          const isPremium = planId === 'premium';
          const isPro = planId === 'pro';

          return (
            <div 
              key={planId} 
              className={`p-10 rounded-[3rem] border-2 flex flex-col transition-all duration-500 relative ${isCurrent ? 'border-brand-blue bg-blue-50/20' : isPro ? 'border-brand-blue bg-white shadow-2xl scale-105' : isPremium ? 'border-slate-900 bg-slate-900 text-white shadow-xl' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
            >
              {isPro && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center z-10">
                  <Star size={12} className="mr-2 fill-white" /> Mais Popular
                </div>
              )}

              <div className="mb-10">
                <h3 className={`text-xl font-black uppercase tracking-widest ${isPremium ? 'text-white' : 'text-brand-dark'}`}>
                  {planId === 'free' ? 'Básico' : planId === 'pro' ? 'Profissional' : 'Executive Elite'}
                </h3>
                <div className="mt-8 flex items-baseline">
                  <span className={`text-5xl font-black ${isPremium ? 'text-white' : 'text-brand-dark'}`}>{plan.price}</span>
                  <span className={`text-xs ml-2 font-bold uppercase tracking-widest ${isPremium ? 'text-slate-400' : 'text-slate-400'}`}>/ mês</span>
                </div>
              </div>

              <ul className="space-y-5 mb-12 flex-grow">
                <li className="flex items-start text-sm font-semibold">
                  <Check className={`h-5 w-5 mr-3 flex-shrink-0 ${isPremium ? 'text-blue-400' : 'text-brand-blue'}`} />
                  <span className={isPremium ? 'text-slate-300' : 'text-slate-600'}>
                    {planId === 'free' ? '1 currículo' : planId === 'pro' ? '5 currículos' : 'Currículos ilimitados'}
                  </span>
                </li>
                <li className="flex items-start text-sm font-semibold">
                  <Check className={`h-5 w-5 mr-3 flex-shrink-0 ${isPremium ? 'text-blue-400' : 'text-brand-blue'}`} />
                  <span className={isPremium ? 'text-slate-300' : 'text-slate-600'}>
                    {plan.hasWatermark ? 'Com marca d’água' : 'Sem marca d’água'}
                  </span>
                </li>
                <li className="flex items-start text-sm font-semibold">
                  <Check className={`h-5 w-5 mr-3 flex-shrink-0 ${isPremium ? 'text-blue-400' : 'text-brand-blue'}`} />
                  <span className={isPremium ? 'text-slate-300' : 'text-slate-600'}>
                    {plan.templatesCount} Templates {isPremium ? 'exclusivos' : ''}
                  </span>
                </li>
                
                {(isPro || isPremium) && (
                  <>
                    <li className="flex items-start text-sm font-semibold">
                      <Check className={`h-5 w-5 mr-3 flex-shrink-0 ${isPremium ? 'text-blue-400' : 'text-brand-blue'}`} />
                      <span className={isPremium ? 'text-slate-300' : 'text-slate-600'}>Personalização de cores</span>
                    </li>
                    <li className="flex items-start text-sm font-semibold">
                      <Check className={`h-5 w-5 mr-3 flex-shrink-0 ${isPremium ? 'text-blue-400' : 'text-brand-blue'}`} />
                      <span className={isPremium ? 'text-slate-300' : 'text-slate-600'}>Download ilimitado</span>
                    </li>
                  </>
                )}

                {isPremium && (
                  <>
                    <li className="flex items-start text-sm font-semibold">
                      <Zap className="h-5 w-5 mr-3 flex-shrink-0 text-yellow-400 fill-yellow-400" />
                      <span className="text-white">IA Avançada de Adaptação</span>
                    </li>
                    <li className="flex items-start text-sm font-semibold">
                      <Crown className="h-5 w-5 mr-3 flex-shrink-0 text-blue-400" />
                      <span className="text-white font-bold">Suporte Prioritário</span>
                    </li>
                  </>
                )}
              </ul>

              <button
                disabled={isCurrent || (loadingPlan !== null && loadingPlan !== planId)}
                onClick={() => handleSubscribe(planId)}
                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center ${
                  isCurrent 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : isPremium 
                      ? 'bg-white text-brand-dark hover:bg-slate-100 shadow-xl' 
                      : isPro
                        ? 'bg-brand-blue text-white hover:bg-blue-600 shadow-xl shadow-blue-500/20'
                        : 'bg-slate-100 text-brand-dark hover:bg-slate-200'
                }`}
              >
                {loadingPlan === planId ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : isCurrent ? (
                  'Plano Ativo'
                ) : planId === 'free' ? (
                  'Plano Grátis'
                ) : (
                  `Assinar ${plan.name}`
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlansPage;
