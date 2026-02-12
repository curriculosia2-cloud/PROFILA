
import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, PartyPopper, ArrowRight } from 'lucide-react';
import { AppRoute } from '../types';

const BillingSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona automaticamente após 5 segundos
    const timer = setTimeout(() => navigate(AppRoute.DASHBOARD), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center animate-in fade-in duration-700">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-green-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="relative bg-white p-8 rounded-[3rem] border border-green-100 shadow-2xl">
           <PartyPopper className="h-16 w-16 text-green-500" />
        </div>
        <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
           <CheckCircle size={24} />
        </div>
      </div>

      <h1 className="text-5xl font-black text-brand-dark tracking-tighter mb-4">Pagamento Confirmado!</h1>
      <p className="text-lg text-slate-500 max-w-md mx-auto font-medium leading-relaxed mb-12">
        Parabéns! Sua assinatura foi ativada com sucesso. Você agora tem acesso total às ferramentas executivas do PROFILA.
      </p>

      <button 
        onClick={() => navigate(AppRoute.DASHBOARD)}
        className="bg-brand-blue text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 flex items-center group"
      >
        IR PARA O DASHBOARD <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </button>

      <p className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
        Redirecionando automaticamente em alguns segundos...
      </p>
    </div>
  );
};

export default BillingSuccess;
