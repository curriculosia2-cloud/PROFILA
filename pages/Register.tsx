
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import { Mail, Lock, User as UserIcon, Loader2, ArrowLeft } from 'lucide-react';
import { supabase, supabaseService } from '../services/supabase';

const Register: React.FC<{ onRegister: any }> = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setError("As senhas não coincidem!");
        return;
    }
    
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else if (data.user) {
      // Create user profile in profiles table
      try {
        await supabaseService.updateProfile(data.user.id, { name, plan: 'free' });
        navigate(AppRoute.DASHBOARD);
      } catch (profileError) {
        console.error("Erro ao criar perfil:", profileError);
        navigate(AppRoute.DASHBOARD);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full">
        <Link to={AppRoute.LANDING} className="inline-flex items-center text-slate-400 font-bold text-xs uppercase tracking-widest mb-8 hover:text-brand-dark transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Link>
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-brand-dark tracking-tighter">Novo <span className="text-brand-blue">Começo</span></h2>
                <p className="text-slate-500 mt-4 font-medium">Junte-se a milhares de profissionais.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-xl text-xs font-bold text-center border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                        <input 
                            type="text" required
                            value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium"
                            placeholder="Seu nome"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                        <input 
                            type="email" required
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium"
                            placeholder="seu@email.com"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
                        <input 
                            type="password" required
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium"
                            placeholder="••••"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirmar</label>
                        <input 
                            type="password" required
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium"
                            placeholder="••••"
                        />
                    </div>
                </div>

                <div className="flex items-start space-x-2 pt-2">
                    <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Concordo com os Termos e Privacidade.</span>
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-blue text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'CRIAR CONTA GRÁTIS'}
                </button>
            </form>

            <div className="mt-10 text-center text-slate-500 text-sm font-medium">
                Já tem conta? <Link to={AppRoute.LOGIN} className="text-brand-blue font-black uppercase tracking-widest text-xs hover:underline ml-1">Entrar</Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
