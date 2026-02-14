
import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoute, User } from '../types';
import { Mail, Lock, LogIn, ArrowLeft, Loader2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { supabase, supabaseService } from '../services/supabase';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        const profile = await supabaseService.getProfile(data.user.id);
        onLogin({
          id: data.user.id,
          email: data.user.email!,
          name: profile?.name || data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
          plan: profile?.plan || 'free',
          subscriptionStatus: 'active',
          emailConfirmed: data.user.email_confirmed_at ? true : false
        });
        navigate(AppRoute.DASHBOARD);
      }
    } catch (err: any) {
      setError(err.message || "Credenciais inválidas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-50 dark:bg-brand-dark transition-colors duration-300">
      <div className="max-w-md w-full">
        <Link to={AppRoute.LANDING} className="inline-flex items-center text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-8 hover:text-brand-blue transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Home
        </Link>
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 dark:border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 blur-3xl -mr-16 -mt-16"></div>
            
            <div className="text-center mb-10 relative z-10">
                <div className="inline-flex items-center space-x-2 bg-gradient-brand p-2 rounded-xl mb-6 shadow-lg shadow-blue-500/20">
                    <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-brand-dark dark:text-white tracking-tighter">Entrar na <span className="text-brand-purple">WorkGen</span></h2>
                <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-sm">Acesse sua inteligência de carreira.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-xs font-bold text-red-600 dark:text-red-400 text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-white/20" />
                    <input 
                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium text-sm dark:text-white"
                        placeholder="seu@email.com"
                    />
                  </div>
              </div>

              <div className="space-y-2">
                  <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Senha</label>
                      <Link to={AppRoute.FORGOT_PASSWORD} className="text-[9px] text-brand-blue font-black uppercase tracking-widest hover:underline">Recuperar</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-white/20" />
                    <input 
                        type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium text-sm dark:text-white"
                        placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-white/20">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
              </div>

              <button 
                  type="submit" disabled={loading}
                  className="w-full bg-gradient-brand text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center btn-glow transition-all"
              >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><LogIn className="mr-3 h-5 w-5" /> ENTRAR</>}
              </button>
            </form>

            <div className="text-center mt-10 text-slate-500 dark:text-slate-400 text-sm font-medium">
                Novo por aqui? <Link to={AppRoute.REGISTER} className="text-brand-blue font-black uppercase tracking-widest text-[10px] hover:underline ml-1">Criar conta grátis</Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
