
// Fix: Use namespace import to correctly populate global JSX.IntrinsicElements
import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import { Mail, Lock, LogIn, ArrowLeft, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase, supabaseService } from '../services/supabase';

const Login: React.FC<{ onLogin?: any }> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<{ message: string, type?: 'unconfirmed' } | null>(null);
  const navigate = useNavigate();

  const handleSocialLogin = async (provider: 'google' | 'linkedin_oidc') => {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/#/'
      }
    });
    if (authError) setError({ message: "Erro ao conectar com provedor social." });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      if (authError.message.toLowerCase().includes('email not confirmed')) {
        setError({ message: "Verifique seu email antes de continuar.", type: 'unconfirmed' });
      } else {
        setError({ message: "Credenciais inválidas ou erro no acesso." });
      }
      setLoading(false);
    } else {
      if (data.user && !data.user.email_confirmed_at) {
        setError({ message: "Verifique seu email antes de continuar.", type: 'unconfirmed' });
        setLoading(false);
        await supabase.auth.signOut();
      } else {
        navigate(AppRoute.DASHBOARD);
      }
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await supabaseService.resendConfirmationEmail(email);
      alert("Email de confirmação reenviado! Verifique sua caixa de entrada.");
    } catch (err) {
      alert("Erro ao reenviar email. Tente novamente mais tarde.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-md w-full">
        <Link to={AppRoute.LANDING} className="inline-flex items-center text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest mb-8 hover:text-brand-dark dark:hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Início
        </Link>
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 dark:border-slate-800 transition-all">
            <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-brand-dark dark:text-white tracking-tighter">De volta ao <br/><span className="text-brand-blue">Progresso</span></h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium">Acesse sua conta para gerenciar seu futuro.</p>
            </div>

            {error && (
                <div className={`mb-6 p-5 rounded-2xl border animate-in fade-in zoom-in duration-300 ${error.type === 'unconfirmed' ? 'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/30' : 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/30'}`}>
                    <div className="flex items-center space-x-3 mb-2">
                        <AlertCircle className={`h-5 w-5 ${error.type === 'unconfirmed' ? 'text-amber-500' : 'text-red-500'}`} />
                        <span className={`text-xs font-black uppercase tracking-widest ${error.type === 'unconfirmed' ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'}`}>Atenção</span>
                    </div>
                    <p className={`text-sm font-medium ${error.type === 'unconfirmed' ? 'text-amber-700 dark:text-amber-200' : 'text-red-600 dark:text-red-200'}`}>
                        {error.message}
                    </p>
                    {error.type === 'unconfirmed' && (
                        <button 
                            onClick={handleResend}
                            disabled={resending}
                            className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-amber-800 dark:text-amber-400 hover:underline flex items-center disabled:opacity-50"
                        >
                            {resending ? <Loader2 size={12} className="animate-spin mr-2" /> : 'Reenviar email de confirmação'}
                        </button>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email</label>
                  <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-600" />
                  <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all font-medium text-sm text-brand-dark dark:text-white"
                      placeholder="email@exemplo.com"
                  />
                  </div>
              </div>

              <div className="space-y-3">
                  <div className="flex justify-between items-center">
                      <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Senha</label>
                      <Link to={AppRoute.FORGOT_PASSWORD} className="text-[10px] text-brand-blue font-black uppercase tracking-widest hover:underline">Recuperar</Link>
                  </div>
                  <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-600" />
                  <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all font-medium text-sm text-brand-dark dark:text-white"
                      placeholder="••••••••"
                  />
                  <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 hover:text-slate-500 transition-colors focus:outline-none"
                  >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  </div>
              </div>

              <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-blue text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50"
              >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><LogIn className="mr-3 h-5 w-5" /> ENTRAR</>}
              </button>
            </form>

            <div className="my-8 flex items-center space-x-4">
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
              <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Ou entre com</span>
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center px-4 py-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
              >
                <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-5 w-5 mr-3" alt="Google" />
                <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Google</span>
              </button>
              <button 
                onClick={() => handleSocialLogin('linkedin_oidc')}
                className="flex items-center justify-center px-4 py-4 border border-[#0077B5] dark:border-[#0077B5]/30 rounded-2xl bg-[#0077B5] hover:bg-[#005a8a] transition-all group"
              >
                <img src="https://www.svgrepo.com/show/448234/linkedin.svg" className="h-5 w-5 mr-3 brightness-0 invert" alt="LinkedIn" />
                <span className="text-xs font-black text-white uppercase tracking-widest">LinkedIn</span>
              </button>
            </div>

            <div className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
            Primeira vez por aqui? <br/>
            <Link to={AppRoute.REGISTER} className="text-brand-blue font-black uppercase tracking-widest text-xs mt-2 inline-block hover:underline">Crie sua conta agora</Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
