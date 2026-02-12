
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoute, User } from '../types';
import { Mail, Lock, User as UserIcon, Check } from 'lucide-react';

interface RegisterProps {
  onRegister: (user: User) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        alert("As senhas não coincidem!");
        return;
    }
    // Simulate API call
    const mockUser: User = {
      id: Math.random().toString(),
      name: name,
      email: email,
      plan: 'free'
    };
    onRegister(mockUser);
    navigate(AppRoute.DASHBOARD);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Crie sua conta</h2>
          <p className="text-slate-500 mt-2">Comece a criar seu currículo hoje</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Nome Completo</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" required
                value={name} onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Seu nome"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Senha</label>
                <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                    type="password" required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="••••"
                />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Confirmar</label>
                <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                    type="password" required
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="••••"
                />
                </div>
            </div>
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            <span className="text-sm text-slate-500">Concordo com os <Link to="/" className="text-indigo-600 font-bold hover:underline">Termos de Uso</Link> e <Link to="/" className="text-indigo-600 font-bold hover:underline">Política de Privacidade</Link>.</span>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Criar Conta Grátis
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500">
          Já tem uma conta? <Link to={AppRoute.LOGIN} className="text-indigo-600 font-bold hover:underline">Faça login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
