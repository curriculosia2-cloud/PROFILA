
import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ResumeData, AppRoute, PLANS } from '../types';
import { Plus, FileText, Calendar, Edit2, Download, Trash2, Crown, Zap, Loader2, Sparkles } from 'lucide-react';

interface DashboardProps {
  resumes: ResumeData[];
  user: User;
  setCurrentResume: (resume: ResumeData) => void;
  onOpenPlans: () => void;
  onDeleteResume: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ resumes, user, setCurrentResume, onOpenPlans, onDeleteResume }) => {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const planDetails = PLANS[user.plan];
  const isLimitReached = resumes.length >= planDetails.maxResumes;

  const handleEdit = (resume: ResumeData) => {
    setCurrentResume(resume);
    navigate(AppRoute.CUSTOMIZE);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Deseja apagar este currículo definitivamente?")) return;
    setDeletingId(id);
    setTimeout(() => {
      onDeleteResume(id);
      setDeletingId(null);
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue mb-4">
            <Sparkles size={20} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">WorkGen Intelligence 1.0</span>
          </div>
          <h1 className="text-4xl font-black text-brand-dark dark:text-white tracking-tighter mb-2">Olá, {user.name.split(' ')[0]}!</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Sua trajetória profissional começa aqui.</p>
        </div>
        <Link 
          to={isLimitReached ? "#" : AppRoute.CREATE}
          className={`px-10 py-5 rounded-2xl font-black text-lg flex items-center justify-center transition-all shadow-xl ${isLimitReached ? 'bg-slate-200 dark:bg-white/5 text-slate-400 cursor-not-allowed' : 'bg-gradient-brand text-white btn-glow shadow-blue-500/20'}`}
          onClick={(e) => isLimitReached && e.preventDefault()}
        >
          <Plus className="mr-3 h-6 w-6" /> NOVO CURRÍCULO
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-brand"></div>
            <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-widest mb-10">Assinatura Atual</h3>
            
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest mb-8 ${user.plan === 'free' ? 'bg-slate-100 dark:bg-white/10 text-slate-500' : 'bg-brand-accent/20 text-brand-accent'}`}>
              <Crown className="h-3 w-3" />
              <span>Plano {planDetails.name}</span>
            </div>
            
            <div className="space-y-4 mb-10">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Espaço Usado</span>
                    <span className="text-brand-blue">{resumes.length} / {planDetails.maxResumes === Infinity ? '∞' : planDetails.maxResumes}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-brand transition-all duration-1000"
                        style={{ width: `${Math.min((resumes.length / (planDetails.maxResumes === Infinity ? 10 : planDetails.maxResumes)) * 100, 100)}%` }}
                    ></div>
                </div>
            </div>

            {user.plan === 'free' && (
              <button onClick={onOpenPlans} className="w-full bg-slate-900 dark:bg-white text-white dark:text-brand-dark py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all">
                TURBINAR CONTA
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-widest mb-8 ml-2">Documentos Criados</h3>
          
          {resumes.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[3rem] p-24 text-center">
              <FileText className="h-16 w-16 text-slate-200 dark:text-white/5 mx-auto mb-8" />
              <h4 className="text-2xl font-black text-brand-dark dark:text-white mb-4">Nenhum currículo encontrado</h4>
              <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">Sua IA está pronta para escrever o primeiro.</p>
              <Link to={AppRoute.CREATE} className="inline-flex items-center bg-gradient-brand text-white px-8 py-4 rounded-2xl font-black shadow-lg">COMEÇAR AGORA</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resumes.map((resume) => (
                <div key={resume.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex items-start justify-between mb-8">
                    <div className="bg-brand-blue/5 p-4 rounded-2xl group-hover:bg-brand-blue/10 transition-colors">
                      <FileText className="h-7 w-7 text-brand-blue" />
                    </div>
                    <button onClick={() => handleDelete(resume.id)} className="p-3 text-slate-300 hover:text-red-500 transition-colors">
                      {deletingId === resume.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                    </button>
                  </div>
                  <h4 className="text-lg font-black text-brand-dark dark:text-white mb-2 truncate group-hover:text-brand-blue transition-colors">
                    {resume.title || resume.personalInfo.profession || 'Novo Currículo'}
                  </h4>
                  <div className="flex items-center text-[10px] text-slate-400 font-black uppercase tracking-widest mb-8">
                    <Calendar className="h-3.5 w-3.5 mr-2" />
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleEdit(resume)}
                      className="flex-1 bg-brand-dark dark:bg-white text-white dark:text-brand-dark py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                    >
                      EDITAR
                    </button>
                    <button 
                      onClick={() => { setCurrentResume(resume); navigate(AppRoute.EXPORT); }}
                      className="flex-1 border border-slate-200 dark:border-white/10 text-slate-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                    >
                      DOWNLOAD
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
