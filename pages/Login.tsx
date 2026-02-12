
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoute, User } from '../types';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email: email,
      plan: 'free'
    };
    onLogin(mockUser);
    navigate(AppRoute.DASHBOARD);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full">
        <Link to={AppRoute.LANDING} className="inline-flex items-center text-slate-400 font-bold text-xs uppercase tracking-widest mb-8 hover:text-brand-dark transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Início
        </Link>
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
            <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-brand-dark tracking-tighter">De volta ao <br/><span className="text-brand-blue">Progresso</span></h2>
            <p className="text-slate-500 mt-4 font-medium">Acesse sua conta para gerenciar seu futuro.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Seu melhor Email</label>
                <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all font-medium"
                    placeholder="email@exemplo.com"
                />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Senha de Acesso</label>
                    <Link to="/" className="text-[10px] text-brand-blue font-black uppercase tracking-widest hover:underline">Recuperar</Link>
                </div>
                <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all font-medium"
                    placeholder="••••••••"
                />
                </div>
            </div>

            <button 
                type="submit"
                className="w-full bg-brand-blue text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98]"
            >
                <LogIn className="mr-3 h-5 w-5" /> ENTRAR NA CONTA
            </button>
            </form>

            <div className="mt-12 text-center text-slate-500 text-sm font-medium">
            Primeira vez por aqui? <br/>
            <Link to={AppRoute.REGISTER} className="text-brand-blue font-black uppercase tracking-widest text-xs mt-2 inline-block hover:underline">Crie sua conta agora</Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
