
// Fix: Use namespace import to correctly populate global JSX.IntrinsicElements
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

  const colors = [
    '#0F172A', '#2563EB', '#16a34a', '#dc2626', '#7c3aed', '#f59e0b'
  ];

  const fonts = [
    'Inter', 'Georgia', 'Arial', 'Times New Roman'
  ];

  const isTemplateLocked = (minPlan: string) => {
    const plansOrder = ['free', 'pro', 'premium'];
    return plansOrder.indexOf(user.plan) < plansOrder.indexOf(minPlan);
  };

  if (isGenerating) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-brand-blue rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl">
             <Sparkles className="h-12 w-12 text-brand-blue animate-bounce" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-brand-dark tracking-tighter mb-4">Gerando seu futuro...</h2>
        <p className="text-slate-500 max-w-xs font-medium leading-relaxed">Nossa IA está polindo cada detalhe e organizando suas conquistas com precisão cirúrgica.</p>
        <div className="mt-8 w-48 bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-brand-blue h-full animate-[progress_2s_ease-in-out_infinite]"></div>
        </div>
        <style>{`
          @keyframes progress {
            0% { width: 0%; transform: translateX(-100%); }
            100% { width: 100%; transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8 selection:bg-brand-blue selection:text-white">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LADO ESQUERDO: PREVIEW A4 REALISTA */}
        <div className="w-full lg:flex-1 bg-slate-100 rounded-[3rem] p-4 md:p-12 flex justify-center items-start min-h-[900px] border border-slate-200 shadow-inner overflow-hidden">
          <div 
            id="resume-preview-container"
            className="bg-white shadow-2xl w-full max-w-[210mm] min-h-[297mm] transition-all relative overflow-hidden origin-top scale-100"
            style={{ 
              fontFamily: localData.customization.fontFamily,
              lineHeight: localData.customization.lineSpacing
            }}
          >
            {/* MARCA D'ÁGUA PLANO FREE */}
            {planDetails.hasWatermark && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                <div className="rotate-[-35deg] text-brand-dark opacity-[0.06] font-black text-7xl tracking-[0.2em] whitespace-nowrap">
                  CRIADO COM PROFILA
                </div>
              </div>
            )}

            <TemplateRenderer data={localData} />
          </div>
        </div>

        {/* LADO DIREITO: PAINEL DE AÇÕES E CUSTOMIZAÇÃO */}
        <div className="w-full lg:w-[450px] space-y-6">
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
            <button 
              onClick={() => {
                onSave(localData);
                navigate(AppRoute.EXPORT);
              }}
              className="w-full bg-brand-blue text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 active:scale-95 group"
            >
              <Download className="mr-3 h-5 w-5 group-hover:translate-y-0.5 transition-transform" /> BAIXAR PDF
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate(AppRoute.CREATE)}
                className="bg-slate-50 text-slate-600 py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center border border-slate-100 hover:bg-white transition-all"
              >
                <Edit3 className="mr-2 h-4 w-4" /> Editar
              </button>
              <button 
                onClick={() => {
                   onSave(localData);
                   alert("Currículo salvo com sucesso!");
                }}
                className="bg-slate-50 text-slate-600 py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center border border-slate-100 hover:bg-white transition-all"
              >
                <Save className="mr-2 h-4 w-4" /> Salvar
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
            
            {/* Miniatura de Perfil Lateral */}
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center space-x-6">
              <div className="relative">
                <div className={`w-20 h-20 bg-white shadow-md overflow-hidden flex items-center justify-center transition-all ${localData.personalInfo.photoShape === 'circle' ? 'rounded-full' : localData.personalInfo.photoShape === 'rounded' ? 'rounded-2xl' : 'rounded-none'}`}>
                  {localData.personalInfo.photoDataUrl ? (
                    <img src={localData.personalInfo.photoDataUrl} className={`w-full h-full object-cover transition-all ${!localData.customization.showPhoto ? 'grayscale opacity-30 scale-95' : ''}`} alt="Miniatura" />
                  ) : (
                    <UserIcon className="text-slate-200 h-10 w-10" />
                  )}
                  {!localData.customization.showPhoto && localData.personalInfo.photoDataUrl && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                      <EyeOff size={20} />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-sm border border-slate-100">
                   <Camera size={12} className="text-brand-blue" />
                </div>
              </div>
              <div className="flex-1">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Visualização de Perfil</h5>
                <p className="text-xs font-bold text-brand-dark truncate">{localData.personalInfo.fullName || 'Usuário Profila'}</p>
                <span className={`text-[9px] font-black uppercase tracking-widest ${localData.customization.showPhoto ? 'text-green-500' : 'text-slate-400'}`}>
                  {localData.customization.showPhoto ? 'Ativada no Currículo' : 'Oculta no Currículo'}
                </span>
              </div>
            </div>

            {/* Seletor de Modelo Avançado */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center">
                  <LayoutIcon className="mr-2 h-3 w-3" /> Biblioteca de Modelos
                </h4>
              </div>

              {/* Filtros */}
              <div className="flex flex-wrap gap-2">
                {['all', 'free', 'pro', 'premium', 'ats'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setActiveFilter(f as any)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeFilter === f ? 'bg-brand-blue text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {f === 'all' ? 'Todos' : f}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {filteredTemplates.map(t => {
                  const locked = isTemplateLocked(t.minPlan);
                  return (
                    <button 
                      key={t.id}
                      onClick={() => locked ? navigate(AppRoute.PLANS) : handleUpdate({ template: t.id as any })}
                      className={`relative aspect-[3/4] rounded-2xl border-2 transition-all p-4 flex flex-col items-center justify-center text-center group ${localData.customization.template === t.id ? 'border-brand-blue bg-blue-50/20' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                    >
                      <div className={`mb-3 p-3 rounded-xl ${localData.customization.template === t.id ? 'bg-brand-blue text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                        {t.icon}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${localData.customization.template === t.id ? 'text-brand-blue' : 'text-slate-600'}`}>
                        {t.name}
                      </span>
                      {locked && (
                        <div className="absolute top-2 right-2 p-1.5 bg-slate-900/5 backdrop-blur-sm rounded-lg">
                          <Lock size={10} className="text-slate-400" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cores */}
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center">
                  <Palette className="mr-2 h-3 w-3" /> Paleta de Marca
                </h4>
                {user.plan === 'free' && <Lock className="h-3 w-3 text-slate-300" />}
              </div>
              <div className={`flex flex-wrap gap-4 ${user.plan === 'free' ? 'opacity-30 pointer-events-none' : ''}`}>
                {colors.map(c => (
                  <button 
                    key={c}
                    onClick={() => handleUpdate({ primaryColor: c })}
                    className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${localData.customization.primaryColor === c ? 'border-brand-blue scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: c }}
                  >
                    {localData.customization.primaryColor === c && <Check className="h-4 w-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Espaçamento (Premium Only) */}
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center">
                  <MoveVertical className="mr-2 h-3 w-3" /> Tipografia e Layout
                </h4>
                {user.plan !== 'premium' && <Lock className="h-3 w-3 text-slate-300" />}
              </div>
              
              <div className={`space-y-6 ${user.plan !== 'premium' ? 'opacity-30 pointer-events-none' : ''}`}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Linhas</label>
                    <input 
                      type="range" min="1" max="2" step="0.1"
                      value={localData.customization.lineSpacing}
                      onChange={(e) => handleUpdate({ lineSpacing: parseFloat(e.target.value) })}
                      className="w-full accent-brand-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Seções</label>
                    <input 
                      type="range" min="10" max="60" step="2"
                      value={localData.customization.sectionSpacing}
                      onChange={(e) => handleUpdate({ sectionSpacing: parseInt(e.target.value) })}
                      className="w-full accent-brand-blue"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Fonte do Documento</label>
                  <select 
                      value={localData.customization.fontFamily}
                      onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 outline-none"
                  >
                    {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Foto Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="flex items-center">
                 <Camera className="h-4 w-4 mr-3 text-slate-400" />
                 <span className="text-xs font-black uppercase tracking-widest text-slate-600">Exibir Foto de Perfil</span>
               </div>
               <button 
                onClick={() => handleUpdate({ showPhoto: !localData.customization.showPhoto })}
                className={`w-12 h-6 rounded-full transition-all relative ${localData.customization.showPhoto ? 'bg-brand-blue' : 'bg-slate-300'}`}
               >
                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${localData.customization.showPhoto ? 'right-1' : 'left-1'}`}></div>
               </button>
            </div>

          </div>

          {planDetails.hasWatermark && (
             <div className="bg-[#0F172A] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Crown size={80} />
                </div>
                <h5 className="text-lg font-black mb-2 tracking-tight">Desbloquear Premium</h5>
                <p className="text-xs text-slate-400 font-medium mb-6 leading-relaxed">Acesso total a todos os 12 templates e remoção automática da marca d'água.</p>
                <Link 
                  to={AppRoute.PLANS}
                  className="w-full py-4 bg-brand-blue text-white rounded-xl font-black text-center text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 block"
                >
                   VER PLANOS
                </Link>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomizeResume;
