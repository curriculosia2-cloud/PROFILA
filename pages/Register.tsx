
import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoute, User } from '../types';
import { Mail, Lock, User as UserIcon, Loader2, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { supabase } from '../services/supabase';

interface RegisterProps {
  onRegister: (user: User) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreed) {
        setError("Você precisa concordar com os Termos e Privacidade para continuar.");
        return;
    }

    if (password !== confirmPassword) {
        setError("As senhas não coincidem!");
        return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (authError) throw authError;

      if (data.user) {
        const newUser: User = {
          id: data.user.id,
          email: data.user.email!,
          name: name,
          plan: 'free',
          subscriptionStatus: 'active',
          emailConfirmed: data.user.email_confirmed_at ? true : false
        };
        
        onRegister(newUser);
        navigate(AppRoute.DASHBOARD);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-50 dark:bg-brand-dark transition-colors duration-300">
      <div className="max-w-md w-full">
        <Link to={AppRoute.LANDING} className="inline-flex items-center text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-8 hover:text-brand-blue transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Link>
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 dark:border-white/5 relative overflow-hidden transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 blur-3xl -mr-16 -mt-16"></div>
            
            <div className="text-center mb-10 relative z-10">
                <div className="inline-flex items-center space-x-2 bg-gradient-brand p-2 rounded-xl mb-6 shadow-lg shadow-blue-500/20">
                    <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-brand-dark dark:text-white tracking-tighter font-display">Criar Conta <span className="text-brand-purple">WorkGen</span></h2>
                <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-sm">Junte-se a profissionais de elite.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-2xl text-xs font-bold text-center border border-red-100 dark:border-red-900/30 animate-in fade-in zoom-in">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-white/20" />
                        <input 
                            type="text" required
                            value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium text-sm dark:text-white"
                            placeholder="Seu nome"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-white/20" />
                        <input 
                            type="email" required
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium text-sm dark:text-white"
                            placeholder="seu@email.com"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Senha</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} required
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 pr-12 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium text-sm dark:text-white"
                                placeholder="••••"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-white/20">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Confirmar</label>
                        <div className="relative">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} required
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-6 pr-12 py-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium text-sm dark:text-white"
                                placeholder="••••"
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-white/20">
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ACEITE DE TERMOS E PRIVACIDADE */}
                <div className="flex items-start space-x-3 pt-2">
                    <div className="relative flex items-center h-5">
                      <input 
                        id="terms"
                        type="checkbox" 
                        required
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="h-5 w-5 rounded-lg border-slate-200 dark:border-white/10 text-brand-blue focus:ring-brand-blue bg-slate-50 dark:bg-white/5 transition-all cursor-pointer appearance-none checked:bg-brand-blue checked:border-brand-blue relative" 
                      />
                      {agreed && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <label htmlFor="terms" className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight cursor-pointer select-none">
                      Concordo com os <Link to="#" className="text-brand-blue hover:underline">Termos</Link> e <Link to="#" className="text-brand-blue hover:underline">Privacidade</Link>.
                    </label>
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-brand text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center btn-glow transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'CRIAR MINHA CONTA'}
                </button>
            </form>

            <div className="mt-10 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
                Já tem uma conta? <Link to={AppRoute.LOGIN} className="text-brand-blue font-black uppercase tracking-widest text-[10px] hover:underline ml-1">Entrar</Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
