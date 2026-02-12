
import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ResumeData, AppRoute, PLANS } from '../types';
import { Plus, FileText, Calendar, Edit2, Download, Trash2, Crown, Zap, Settings, Loader2, ExternalLink } from 'lucide-react';
import { supabaseService } from '../services/supabase';
import { stripeService } from '../services/stripeService';

interface DashboardProps {
  resumes: ResumeData[];
  user: User;
  setCurrentResume: (resume: ResumeData) => void;
  onOpenPlans: () => void;
  onRefreshResumes: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ resumes, user, setCurrentResume, onOpenPlans, onRefreshResumes }) => {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const planDetails = PLANS[user.plan];
  const isLimitReached = resumes.length >= planDetails.maxResumes;

  const handleEdit = (resume: ResumeData) => {
    setCurrentResume(resume);
    navigate(AppRoute.CUSTOMIZE);
  };

  const handlePortal = async () => {
    setLoadingPortal(true);
    try {
      await stripeService.createPortalSession();
    } catch (err) {
      alert("Erro ao abrir portal de cobrança.");
    } finally {
      setLoadingPortal(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este currículo?")) return;
    setDeletingId(id);
    try {
      await supabaseService.deleteResume(id);
      onRefreshResumes();
    } catch (err) {
      alert("Erro ao excluir currículo.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 selection:bg-brand-blue selection:text-white transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h1 className="text-4xl font-black text-brand-dark dark:text-white tracking-tight mb-3">Bem-vindo, {user.name.split(' ')[0]}!</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Gerencie sua carreira em um só lugar.</p>
        </div>
        <Link 
          to={isLimitReached ? "#" : AppRoute.CREATE}
          className={`px-10 py-5 rounded-2xl font-black text-lg flex items-center justify-center transition-all shadow-xl ${isLimitReached ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none' : 'bg-brand-blue text-white hover:bg-blue-700 shadow-blue-500/20'}`}
        >
          <Plus className="mr-3 h-6 w-6" /> NOVO CURRÍCULO
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-black text-brand-dark dark:text-slate-300 uppercase tracking-widest text-xs mb-10">Sua Assinatura</h3>
            
            <div className={`inline-flex items-center space-x-3 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest mb-8 ${user.plan === 'premium' ? 'bg-indigo-600 text-white' : user.plan === 'pro' ? 'bg-brand-blue text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
              {(user.plan === 'pro' || user.plan === 'premium') && <Crown className="h-4 w-4" />}
              <span>Plano {planDetails.name}</span>
            </div>
            
            <div className="space-y-4 mb-10">
                <div className="flex justify-between text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    <span>Espaço Usado</span>
                    <span>{resumes.length} / {planDetails.maxResumes === Infinity ? '∞' : planDetails.maxResumes}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ${isLimitReached ? 'bg-red-500' : 'bg-brand-blue'}`}
                        style={{ width: `${Math.min((resumes.length / (planDetails.maxResumes === Infinity ? 10 : planDetails.maxResumes)) * 100, 100)}%` }}
                    ></div>
                </div>
            </div>

            {user.plan === 'free' ? (
              <Link to={AppRoute.PLANS} className="w-full bg-brand-blue text-white py-5 rounded-2xl font-black text-sm flex items-center justify-center hover:bg-blue-600 transition-all">
                <Zap className="h-4 w-4 mr-2 text-yellow-400 fill-yellow-400" /> FAZER UPGRADE
              </Link>
            ) : (
              <button onClick={handlePortal} disabled={loadingPortal} className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-5 rounded-2xl font-black text-sm flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                {loadingPortal ? <Loader2 className="animate-spin h-4 w-4" /> : <><ExternalLink className="h-4 w-4 mr-2" /> COBRANÇA</>}
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          <h3 className="font-black text-brand-dark dark:text-slate-300 uppercase tracking-widest text-xs mb-10">Documentos Recentes</h3>
          
          {resumes.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] p-24 text-center">
              <FileText className="h-16 w-16 text-slate-200 dark:text-slate-800 mx-auto mb-8" />
              <h4 className="text-2xl font-black text-brand-dark dark:text-white mb-4">Nenhum currículo ainda</h4>
              <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">Comece agora mesmo a criar sua melhor versão profissional.</p>
              <Link to={AppRoute.CREATE} className="inline-flex items-center bg-brand-blue text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20">CRIAR MEU PRIMEIRO</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {resumes.map((resume) => (
                <div key={resume.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex items-start justify-between mb-8">
                    <div className="bg-brand-blue/10 dark:bg-brand-blue/20 p-4 rounded-2xl">
                      <FileText className="h-7 w-7 text-brand-blue" />
                    </div>
                    <button 
                      onClick={() => handleDelete(resume.id)}
                      className="p-3 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      {deletingId === resume.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                    </button>
                  </div>
                  <h4 className="text-xl font-black text-brand-dark dark:text-white mb-2 truncate group-hover:text-brand-blue transition-colors">{resume.title || resume.personalInfo.profession}</h4>
                  <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-8">
                    <Calendar className="h-3.5 w-3.5 mr-2" />
                    {new Date(resume.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleEdit(resume)}
                      className="flex-1 bg-slate-900 dark:bg-slate-800 text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-dark dark:hover:bg-slate-700 transition-all"
                    >
                      EDITAR
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentResume(resume);
                        navigate(AppRoute.EXPORT);
                      }}
                      className="flex-1 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center"
                    >
                      <Download className="h-4 w-4 mr-2" /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
