
// Fix: Use namespace import to correctly populate global JSX.IntrinsicElements
import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute } from '../types';
import { Mail, ArrowLeft, Loader2, CheckCircle, Send } from 'lucide-react';
import { supabase } from '../services/supabase';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // redirectTo must be configured in Supabase Auth settings
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/#/reset-password',
    });

    if (authError) {
      setError("Não foi possível processar sua solicitação agora. Tente novamente.");
    } else {
      setMessage("Se este email estiver em nossa base, você receberá um link de recuperação em instantes.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full">
        <Link to={AppRoute.LOGIN} className="inline-flex items-center text-slate-400 font-bold text-xs uppercase tracking-widest mb-8 hover:text-brand-dark transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Login
        </Link>
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-brand-dark tracking-tighter">Recuperar <br/><span className="text-brand-blue">Acesso</span></h2>
                <p className="text-slate-500 mt-4 font-medium leading-relaxed">Não se preocupe, acontece com os melhores profissionais.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold text-center border border-red-100">
                    {error}
                </div>
            )}

            {message ? (
                <div className="text-center p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 animate-in fade-in zoom-in duration-500">
                    <div className="bg-brand-blue w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-blue-500/20">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-black text-brand-dark mb-2">Verifique sua Caixa</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{message}</p>
                    <Link to={AppRoute.LOGIN} className="mt-8 inline-block text-[10px] font-black uppercase tracking-widest text-brand-blue hover:underline">Ir para Login</Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Seu Email Cadastrado</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                            <input 
                                type="email" required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium"
                                placeholder="email@exemplo.com"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-blue text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><Send className="mr-3 h-4 w-4" /> ENVIAR LINK SEGURO</>}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
