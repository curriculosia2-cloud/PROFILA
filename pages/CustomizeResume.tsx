
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ResumeData, AppRoute, User, PLANS, TemplateId } from '../types';
import { 
  Check, Palette, Type, Layout as LayoutIcon, Camera, Save, 
  Download, Lock, Sparkles, ChevronLeft, MoveVertical, 
  Crown, Edit3, Globe, Zap, Cpu, Award, ListFilter, EyeOff, User as UserIcon
} from 'lucide-react';
import { TemplateRenderer } from '../components/Templates';

interface CustomizeResumeProps {
  resume: ResumeData;
  onSave: (resume: ResumeData) => void;
  user: User;
  onOpenPlans: () => void;
}

const CustomizeResume: React.FC<CustomizeResumeProps> = ({ resume, onSave, user, onOpenPlans }) => {
  const [localData, setLocalData] = useState<ResumeData>({
    ...resume,
    customization: {
      ...resume.customization,
      lineSpacing: resume.customization.lineSpacing || 1.2,
      sectionSpacing: resume.customization.sectionSpacing || 24
    }
  });
  const [isGenerating, setIsGenerating] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'pro' | 'premium' | 'ats'>('all');
  const navigate = useNavigate();
  const planDetails = PLANS[user.plan];

  useEffect(() => {
    const timer = setTimeout(() => setIsGenerating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdate = (updates: Partial<ResumeData['customization']>) => {
    setLocalData(prev => ({
      ...prev,
      customization: { ...prev.customization, ...updates }
    }));
  };

  const templatesList = [
    { id: 'classic', name: 'Clássico', category: 'free', minPlan: 'free', icon: <LayoutIcon size={14} /> },
    { id: 'clean', name: 'Clean', category: 'free', minPlan: 'free', icon: <Award size={14} /> },
    { id: 'modern-column', name: 'Modern Column', category: 'pro', minPlan: 'pro', icon: <Type size={14} /> },
    { id: 'modern-blocks', name: 'Modern Blocks', category: 'pro', minPlan: 'pro', icon: <Zap size={14} /> },
    { id: 'elegant', name: 'Elegante', category: 'pro', minPlan: 'pro', icon: <Sparkles size={14} /> },
    { id: 'timeline', name: 'Timeline', category: 'pro', minPlan: 'pro', icon: <MoveVertical size={14} /> },
    { id: 'tech', name: 'Tech Dev', category: 'premium', minPlan: 'premium', icon: <Cpu size={14} /> },
    { id: 'executive', name: 'Executivo', category: 'premium', minPlan: 'premium', icon: <Crown size={14} /> },
    { id: 'creative', name: 'Criativo', category: 'premium', minPlan: 'premium', icon: <Palette size={14} /> },
    { id: 'ats-simple', name: 'ATS Simple', category: 'ats', minPlan: 'premium', icon: <ListFilter size={14} /> },
    { id: 'compact', name: 'Compacto', category: 'premium', minPlan: 'premium', icon: <LayoutIcon size={14} /> },
    { id: 'international', name: 'International', category: 'premium', minPlan: 'premium', icon: <Globe size={14} /> },
  ];

  const filteredTemplates = templatesList.filter(t => 
    activeFilter === 'all' || t.category === activeFilter
  );

  const colors = ['#0F172A', '#2563EB', '#16a34a', '#dc2626', '#7c3aed', '#f59e0b'];
  const fonts = ['Inter', 'Georgia', 'Arial', 'Times New Roman'];

  const isTemplateLocked = (minPlan: string) => {
    const plansOrder = ['free', 'pro', 'premium'];
    return plansOrder.indexOf(user.plan) < plansOrder.indexOf(minPlan);
  };

  if (isGenerating) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <Sparkles className="h-12 w-12 text-brand-blue animate-bounce mb-6" />
        <h2 className="text-3xl font-black text-brand-dark dark:text-white tracking-tighter mb-4">Polindo sua Carreira...</h2>
        <div className="mt-8 w-48 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-brand-blue h-full animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8 selection:bg-brand-blue selection:text-white">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LADO ESQUERDO: PREVIEW A4 REALISTA */}
        <div className="w-full lg:flex-1 bg-slate-200 dark:bg-slate-800 rounded-[3rem] p-4 md:p-12 flex justify-center items-start min-h-[900px] shadow-inner overflow-hidden transition-colors">
          <div 
            id="resume-preview-container"
            className="bg-white shadow-2xl w-full max-w-[210mm] min-h-[297mm] transition-all relative overflow-hidden"
            style={{ 
              fontFamily: localData.customization.fontFamily,
              lineHeight: localData.customization.lineSpacing
            }}
          >
            {planDetails.hasWatermark && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                <div className="rotate-[-35deg] text-brand-dark opacity-[0.05] font-black text-7xl tracking-[0.2em] whitespace-nowrap">
                  CRIADO COM PROFILA
                </div>
              </div>
            )}
            <TemplateRenderer data={localData} />
          </div>
        </div>

        {/* LADO DIREITO: PAINEL DE AÇÕES E CUSTOMIZAÇÃO */}
        <div className="w-full lg:w-[450px] space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
            <button 
              onClick={() => {
                onSave(localData);
                navigate(AppRoute.EXPORT);
              }}
              className="w-full bg-brand-blue text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 active:scale-95 group"
            >
              <Download className="mr-3 h-5 w-5" /> BAIXAR PDF
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate(AppRoute.CREATE)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-4 rounded-xl font-bold text-xs uppercase tracking-widest border border-slate-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-750 transition-all"
              >
                <Edit3 className="mr-2 h-4 w-4" /> Editar
              </button>
              <button 
                onClick={() => {
                   onSave(localData);
                   alert("Currículo salvo com sucesso!");
                }}
                className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-4 rounded-xl font-bold text-xs uppercase tracking-widest border border-slate-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-750 transition-all"
              >
                <Save className="mr-2 h-4 w-4" /> Salvar
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-10 transition-colors">
            
            {/* Seletor de Modelo */}
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Biblioteca de Modelos</h4>
              <div className="flex flex-wrap gap-2">
                {['all', 'free', 'pro', 'premium', 'ats'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setActiveFilter(f as any)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeFilter === f ? 'bg-brand-blue text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}
                  >
                    {f === 'all' ? 'Todos' : f}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredTemplates.map(t => {
                  const locked = isTemplateLocked(t.minPlan);
                  return (
                    <button 
                      key={t.id}
                      onClick={() => locked ? navigate(AppRoute.PLANS) : handleUpdate({ template: t.id as any })}
                      className={`relative aspect-[3/4] rounded-2xl border-2 transition-all p-4 flex flex-col items-center justify-center text-center group ${localData.customization.template === t.id ? 'border-brand-blue bg-blue-50/20 dark:bg-brand-blue/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                    >
                      <div className={`mb-3 p-3 rounded-xl ${localData.customization.template === t.id ? 'bg-brand-blue text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-100'}`}>
                        {t.icon}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${localData.customization.template === t.id ? 'text-brand-blue' : 'text-slate-600 dark:text-slate-400'}`}>
                        {t.name}
                      </span>
                      {locked && (
                        <div className="absolute top-2 right-2 p-1.5 bg-slate-900/5 dark:bg-white/5 rounded-lg">
                          <Lock size={10} className="text-slate-400" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estilo Visual */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Estilo Visual</h4>
              <div className={`flex flex-wrap gap-4 ${user.plan === 'free' ? 'opacity-30 pointer-events-none' : ''}`}>
                {colors.map(c => (
                  <button 
                    key={c}
                    onClick={() => handleUpdate({ primaryColor: c })}
                    className={`w-10 h-10 rounded-2xl border-2 transition-all ${localData.customization.primaryColor === c ? 'border-brand-blue scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: c }}
                  >
                    {localData.customization.primaryColor === c && <Check className="h-4 w-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
               <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Exibir Foto de Perfil</span>
               <button 
                onClick={() => handleUpdate({ showPhoto: !localData.customization.showPhoto })}
                className={`w-12 h-6 rounded-full transition-all relative ${localData.customization.showPhoto ? 'bg-brand-blue' : 'bg-slate-300 dark:bg-slate-700'}`}
               >
                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${localData.customization.showPhoto ? 'right-1' : 'left-1'}`}></div>
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeResume;
