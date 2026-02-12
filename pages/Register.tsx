
// Fix: Use namespace import to correctly populate global JSX.IntrinsicElements
import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoute, User } from '../types';
import { Mail, Lock, User as UserIcon, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface RegisterProps {
  onRegister: (user: User) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSocialRegister = (provider: string) => {
    setError(`O registro via ${provider} está temporariamente desativado. Use o formulário abaixo.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setError("As senhas não coincidem!");
        return;
    }
    
    setLoading(true);
    setError(null);

    // Simulação de registro local
    setTimeout(() => {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        plan: 'free',
        subscriptionStatus: 'active',
        emailConfirmed: true
      };
      
      onRegister(newUser);
      navigate(AppRoute.DASHBOARD);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-md w-full">
        <Link to={AppRoute.LANDING} className="inline-flex items-center text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest mb-8 hover:text-brand-dark dark:hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Link>
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 dark:border-slate-800 transition-all">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-brand-dark dark:text-white tracking-tighter">Novo <span className="text-brand-blue">Começo</span></h2>
                <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium">Junte-se a milhares de profissionais.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-xl text-xs font-bold text-center border border-red-100 dark:border-red-900/30">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-600" />
                        <input 
                            type="text" required
                            value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium text-sm text-brand-dark dark:text-white"
                            placeholder="Seu nome"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-600" />
                        <input 
                            type="email" required
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium text-sm text-brand-dark dark:text-white"
                            placeholder="seu@email.com"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Senha</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                required
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 pr-12 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium text-sm text-brand-dark dark:text-white"
                                placeholder="••••"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 hover:text-slate-500 transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Confirmar</label>
                        <div className="relative">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                required
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-6 pr-12 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium text-sm text-brand-dark dark:text-white"
                                placeholder="••••"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 hover:text-slate-500 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-start space-x-2 pt-2">
                    <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-brand-blue focus:ring-brand-blue bg-white dark:bg-slate-950" />
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight">Concordo com os Termos e Privacidade.</span>
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-blue text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'CRIAR CONTA GRÁTIS'}
                </button>
            </form>

            <div className="mt-10 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
                Já tem conta? <Link to={AppRoute.LOGIN} className="text-brand-blue font-black uppercase tracking-widest text-xs hover:underline ml-1">Entrar</Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
