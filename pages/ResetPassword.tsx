
// Fix: Use namespace import to correctly populate global JSX.IntrinsicElements
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import { Lock, Loader2, CheckCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { supabase } from '../services/supabase';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Supabase Auth handles the recovery session automatically when landing from the email link
  // The session is established by the token in the URL fragment

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }
    if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    setLoading(true);
    setError(null);

    const { error: resetError } = await supabase.auth.updateUser({
      password: password
    });

    if (resetError) {
      setError("O link de recuperação pode ter expirado ou é inválido. Tente solicitar um novo.");
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => navigate(AppRoute.LOGIN), 3000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
            <div className="text-center mb-10">
                <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-blue shadow-inner">
                    <ShieldCheck size={32} />
                </div>
                <h2 className="text-4xl font-black text-brand-dark tracking-tighter">Nova <br/><span className="text-brand-blue">Segurança</span></h2>
                <p className="text-slate-500 mt-4 font-medium leading-relaxed">Crie uma senha forte para proteger seu futuro profissional.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold text-center border border-red-100">
                    {error}
                </div>
            )}

            {success ? (
                <div className="text-center p-8 animate-in fade-in zoom-in duration-500">
                    <div className="bg-green-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-green-500/20">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-black text-brand-dark mb-2">Senha Atualizada!</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Sua senha foi redefinida com sucesso. Redirecionando para o login...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nova Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                            <input 
                                type={showPassword ? "text" : "password"} required
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium"
                                placeholder="••••••••"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirmar Nova Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                            <input 
                                type="password" required
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue outline-none transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-blue text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'REDEFINIR SENHA AGORA'}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
