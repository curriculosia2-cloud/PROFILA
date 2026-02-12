
import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute } from '../types';
import { Mail, CheckCircle, ArrowLeft, Loader2, Send } from 'lucide-react';

interface VerifyEmailProps {
  userEmail?: string;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ userEmail }) => {
  const [resending, setResending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setSent(true);
      setResending(false);
      setTimeout(() => setSent(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-md w-full">
        <Link to={AppRoute.LOGIN} className="inline-flex items-center text-slate-400 font-bold text-xs uppercase tracking-widest mb-8 hover:text-brand-dark dark:hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Login
        </Link>
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl p-12 border border-slate-100 dark:border-slate-800 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner text-brand-blue">
                <Mail size={40} />
            </div>
            
            <h2 className="text-4xl font-black text-brand-dark dark:text-white tracking-tighter mb-4">Confirme seu <span className="text-brand-blue">E-mail</span></h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
                Enviamos um link de confirmação para {userEmail ? <strong className="text-brand-dark dark:text-white">{userEmail}</strong> : 'seu e-mail'}.<br/>
                Esta é uma etapa importante para garantir a segurança da sua conta.
            </p>

            <div className="space-y-4">
                <button 
                    onClick={handleResend}
                    disabled={resending}
                    className="w-full bg-brand-blue text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 group"
                >
                    {resending ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                    ) : sent ? (
                        <><CheckCircle className="mr-3 h-5 w-5" /> E-MAIL REENVIADO!</>
                    ) : (
                        <><Send className="mr-3 h-4 w-4" /> REENVIAR CONFIRMAÇÃO</>
                    )}
                </button>
            </div>

            <div className="mt-12 pt-10 border-t border-slate-50 dark:border-slate-800">
                <Link to={AppRoute.LOGIN} className="text-brand-blue font-black uppercase tracking-widest text-xs hover:underline">
                    Já confirmou? Clique aqui para entrar
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
