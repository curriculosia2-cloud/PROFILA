
// Fix: Use namespace import to correctly populate global JSX.IntrinsicElements
import * as React from 'react';
import { X, Check, Crown, Zap, Star } from 'lucide-react';
import { PlanType, PLANS } from '../types';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PlanType;
  onUpgrade: (plan: PlanType) => void;
}

const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose, currentPlan, onUpgrade }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-dark/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <div className="p-12 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-4xl font-black text-brand-dark tracking-tighter">Acelere sua <span className="text-brand-blue">Contratação</span></h2>
            <p className="text-slate-500 mt-2 font-medium">Planos desenhados para destacar seu talento no mercado.</p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-brand-dark">
            <X size={28} />
          </button>
        </div>

        <div className="p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {(Object.keys(PLANS) as PlanType[]).map((planId) => {
            const plan = PLANS[planId];
            const isCurrent = currentPlan === planId;
            const isPremium = planId === 'premium';
            const isPro = planId === 'pro';

            return (
              <div 
                key={planId} 
                className={`p-10 rounded-[2.5rem] border-2 flex flex-col transition-all duration-500 relative ${isCurrent ? 'border-brand-blue bg-blue-50/20' : isPro ? 'border-brand-blue bg-white shadow-2xl scale-105' : isPremium ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 hover:border-slate-200'}`}
              >
                {isPro && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center">
                        <Star size={12} className="mr-2 fill-white" /> Mais Popular
                    </div>
                )}

                <div className="mb-10">
                  <h3 className={`text-xl font-black uppercase tracking-widest ${isPremium ? 'text-white' : 'text-brand-dark'}`}>
                    {planId === 'free' ? 'Básico' : planId === 'pro' ? 'Profissional' : 'Executive Elite'}
                  </h3>
                  <p className={`text-xs mt-2 font-medium ${isPremium ? 'text-slate-400' : 'text-slate-500'}`}>
                    {planId === 'free' ? 'Para experimentar o poder da IA.' : planId === 'pro' ? 'Perfeito para quem busca recolocação.' : 'Para quem busca o topo da pirâmide.'}
                  </p>
                  <div className="mt-8 flex items-baseline">
                    <span className={`text-5xl font-black ${isPremium ? 'text-white' : 'text-brand-dark'}`}>{plan.price}</span>
                    <span className={`text-xs ml-2 font-bold uppercase tracking-widest ${isPremium ? 'text-slate-400' : 'text-slate-400'}`}>/ mês</span>
                  </div>
                </div>

                <ul className="space-y-5 mb-12 flex-grow">
                  {/* Common and Specific Features */}
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
                  
                  {/* Pro & Premium Features */}
                  {(isPro || isPremium) && (
                    <>
                      <li className="flex items-start text-sm font-semibold">
                        <Check className={`h-5 w-5 mr-3 flex-shrink-0 ${isPremium ? 'text-blue-400' : 'text-brand-blue'}`} />
                        <span className={isPremium ? 'text-slate-300' : 'text-slate-600'}>Personalização de cores</span>
                      </li>
                      <li className="flex items-start text-sm font-semibold">
                        <Check className={`h-5 w-5 mr-3 flex-shrink-0 ${isPremium ? 'text-blue-400' : 'text-brand-blue'}`} />
                        <span className={isPremium ? 'text-slate-300' : 'text-slate-600'}>Foto liberada</span>
                      </li>
                      <li className="flex items-start text-sm font-semibold">
                        <Check className={`h-5 w-5 mr-3 flex-shrink-0 ${isPremium ? 'text-blue-400' : 'text-brand-blue'}`} />
                        <span className={isPremium ? 'text-slate-300' : 'text-slate-600'}>Download ilimitado</span>
                      </li>
                    </>
                  )}

                  {/* Premium Only Features */}
                  {isPremium && (
                    <>
                      <li className="flex items-start text-sm font-semibold">
                        <Zap className="h-5 w-5 mr-3 flex-shrink-0 text-yellow-400 fill-yellow-400" />
                        <span className="text-white">Ajuste fino de layout</span>
                      </li>
                      <li className="flex items-start text-sm font-semibold">
                        <Zap className="h-5 w-5 mr-3 flex-shrink-0 text-yellow-400 fill-yellow-400" />
                        <span className="text-white">IA Avançada</span>
                      </li>
                      <li className="flex items-start text-sm font-semibold">
                        <Zap className="h-5 w-5 mr-3 flex-shrink-0 text-yellow-400 fill-yellow-400" />
                        <span className="text-white">Adaptação automática p/ vaga</span>
                      </li>
                      <li className="flex items-start text-sm font-semibold">
                        <Zap className="h-5 w-5 mr-3 flex-shrink-0 text-yellow-400 fill-yellow-400" />
                        <span className="text-white">PDF Premium HD</span>
                      </li>
                      <li className="flex items-start text-sm font-semibold">
                        <Crown className="h-5 w-5 mr-3 flex-shrink-0 text-blue-400" />
                        <span className="text-white font-bold">Prioridade de processamento</span>
                      </li>
                    </>
                  )}
                </ul>

                <button
                  disabled={isCurrent}
                  onClick={() => onUpgrade(planId)}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                    isCurrent 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : isPremium 
                        ? 'bg-white text-brand-dark hover:bg-slate-100 shadow-xl shadow-white/10' 
                        : isPro
                          ? 'bg-brand-blue text-white hover:bg-blue-600 shadow-xl shadow-blue-500/20'
                          : 'bg-slate-100 text-brand-dark hover:bg-slate-200'
                  }`}
                >
                  {isCurrent ? 'Plano Ativo' : 'Escolher Este Plano'}
                </button>
              </div>
            );
          })}
        </div>
        
        <div className="p-12 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-center gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <div className="flex items-center"><Zap className="h-4 w-4 mr-2 text-brand-blue" /> Ativação Imediata</div>
            <div className="flex items-center"><Check className="h-4 w-4 mr-2 text-brand-blue" /> Pagamento 100% Seguro</div>
            <div className="flex items-center"><Star className="h-4 w-4 mr-2 text-brand-blue" /> Garantia de Satisfação</div>
        </div>
      </div>
    </div>
  );
};

export default PlanModal;